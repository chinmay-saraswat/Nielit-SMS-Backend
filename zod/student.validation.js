import { z } from "zod";

export const studentRegisterSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 chars"),
  mobile: z.string().length(10, "Mobile must be 10 digits"),
  adhar: z.string().length(12, "Aadhar must be 12 digits"),
  caste: z.enum(["General", "SC", "ST", "OBC"]),
  gender: z.enum(["Male", "Female"])
});

export const studentLoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});
