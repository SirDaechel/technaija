"use client";

import ProductFilterBar from "../products/ProductFilterBar";
import Collection from "../products/Collection";
import { IProduct } from "@/libs/database/models/product.model";
import { useState, useEffect } from "react";
import { getProductsByFilter } from "@/libs/actions/product.action";
import ProductSort from "../products/ProductSort";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { createURL } from "@/libs/utils";
import { TWishlistItem } from "@/libs/database/models/wishlist.model";
import MobileProductFilter from "./MobileProductFilter";
import Image from "next/image";

type ShopContent = {
  fetchedProducts: IProduct[];
  productsWithNoLimit: IProduct[];
  page: number;
  newLimit: number | undefined;
  userId: string;
  userWishlist: TWishlistItem[];
};

const ShopContent = ({
  fetchedProducts,
  productsWithNoLimit,
  page,
  newLimit,
  userId,
  userWishlist,
}: ShopContent) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [products, setProducts] = useState<IProduct[]>(fetchedProducts);

  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [newProductsWithNoLimit, setNewProductsWithNoLimit] =
    useState<IProduct[]>(productsWithNoLimit);

  const [allProductsFetched, setAllProductsFetched] = useState<boolean>();

  const categorySearchParams = new URLSearchParams(searchParams.toString());

  // When the page, fetchedProducts, modelFilterArray changes, update the products data (without the useEffect, the products data will effect the change on the next render)
  useEffect(() => {
    // Check if you are filtering through the original products data, if so, then load more products from that filtered data.
    if (
      categorySearchParams.getAll("category").length >= 1 ||
      categorySearchParams.getAll("model").length >= 1
    ) {
      const setLoadMoreFilteredProduct = async () => {
        const modifiedProducts = await getProductsByFilter({
          categoryFilterArray: categorySearchParams.getAll("category"),
          modelFilterArray: categorySearchParams.getAll("model"),
          limit: 8,
          page,
        });
        setProducts(modifiedProducts && modifiedProducts.data);
        setAllProductsFetched(
          modifiedProducts &&
            modifiedProducts.newLimit > modifiedProducts.data.length
        );
      };
      setLoadMoreFilteredProduct();
    } else {
      // If not, load more data from the original data.
      setProducts(fetchedProducts);
      if (newLimit) {
        // Check if all products have been fetched from the database after pagination. If true, setAllProductsFetched to true (This will hide the load more button).
        setAllProductsFetched(newLimit >= productsWithNoLimit.length);
      }
    }
  }, [page, fetchedProducts]);

  // Increment the page number and save the new page number in this nextPage variable.
  const nextPage = page + 1;

  const paginate = () => {
    categorySearchParams.set("page", nextPage.toString());
    const categoryURL = createURL(pathname, categorySearchParams);
    router.push(`${categoryURL}`);
  };

  return (
    <section className="flex gap-20 m:block xl:gap-14">
      <div className="m:hidden">
        <ProductFilterBar
          productsWithNoLimit={productsWithNoLimit}
          newProductsWithNoLimit={newProductsWithNoLimit}
          setNewProductsWithNoLimit={setNewProductsWithNoLimit}
          fetchedProducts={fetchedProducts}
          setProducts={setProducts}
          page={page}
          categorySearchParams={categorySearchParams}
          setShowMobileFilter={setShowMobileFilter}
        />
      </div>
      {showMobileFilter && (
        <MobileProductFilter
          productsWithNoLimit={productsWithNoLimit}
          newProductsWithNoLimit={newProductsWithNoLimit}
          setNewProductsWithNoLimit={setNewProductsWithNoLimit}
          fetchedProducts={fetchedProducts}
          setProducts={setProducts}
          page={page}
          categorySearchParams={categorySearchParams}
          setShowMobileFilter={setShowMobileFilter}
        />
      )}
      <div className="w-[75%] m:w-full">
        <div className="flex items-start justify-between gap-3 sm:flex-col">
          <button
            type="button"
            className="w-full flex items-center justify-between gap-3 p-2 border-[1px] border-gray-300 focus:outline-none xl:hidden xxl:hidden xxxl:hidden ultra:hidden"
            onClick={() => setShowMobileFilter((prev) => !prev)}
          >
            <p className="text-sm">Filter</p>
            <Image src="/filter.svg" width={20} height={20} alt="filter" />
          </button>
          <ProductSort
            products={products}
            setProducts={setProducts}
            fetchedProducts={fetchedProducts}
          />
        </div>
        <Collection
          userId={userId}
          products={products}
          type="shop"
          title="Shop"
          userWishlist={userWishlist}
        />
        {!allProductsFetched && (
          <div className="mt-12 flex items-center justify-center">
            <p
              className="w-fit py-2 px-4 bg-transparent
            text-[#272829] border-[1px] border-solid border-[#272829]
            cursor-pointer hover:transition hover:bg-[#272829] hover:text-white"
              onClick={paginate}
            >
              Load More
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopContent;
