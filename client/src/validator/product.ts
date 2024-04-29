import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const fileSchema = z.object({
  size: z.number(),
  type: z.string(),
});

const imageSchema = z.union([
  z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  z.string().url("Invalid URL format"),
]);

export const FormSchema = z.object({
  name: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
  ruban: z.string().min(2, {
    message: "ruban must be at least 2 characters.",
  }),
  description: z
    .string()
    .max(516, {
      message: "description must be at most 516 characters.",
    })
    .optional(),
  image: imageSchema,
  sku: z.coerce.string(),
  price: z.coerce.number().min(1),
  business: z.array(
    z.object({
      price: z.coerce.number().refine((val) => val !== 0, {
        message: "Price must not be 0",
      }),
      unit: z.coerce.number().refine((val) => val !== 0, {
        message: "Unit must not be 0",
      }),
      name: z.string().refine((val) => val.length > 0, {
        message: "Name must not be empty",
      }),
    })
  ),
  weight: z.coerce.number().min(1),
  quantity: z.coerce.number().optional(),
});

export const FormSchemaEdit = z.object({
  name: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
  ruban: z.string().min(2, {
    message: "ruban must be at least 2 characters.",
  }),
  description: z
    .string()
    .max(516, {
      message: "description must be at most 516 characters.",
    })
    .optional(),
  image: imageSchema,
  sku: z.coerce.string(),
  price: z.coerce.number().min(1),
  business: z.array(
    z.object({
      price: z.coerce.number().refine((val) => val !== 0, {
        message: "Price must not be 0",
      }),
      unit: z.coerce.number().refine((val) => val !== 0, {
        message: "Unit must not be 0",
      }),
      name: z.string().refine((val) => val.length > 0, {
        message: "Name must not be empty",
      }),
    })
  ),
  weight: z.coerce.number().min(1),
  quantity: z.coerce.number().optional(),
});
