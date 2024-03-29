"use server";

import { connectToDatabase } from "../database";
import { handleError } from "../utils";
import Products from "../database/models/product.model";
import { revalidatePath } from "next/cache";
import { IProduct } from "../database/models/product.model";

export const getAllProducts = async (limit: number, page?: number) => {
  try {
    await connectToDatabase();

    let productsQuery;
    let productsQueryNoLimit;

    if (page !== undefined) {
      const modifiedLimit = page * limit;
      productsQuery = Products.find({}).limit(modifiedLimit);
    } else {
      productsQuery = Products.find({}).limit(limit);
    }

    productsQueryNoLimit = Products.find({});

    const productsData: IProduct[] = await productsQuery;
    const productsNoLimit: IProduct[] = await productsQueryNoLimit;
    const productsCount = await Products.countDocuments({});

    const newLimit = page && page * limit;

    return {
      products: JSON.parse(JSON.stringify(productsData)),
      productsNoLimit: JSON.parse(JSON.stringify(productsNoLimit)),
      totalPages: Math.ceil(productsCount / limit),
      newLimit,
    };
  } catch (error) {
    handleError(error);
  }
};

export const getProductById = async (productId: string) => {
  try {
    await connectToDatabase();
    const product: IProduct[] | null = await Products.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    handleError(error);
  }
};

export const updateProduct = async ({
  updatedProduct,
  path,
}: UpdateProductParams) => {
  try {
    await connectToDatabase();
    const productToUpdate = await Products.findById(updatedProduct._id);
    if (!productToUpdate) {
      throw new Error("Unauthorized or product not found");
    }
    const product: IProduct | null = await Products.findByIdAndUpdate(
      updatedProduct._id,
      { ...updatedProduct },
      { new: true }
    );
    revalidatePath(path);
    revalidatePath("/shop");
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    handleError(error);
  }
};

export async function getProductsByFilter({
  categoryFilterArray,
  modelFilterArray,
  limit,
  page,
}: GetProductsFilterParams) {
  try {
    await connectToDatabase();

    let productsQuery;
    let conditions;

    if (categoryFilterArray && categoryFilterArray.length >= 1) {
      conditions = {
        original_category: { $in: categoryFilterArray },
      };
    } else if (categoryFilterArray === undefined) {
      conditions = {
        "additional_information.model": {
          $elemMatch: { text: { $in: modelFilterArray } },
        },
      };
    } else if (modelFilterArray && modelFilterArray.length >= 1) {
      conditions = {
        "additional_information.model": {
          $elemMatch: { text: { $in: modelFilterArray } },
        },
      };
    } else if (modelFilterArray === undefined) {
      conditions = {
        original_category: { $in: categoryFilterArray },
      };
    } else if (
      modelFilterArray &&
      categoryFilterArray &&
      modelFilterArray.length >= 1 &&
      categoryFilterArray.length >= 1
    ) {
      conditions = {
        original_category: { $in: categoryFilterArray },
        "additional_information.model": {
          $elemMatch: { text: { $in: modelFilterArray } },
        },
      };
    } else {
      conditions = {};
    }

    const newLimit = page * limit;

    if (page !== undefined) {
      const modifiedLimit = page * limit;
      productsQuery = Products.find(conditions).limit(modifiedLimit);
    } else {
      productsQuery = Products.find(conditions).limit(limit);
    }

    const productsData: IProduct[] = await productsQuery;
    const productsCount = await Products.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(productsData)),
      totalPages: Math.ceil(productsCount / limit),
      newLimit,
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getProductsBySearchInput(query: string) {
  try {
    await connectToDatabase();

    // find the products that match the query using a regular expression
    let conditions;
    let productsQuery;

    if (query) {
      conditions = {
        $or: [
          { name: { $regex: query, $options: "i" } },
          {
            original_category: { $regex: query, $options: "i" },
          },
        ],
      };
      productsQuery = Products.find(conditions);
      const productsData = await productsQuery;
      return {
        products: JSON.parse(JSON.stringify(productsData)),
      };
    } else {
      conditions = {};
      const productsData: IProduct[] = [];
      return {
        products: JSON.parse(JSON.stringify(productsData)),
      };
    }
  } catch (error) {
    handleError(error);
  }
}
