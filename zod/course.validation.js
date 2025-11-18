import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(3),
  field: z.string().min(2),
  startDate: z.string(),  
  endDate: z.string(),
  teacher: z.string().min(3),
  price: z.number().positive(),
  description: z.string().optional(),
});

export const updateCourseSchema = createCourseSchema.partial();
