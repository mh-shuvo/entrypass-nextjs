import {z} from "zod"
import prisma from "@/lib/prisma";
const UserCreateSchema = z.object({
	name: z.string().trim().nonempty("Name is required"),
    email: z.string().trim().nonempty("Email is required").email("Enter a valid email address")
    .refine(
        async (email) =>{
            const user = await prisma.user.findFirst({where:{email}});
            return !user;
        },
        {
            message: "This email already taken. Please try with another email"
        }
    ),
    password: z.string().nonempty("Password is required").min(8,"Minimum character length 8"),
    confirmPassword: z.string().nonempty("Confirm Password is required").min(8,"Minimum character length 8"),
    phone:z.string()
}).refine((data) => data.password === data.confirmPassword,{
    message: "Password do not match",
    path:['confirmPassword']
});

type UserCreateState = z.infer<typeof UserCreateSchema>;

export { UserCreateSchema };
export type { UserCreateState };