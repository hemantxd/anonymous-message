import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import { Message } from "@/model/User";

export async function POST(request: Request){
    await dbConnect();
    const {profileUrl, content} = await request.json();

    const username = profileUrl.split("/")[4];

    console.log("Profile URL: ", profileUrl);
    console.log("Username: ", username);

    
    try {
        const user = await UserModel.findOne({username: username});
        if(!user){
            return Response.json({success: false, message: "User not found"}, {status: 404});
        }

        //is user accepting message
        if(!user.isAcceptingMessage){
            return Response.json({success: false, message: "User is not accepting messages"}, {status: 400});
        }

        const newMessage = {   
            content: content,
            createdAt: new Date()
        }

        console.log("New message: ", newMessage);

        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({success: true, message: "Message sent"}, {status: 200});


    } catch (error) {
        
        return Response.json({success: false, message: "Error sending message"}, {status: 500});
    }

}