import {z} from "zod";

const loginSchema = z.object({
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormState = z.infer<typeof loginSchema>;

export { loginSchema };
export type { LoginFormState };