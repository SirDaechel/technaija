"use server";

import { connectToDatabase } from "../database";
import { handleError } from "../utils";
import Users from "../database/models/user.model";
import { revalidatePath } from "next/cache";

export const getAllUsers = async () => {
  try {
    await connectToDatabase();

    const usersQuery = Users.find({});
    const usersData = await usersQuery;

    return {
      users: JSON.parse(JSON.stringify(usersData)),
    };
  } catch (error) {
    handleError(error);
  }
};

export const updateUser = async ({ updatedUser, path }: UpdateUserParams) => {
  try {
    await connectToDatabase();
    const userToUpdate = await Users.findById(updatedUser._id);
    if (!userToUpdate) {
      throw new Error("Unauthorized or user not found");
    }
    const user = await Users.findByIdAndUpdate(
      updatedUser._id,
      { ...updatedUser },
      { new: true }
    );
    revalidatePath(path);
    revalidatePath("/");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
};

export const getUserById = async (userId: string) => {
  try {
    await connectToDatabase();

    const user = await Users.findById(userId);

    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
};