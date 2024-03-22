import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 2;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const FormSchema = z.object({
  name: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
  description: z
    .string()
    .max(516, {
      message: "description must be at most 516 characters.",
    })
    .optional(),
  image: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  sku: z.coerce.string(),
  price: z.coerce.number().min(1),
  business: z.coerce.number().min(1),
  unit: z.coerce.number().min(1),
  weight: z.coerce.number().min(1),
  quantity: z.coerce.number().optional(),
});

export const FormSchemaEdit = z.object({
  name: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
  description: z
    .string()
    .max(516, {
      message: "description must be at most 516 characters.",
    })
    .optional(),
  image: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  sku: z.coerce.string(),
  price: z.coerce.number().min(1),
  business: z.coerce.number().min(1),
  unit: z.coerce.number().min(1),
  weight: z.coerce.number().min(1),
  quantity: z.coerce.number().optional(),
});
