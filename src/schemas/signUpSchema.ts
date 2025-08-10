import {z} from "zod";

export const usernameValidation = z.string().min(2, "Username must be at least 2 characters").max(15, "Username must be at most 15 characters")
.regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Please enter a valid email address"}),
    password: z.string().min(8, "Password must be at least 8 characters").max(30, "Password must be at most 30 characters"),
})