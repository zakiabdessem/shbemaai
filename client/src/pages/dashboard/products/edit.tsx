import { useEffect, useRef, useState } from "react";
import Layout from "../Layout";
import { useDispatch } from "@/redux/hooks";
import useCategories from "@/hooks/categories/useCategories";
import { TitlePage } from "@/components/PageTitle";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch } from "redux";
import { Category, Option } from "@/types/product";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleX, InfoIcon, PlusIcon } from "lucide-react";
import { Product, useProduct } from "@/hooks/products/useProducts";
import { useNavigate, useParams } from "react-router-dom";
import { MAIN_DASHBOARD_URL } from "@/app/constants";
import { useEditProduct } from "@/hooks/products/useEditProduct";
import { toast } from "react-toastify";

//TODO: new categorie gets created but no product get pushed into it

function EditProduct() {
  const dispatch = useDispatch();

  const { data: dataCategory } = useCategories();

  const [show, setShow] = useState(true);
  const [promote, setPromote] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [providedOptions, setProvidedOptions] = useState<Option[]>();

  const { id = "" } = useParams();
  const navigate = useNavigate();
  const dataProduct = useProduct(id);
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    if (!id) return navigate(`${MAIN_DASHBOARD_URL}/products`);
    if (dataProduct?.options) {
      const { options, ...productWithoutOptions } = dataProduct;
      setProduct(productWithoutOptions);
      setProvidedOptions(options);
    } else {
      setProduct(dataProduct);
    }

    setShow(dataProduct?.show);
    setPromote(dataProduct?.promote);
  }, [id, dataProduct]);

  useEffect(() => {
    if (dataCategory?.categories) {
      const categoriesSelected = dataProduct?.categories.map(
        (c: Category) => c._id
      );
      setCategories(categoriesSelected);
    }
  }, [dataProduct, dataCategory]);

  return (
    <Layout>
      <TitlePage>Edit Product</TitlePage>
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
              product={product}
              setProduct={setProduct}
              providedOptions={providedOptions}
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
              {dataCategory && dataCategory.categories.length > 0 && categories &&
                dataCategory?.categories.map((category: Category) => (
                  <div
                    className="flex items-center space-x-1"
                    key={category._id}>
                    <Checkbox
                      id={category._id}
                      checked={categories.includes(category._id ?? "")}
                      onClick={() => {
                        const isCategorySelected = categories.includes(
                          category._id ?? ""
                        );
                        setCategories((currentCategories: any) =>
                          isCategorySelected
                            ? currentCategories.filter(
                                (id: string) => id !== category._id
                              )
                            : [...currentCategories, category._id]
                        );
                      }}
                    />
                    <label
                      htmlFor={category._id}
                      className="cursor-pointer text-sm font-medium leading-none">
                      {category.name}
                    </label>
                  </div>
                ))}
              <Input
                type="text"
                placeholder="Add new category"
                value={category || ""}
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

export function InputForm({
  show,
  promote,
  categories,
  dispatch,
  category,
  product,
  providedOptions,
}: {
  show: boolean;
  promote: boolean;
  categories: string[];
  dispatch: Dispatch;
  category?: string;
  setCategory?: (category: string) => void;
  product: Product | undefined;
  setProduct?: (product: Product) => void;
  providedOptions?: Option[];
}) {
  const editProductMutation = useEditProduct();

  const [selectedImage, setSelectedImage] = useState<File | string | null>(
    product?.image ?? null
  );
  const [stockStatus, setStockStatus] = useState("inStock");
  const [trackInv, setTrackinv] = useState(false);

  useEffect(() => {
    setSelectedImage(product?.image ?? null);
    setStockStatus(!product?.inStock ? "outStock" : "inStock");
    setTrackinv(product?.track ?? false);
  }, [product]);

  const [options, setOptions] = useState<Option[]>([]);

  const addOption = () =>
    setOptions([
      ...options,
      {
        name: "",
        image: null,
        changed: false,
        track: false,
        inStock: true,
        quantity: 0,
      },
    ]);

  const handleSwitchInvMode = () => setTrackinv(!trackInv);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      image: null,
      price: 0,
      business: 0,
      unit: 10,
      weight: 0,
      sku: "",
      quantity: 0,
      inStock: false,
    },
    values: product,
  });

  const [optionsPreview, setOptionsPreview] = useState<Option[]>();

  const handleOptionImageChange = (index: number, file: File) => {
    if (!options) return;
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], image: file, changed: true };
    setOptions(newOptions);
  };

  function onSubmit(data: any) {
    dispatch({ type: "APP_SET_LOADING" });

    Object.assign(data, {
      show,
      promote,
      categories,
      category,
      track: trackInv,
    });

    let proceed = true;

    // Filter options with non-empty names
    if (options) {
      options.forEach((option, index) => {
        if (option.name === "" || option.image === null) {
          toast.error(`Option ${index + 1} cannot be empty`, {
            position: "bottom-right",
          });
          proceed = false;
          return;
        }
      });

      if (!proceed) {
        dispatch({
          type: "APP_CLEAR_LOADING",
        });
        return;
      }

      data.options = options.filter((option) => option.name !== "");
    }

    // Set inStock property
    if (!trackInv) {
      data.inStock = stockStatus === "inStock";
    }

    // Handle the main image and option images uploading
    handleImageUpload(data)
      .then(() => {
        console.log("Submission data ready:", data);
        return editProductMutation.mutateAsync(data);
      })
      .catch((error) => console.error("Error processing images:", error));
  }

  async function handleImageUpload(data: any) {
    if (selectedImage !== product?.image) {
      data.image = await readFileAsDataURL(data.image[0]);
    }

    await Promise.all(
      data.options.map(async (option: any) => {
        if (option.changed && option.image) {
          option.image = await readFileAsDataURL(option.image);
        }
      })
    );
  }

  function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  const refPushedOptions = useRef(false);

  useEffect(() => {
    if (providedOptions && !refPushedOptions.current) {
      setOptions(providedOptions);
      refPushedOptions.current = true;
    }

    const optionsPreviews = options?.map((option) => {
      if (option.image instanceof File) {
        const objectURL = URL.createObjectURL(option.image);
        return {
          ...option,
          image: objectURL,
        };
      } else {
        // Return the option as is if image is not a File
        return option;
      }
    });

    setOptionsPreview(optionsPreviews);

    return () => {
      optionsPreviews?.forEach((option) => {
        if (
          option.image &&
          typeof option.image === "string" &&
          option.image.startsWith("blob:")
        ) {
          URL.revokeObjectURL(option.image);
        }
      });
    };
  }, [options, providedOptions]);

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
                              {selectedImage instanceof File
                                ? selectedImage.name
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
                    name="business"
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
                      {options &&
                        optionsPreview &&
                        options?.map((item, index) => {
                          const optionWatch = optionsPreview
                            ? optionsPreview[index]
                            : undefined;

                          if (optionWatch?.image instanceof File) {
                            try {
                              optionWatch.image = URL.createObjectURL(
                                optionWatch.image
                              );
                            } catch (error) {
                              console.error(
                                "Error creating object URL:",
                                error
                              );
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
                                <div className="flex justify-center items-center gap-2">
                                  <Input
                                    id="name"
                                    className="col-span-3 max-w-36"
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
                                                optionWatch?.image?.toString() ??
                                                ""
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

                                  <div className="flex flex-col justify-center items-center space-x-2 p-4">
                                    <Switch
                                      id="airplane-mode"
                                      onClick={() => {
                                        const updatedOptions = options.map(
                                          (opt, optIndex) => {
                                            if (index === optIndex) {
                                              console.log("trueeeeeeeeeeee");
                                              return {
                                                ...opt,
                                                track: !opt.track,
                                              };
                                            }
                                            return opt;
                                          }
                                        );

                                        setOptions(updatedOptions);
                                      }}
                                      checked={item.track}
                                    />
                                  </div>

                                  {!item.track ? (
                                    <div className="w-22">
                                      <Select
                                        value={
                                          options[index].inStock
                                            ? "inStock"
                                            : "outStock"
                                        }
                                        onValueChange={(value) => {
                                          const updatedOptions = options.map(
                                            (opt, optIndex) => {
                                              if (optIndex === index) {
                                                return {
                                                  ...opt,
                                                  inStock: value === "inStock",
                                                };
                                              }
                                              return opt;
                                            }
                                          );
                                          setOptions(updatedOptions);
                                        }}>
                                        <SelectTrigger className="w-[180px]">
                                          <SelectValue placeholder="inStock" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="inStock">
                                            InStock
                                          </SelectItem>
                                          <SelectItem value="outStock">
                                            Out of stock
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  ) : (
                                    <div className="w-32">
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        value={item.quantity}
                                        onChange={(e) => {
                                          const newOptions = [...options];
                                          newOptions[index].quantity =
                                            parseInt(e.target.value) || 0;

                                          setOptions(newOptions);
                                        }}
                                      />
                                    </div>
                                  )}

                                  {/* Remove Option Button */}
                                  <Button
                                    variant="destructive"
                                    type="button"
                                    onClick={() => {
                                      const newOptions = [...options];
                                      newOptions.splice(index, 1);
                                      setOptions(newOptions);
                                    }}>
                                    <CircleX />
                                  </Button>
                                </div>
                              </div>
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
                <Select
                  value={stockStatus}
                  onValueChange={(value) => setStockStatus(value)}>
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

export default EditProduct;
