import Layout from "../Layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function CreateProduct() {
  return (
    <Layout>
      <TitlePage />
      <div className="bg-white rounded-md">
        <div className="p-5 flex max-xl:flex-col justify-between">
          <InputForm />
        </div>
      </div>
    </Layout>
  );
}

const TitlePage = () => {
  return (
    <h1 className="text-3xl font-semibold text-gray-800 p-5 pt-0 pl-0">
      Create Product
    </h1>
  );
};

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
  description: z
    .string()
    .min(2, {
      message: "description must be at least 2 characters.",
    })
    .max(100, {
      message: "description must be at most 100 characters.",
    }),
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 2MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-5/6 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <FormControl>
                <Input placeholder="Untilted Product" {...field} />
              </FormControl>
              <FormDescription>
                This is your public product name.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="eg This is cool product" {...field} />
              </FormControl>
              <FormDescription>
                This is your public product description.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="max-w-64">
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  id="picture"
                  type="file"
                  placeholder="eg This is cool product"
                  {...field}
                />
              </FormControl>
              <FormDescription>2 mb max, PNG, JPG, JPEG</FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="max-w-32">
              <FormLabel>Pice</FormLabel>
              <FormControl>
                <Input
                  id="picture"
                  type="file"
                  placeholder="eg This is cool product"
                  {...field}
                />
              </FormControl>
              <FormDescription>2 mb max, PNG, JPG, JPEG</FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default CreateProduct;
