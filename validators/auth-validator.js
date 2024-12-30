const {z} = require ("zod");

const signupSchema = z.object({
    email: z
    .string({required_error: "Email is required"})
    .trim()
    .min(5,{message: "Email must be greater than 5 char"}),

    phone: z
    .string({required_error: "Phone Number is required"}),

    role: z
    .string({required_error: "Role is required"}),


    password: z
    .string({required_error: "Password is required"})
    // .trim()
    .min(5,{message: "Password must be greater than 5 char"})
    .max(1100,{message:"T00 Long Password"}),

    fullname: z
    .string({required_error: "Enter your name"})
    .trim()
    .min(6,{message: "Name is so small contact us"})
    .max(35,{message:"Very Big Name"}),
}
);
module.exports = signupSchema;