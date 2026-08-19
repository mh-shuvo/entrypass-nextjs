import {z} from "zod"

const UserCreateSchema = z.object({
	name: z.string().trim().nonempty("Name is required"),
    email: z.string().trim().nonempty("Email is required").email("Enter a valid email address"),
    password: z.string().nonempty("Password is required").min(8,"Minimum character length 8"),
    confirmPassword: z.string().nonempty("Confirm Password is required").min(8,"Minimum character length 8"),
});

type UserCreateState = z.infer<typeof UserCreateSchema>;

export { UserCreateSchema };
export type { UserCreateState };