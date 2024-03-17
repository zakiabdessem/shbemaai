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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { PlusIcon, InfoIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import useCategories from "@/hooks/categories/useCategories";
import { useCreateProduct } from "@/hooks/products/useCreateProduct";
import { useDispatch } from "@/redux/hooks";
import { Option } from "@/types/product";
import { Dispatch } from "redux";

function CreateProduct() {
  const dispatch = useDispatch();

  const { data } = useCategories();

  const [show, setShow] = useState(true);
  const [promote, setPromote] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("");

  return (
    <Layout>
      <TitlePage />
      <div className="flex max-lg:flex-col gap-2">
        <div className="bg-white rounded-md lg:w-5/6">
          <div className="p-5 flex max-xl:flex-col justify-between">
            <InputForm
              dispatch={dispatch}
              show={show}
              promote={promote}
              categories={categories}
              category={category}
              setCategory={setCategory}
            />
          </div>
        </div>
        <div className="lg:w-1/3">
          <div className="bg-white rounded-md p-2 h-fit mb-2">
            <div className="p-5 flex flex-col max-xl:flex-col justify-between gap-6">
              <h2 className="font-montserrat font-semibold p-2 pt-0 px-0 border-b-[1px] mb-2">
                Options
              </h2>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={show}
                  onClick={() => setShow(!show)}
                  id="show"
                />
                <label
                  htmlFor="show"
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Show in store
                </label>
              </div>
              <div className="flex items-center space-x-2 pb-2">
                <Checkbox
                  checked={promote}
                  onClick={() => setPromote(!promote)}
                  id="promote"
                />
                <label
                  htmlFor="promote"
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Promote this product
                </label>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-md p-2 h-fit">
            <div className="p-5 flex flex-col max-xl:flex-col justify-between gap-6">
              <h2 className="font-montserrat font-semibold p-2 pt-0 px-0 border-b-[1px] mb-2">
                Categories
              </h2>
              <div className="flex items-center space-x-2">
                <Checkbox id="show" checked disabled />
                <label
                  htmlFor="show"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  All Categories
                </label>
              </div>
              {data?.categories.map((category: any) => (
                <div className="flex items-center space-x-1" key={category._id}>
                  <Checkbox
                    id={category._id}
                    onClick={() => {
                      if (categories.includes(category._id)) {
                        setCategories(
                          categories.filter((c) => c !== category._id)
                        );
                      } else {
                        setCategories([...categories, category._id]);
                      }
                    }}
                  />
                  <label
                    htmlFor={category._id}
                    className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {category.name}
                  </label>
                </div>
              ))}
              <Input
                type="text"
                placeholder="Add new category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                maxLength={70}
              />
            </div>
          </div>
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

const MAX_FILE_SIZE = 1024 * 1024 * 2;
const ACCEPTED_IMAGE_MIME_TYPES = [
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
  sku: z.string(),
  price: z.coerce.number().min(1),
  buisness: z.coerce.number().min(1),
  unit: z.coerce.number().min(1),
  weight: z.coerce.number().min(1),
  quantity: z.coerce.number().optional(),
});

export function InputForm({
  show,
  promote,
  categories,
  dispatch,
  category,
}: {
  show: boolean;
  promote: boolean;
  categories: string[];
  dispatch: Dispatch;
  category?: string;
  setCategory?: (category: string) => void;
}) {
  const createProductMutation = useCreateProduct();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [trackInv, setTrackinv] = useState(false);
  const [stockStatus, setStockStatus] = useState("inStock");

  const [options, setOptions] = useState<Option[]>([{ name: "", image: null }]);

  const addOption = () => setOptions([...options, { name: "", image: null }]);

  const handleSwitchInvMode = () => setTrackinv(!trackInv);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      price: 0,
      buisness: 0,
      unit: 10,
      weight: 0,
      sku: "",
      quantity: 0,
      inStock: false,
    },
  });

  const optionsPreview = options.map((option) => {
    if (typeof option.image === "string") {
      return option;
    }
    // If option.image is a File, create a new object URL
    else if (option.image instanceof File) {
      const objectURL = URL.createObjectURL(option.image);
      return {
        ...option,
        image: objectURL,
      };
    } else {
      return option;
    }
  });

  const handleOptionImageChange = (index: number, file: File) => {
    const newOptions = [...options];
    newOptions[index].image = file;
    setOptions(newOptions);
  };

  function onSubmit(data: any) {
    console.log("data", data);
    dispatch({
      type: "APP_SET_LOADING",
    });

    data.show = show;
    data.promote = promote;
    data.categories = categories;
    data.category = category;

    //image upload
    if (options) data.options = options.filter((option) => option.name !== "");
    if (!trackInv) data.inStock = stockStatus === "inStock";

    const reader = new FileReader();
    reader.onload = function (event) {
      data.image = event?.target?.result;

      // Once image reading is complete, do the same for option images
      if (data.options.length === 0) createProductMutation.mutateAsync(data);
      data.options.forEach((option: any) => {
        const optionReader = new FileReader();
        optionReader.onload = function (event) {
          option.image = event?.target?.result;

          // Check if all option images have been read before mutating
          const allOptionImagesRead = data.options.every(
            (opt: any) => opt.image !== undefined
          );
          if (allOptionImagesRead) createProductMutation.mutateAsync(data);
        };
        if (option.image) optionReader.readAsDataURL(option.image);
      });
    };
    reader.readAsDataURL(data.image[0]);
  }

  useEffect(() => {
    return () => {
      options.forEach((option) => {
        if (typeof option.image === "string") {
          URL.revokeObjectURL(option.image);
        }
      });
    };
  }, [options]);

  return (
    <Form {...form}>
      <div className="flex flex-col w-full">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Product info */}
          <div>
            <h2 className="font-montserrat font-semibold p-2 px-0 border-b-[1px] mb-2">
              Product info
            </h2>
            <div className="w-5/6 p-3">
              {/* Product Name */}
              <div className="p-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Untilted Product"
                          maxLength={150}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your public product name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-2">
                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="eg This is cool product"
                          maxLength={516}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your public product description.
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image */}
              <div className="p-2">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="flex flex-col max-w-64">
                      <FormLabel>Image*</FormLabel>
                      <FormControl>
                        <Button size="lg" type="button">
                          <input
                            type="file"
                            className="hidden"
                            id="fileInput"
                            onBlur={field.onBlur}
                            name={field.name}
                            onChange={(e) => {
                              field.onChange(e.target.files);
                              setSelectedImage(e.target.files?.[0] || null);
                            }}
                            ref={field.ref}
                          />

                          <label
                            htmlFor="fileInput"
                            className=" text-neutral-90  rounded-md cursor-pointer inline-flex items-center">
                            <span className="whitespace-nowrap">
                              {selectedImage?.name
                                ? selectedImage?.name
                                : "choose your image"}
                            </span>
                          </label>
                        </Button>
                      </FormControl>
                      <FormDescription>
                        2mb max, PNG, JPG, JPEG, WEBP
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex max-md:flex-col gap-3">
                {/* Price */}
                <div className="p-2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="max-w-32">
                        <FormLabel>Price*</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormDescription>DA</FormDescription>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-1 p-2">
                  {/* Business */}
                  <FormField
                    control={form.control}
                    name="buisness"
                    render={({ field }) => (
                      <FormItem className="max-w-20">
                        <FormLabel>Business</FormLabel>
                        <Popover>
                          <PopoverTrigger>
                            <InfoIcon
                              className="cursor-pointer relative bottom-1 left-[2px]"
                              width={10}
                              height={10}
                            />
                          </PopoverTrigger>
                          <PopoverContent className="text-sm bg-white shadow-lg border border-gray-200 rounded-lg p-4 max-w-44">
                            <div className="text-gray-700">
                              Example
                              <p>
                                Price:{" "}
                                <span className="font-semibold">1000 DA</span>
                              </p>
                              <p>
                                Quantity:{" "}
                                <span className="font-semibold">20 pieces</span>
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormDescription>DA</FormDescription>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  /
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem className="max-w-[73px]">
                        <FormLabel>Piece</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="10" {...field} />
                        </FormControl>
                        <FormDescription>Unit</FormDescription>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex max-md:flex-col gap-2 p-2">
                {/* Weight */}
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem className="max-w-32">
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                      <FormDescription>Gram</FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SKU */}
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem className="max-w-72">
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="ABC-12345-S-BL"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-montserrat font-semibold p-2 px-0 border-b-[1px] mb-2">
              Product Options
            </h2>
            <p className="py-2 text-md">
              Does your product come in different options, like size, color or
              <span className="block">material? Add them here.</span>
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="my-4" variant="outline">
                  <PlusIcon className="mr-2" width={16} height={16} />
                  Add Options
                </Button>
              </DialogTrigger>
              <DialogContent
                className={"lg:max-w-screen-md overflow-y-scroll max-h-screen"}>
                <DialogHeader>
                  <DialogTitle>Add product option</DialogTitle>
                  <DialogDescription>
                    You'll be able to manage pricing and inventory for this
                    product option later on.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2">
                      {options.map((item, index) => {
                        const optionWatch = optionsPreview[index];
                        // blob the image
                        if (optionWatch?.image instanceof File) {
                          try {
                            optionWatch.image = URL.createObjectURL(
                              optionWatch.image
                            );
                          } catch (error) {
                            console.error("Error creating object URL:", error);
                          }
                        }

                        return (
                          <div
                            className="flex flex-col items-start gap-2 py-3"
                            key={index}>
                            <div className="flex flex-col items-start gap-2">
                              {/* Option Name Input */}
                              <Label
                                htmlFor={`options.${index}.name`}
                                className="text-right">
                                Option {index + 1}
                              </Label>
                              <Input
                                id="name"
                                className="col-span-3"
                                placeholder="Option Name"
                                value={item.name}
                                onChange={(e) => {
                                  const newOptions = [...options];
                                  newOptions[index].name = e.target.value;
                                  setOptions(newOptions);
                                }}
                              />

                              {/* Image Upload for Option */}
                              <Button>
                                <input
                                  type="file"
                                  className="hidden"
                                  name={`fileInput-${index}`}
                                  id={`fileInput-${index}`}
                                  onChange={(e) => {
                                    if (e.target.files)
                                      handleOptionImageChange(
                                        index,
                                        e.target.files[0]
                                      );
                                  }}
                                />

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <label
                                        htmlFor={`fileInput-${index}`}
                                        className="text-neutral-90 rounded-md cursor-pointer inline-flex items-center">
                                        {optionWatch?.image
                                          ? "Change image"
                                          : "Choose an image"}
                                      </label>
                                    </TooltipTrigger>
                                    {optionsPreview[index]?.image && (
                                      <TooltipContent>
                                        <img
                                          src={
                                            optionWatch.image?.toString() || ""
                                          }
                                          alt="Option Preview"
                                          style={{
                                            width: "120px",
                                            height: "auto",
                                          }}
                                        />
                                      </TooltipContent>
                                    )}
                                  </Tooltip>
                                </TooltipProvider>
                              </Button>
                            </div>

                            {/* Remove Option Button */}
                            <Button
                              variant="destructive"
                              type="button"
                              onClick={() => {
                                const newOptions = [...options];
                                newOptions.splice(index, 1);
                                setOptions(newOptions);
                              }}>
                              Remove Option
                            </Button>
                          </div>
                        );
                      })}
                      <Button
                        variant="outline"
                        type="button"
                        onClick={addOption}>
                        Add Option
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose>
                    <Button>Save changes</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div>
            <h2 className="font-montserrat font-semibold p-2 px-0 border-b-[1px] mb-2">
              Inventory
            </h2>

            <div className="flex items-center space-x-2 p-4">
              <Switch
                id="airplane-mode"
                onClick={handleSwitchInvMode}
                checked={trackInv}
              />
              <Label htmlFor="airplane-mode">Inventory Track</Label>
            </div>

            {!trackInv ? (
              <div className="p-2">
                <Select onValueChange={(value) => setStockStatus(value)}>
                  <Label>Status</Label>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="inStock" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inStock">InStock</SelectItem>
                    <SelectItem value="outStock">Out of stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="max-w-36 p-2">
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <Button className="my-5" type="submit" size="lg" color="primary">
            Create Product
          </Button>
        </form>
      </div>
    </Form>
  );
}

export default CreateProduct;
