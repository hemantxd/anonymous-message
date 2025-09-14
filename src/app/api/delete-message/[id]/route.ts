import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;   // ✅ get id properly
  const messageId = id;

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !user || !user._id) {
    return Response.json(
      { success: false, message: "Unauthenticated" },
      { status: 401 }
    );
  }

  try {
    console.log("Message ID: ", messageId);
    console.log("User ID: ", user._id);

    const updateResult = await UserModel.updateOne(
      { _id: user._id },
       { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } } } 
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Message deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      { success: false, message: "Error deleting message" },
      { status: 500 }
    );
  }
}
