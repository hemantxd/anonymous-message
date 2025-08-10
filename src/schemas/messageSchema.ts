import {z} from "zod";

export const messageSchema = z.object({
    content: z.string().min(1, "Message must be at least 1 character").max(1000, "Message must be at most 1000 characters")
})