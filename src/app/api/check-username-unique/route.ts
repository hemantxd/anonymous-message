import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})


export async function GET(request: Request) {

    //this code is not needed in newer  version of nextjs
    // if(request.method !== "GET") {
    //     return Response.json({ success: false, message: "Method not allowed" }, { status: 405 });
    // }

    try {
        await dbConnect();
        
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        }


        //validate with zod

        const  result = UsernameQuerySchema.safeParse(queryParam);
        //console.log(result);

        if (!result.success) {
            //const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({ success: false, message: "Invalid username" }, { status: 400 });
        }

        const {username} = result.data;

        const existingUser = await UserModel.findOne({username, isVerified: true});

        if (existingUser) {
            return Response.json({ success: false, message: "Username already exists" }, { status: 400 });
        } else {
            return Response.json({ success: true, message: "Username is unique" }, { status: 200 });
        }

        
    } catch (error) {
        return Response.json({ success: false, message: "Error checking username" }, { status: 500 });
    }
}