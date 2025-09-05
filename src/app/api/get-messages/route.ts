import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !user || !user._id) {
    return Response.json(
      { success: false, message: "Unauthenticated" },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const result = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: {
          path: "$messages",
          preserveNullAndEmptyArrays: true, // allows user with no messages
        },
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
      {
        $project: {
          messages: {
            $filter: {
              input: "$messages",
              as: "msg",
              cond: { $ne: ["$$msg", null] }, // filters out nulls
            },
          },
        },
      },
    ]);

    const messages = result[0]?.messages ?? [];

    return Response.json(
      { success: true, messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /messages:", error);
    return Response.json(
      { success: false, message: "Error in getting messages" },
      { status: 500 }
    );
  }
}
