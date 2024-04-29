import React, { useEffect, useRef, useState } from "react";
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
import { CircleX, InfoIcon, Plus, PlusIcon, Trash } from "lucide-react";
import { Product, useProduct } from "@/hooks/products/useProducts";
import { useNavigate, useParams } from "react-router-dom";
import { MAIN_DASHBOARD_URL } from "@/app/constants";
import { useEditProduct } from "@/hooks/products/useEditProduct";
import { toast } from "react-toastify";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { capitalize } from "lodash";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { instance } from "@/app/axios";

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
    if (dataCategory) {
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
              {dataCategory &&
                dataCategory.length > 0 &&
                categories &&
                dataCategory?.map((category: Category) => (
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
                      {capitalize(category.name)}
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
  const navigate = useNavigate();

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
        price: 0,
      },
    ]);

  const handleSwitchInvMode = () => setTrackinv(!trackInv);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      ruban: "",
      image: null || "",
      price: 0,
      business: [
        {
          price: 0,
          unit: 0,
          name: "",
        },
      ],
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
        if (option.name === "" || option.image === null || option.price === 0) {
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

  const handleDeleteProduct = async () => {
    await instance
      .post("product/delete", {
        id: product?._id.toString(),
      })
      .then(() => {
        toast.success(
          `Product have order cannot be deleted just unshow it from Sotre`,
          {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      })
      .then(() => navigate(`${MAIN_DASHBOARD_URL}/products`))
      .catch((error) =>
        toast.error(`Error ${error.response.data.message}`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      );
  };

  const handleAddCollisage = () => {
    form.setValue("business", [
      ...form.watch("business"),
      {
        price: 0,
        unit: 0,
        name: "",
      },
    ]);
  };

  const handleRemoveCollisage = (item: number) => {
    form.setValue(
      "business",
      form.watch("business").filter((_, index) => index !== item)
    );
  };

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

              <div className="p-2 max-w-32">
                <FormField
                  control={form.control}
                  name="ruban"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ruban</FormLabel>
                      <FormControl>
                        <Input placeholder="Ruban" maxLength={70} {...field} />
                      </FormControl>
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
                    <div className="flex items-center gap-2">
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
                              className="text-neutral-90 rounded-md cursor-pointer inline-flex items-center">
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

                      <FormItem className="flex flex-col max-w-64">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="https://example.com/"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                  )}
                />
              </div>

              <div className="flex flex-col gap-3">
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

                <div className="flex flex-col gap-1 p-2">
                  {form.watch("business").map((item, index) => (
                    <React.Fragment key={index}>
                      <div className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`business.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="max-w-32">
                              <FormLabel>Colisage</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Colisage"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`business.${index}.price`}
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
                                      <span className="font-semibold">
                                        1000 DA
                                      </span>
                                    </p>
                                    <p>
                                      Quantity:{" "}
                                      <span className="font-semibold">
                                        20 pieces
                                      </span>
                                    </p>
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>DA</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        /
                        <div className="flex justify-center items-center">
                          <FormField
                            control={form.control}
                            name={`business.${index}.unit`}
                            render={({ field }) => (
                              <FormItem className="max-w-[73px]">
                                <FormLabel>Piece</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="10"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>Unit</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            className="bg-red-500 ml-2"
                            onClick={() => handleRemoveCollisage(index)}>
                            <Trash className="text-white font-light w-8" />
                          </Button>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="bg-green-500 my-5 mb-2"
                onClick={handleAddCollisage}>
                <Plus className="text-white font-light w-16" />
              </Button>

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
                className={"max-w-screen-lg overflow-y-scroll max-h-screen"}>
                <DialogHeader>
                  <DialogTitle>Add product option</DialogTitle>
                  <DialogDescription>
                    You'll be able to manage pricing and inventory for this
                    product option later on.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 p-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Track</TableHead>
                        <TableHead>Inventory</TableHead>
                        <TableHead>Price</TableHead>

                        <TableHead>Remove</TableHead>
                      </TableRow>
                    </TableHeader>
                    <tbody>
                      {options &&
                        optionsPreview &&
                        options.map((item, index) => {
                          // Create a URL for the preview image if needed
                          let previewImageUrl = "";
                          if (item.image instanceof File) {
                            previewImageUrl = URL.createObjectURL(item.image);
                          } else if (typeof item.image === "string") {
                            previewImageUrl = item.image;
                          }

                          return (
                            <TableRow key={index}>
                              <TableCell>
                                <Input
                                  id={`name-${index}`}
                                  className="w-32"
                                  placeholder="Option Name"
                                  value={item.name}
                                  onChange={(e) => {
                                    const newOptions = [...options];
                                    const modifiedOption = {
                                      ...newOptions[index],
                                      name: e.target.value,
                                    };
                                    newOptions[index] = modifiedOption;

                                    setOptions(newOptions);
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <label
                                  htmlFor={`fileInput-${index}`}
                                  className="cursor-pointer whitespace-nowrap">
                                  {previewImageUrl
                                    ? "Change image"
                                    : "Choose an image"}
                                </label>
                                <input
                                  type="file"
                                  className="hidden"
                                  id={`fileInput-${index}`}
                                  onChange={(e) => {
                                    if (e.target.files) {
                                      handleOptionImageChange(
                                        index,
                                        e.target.files[0]
                                      );
                                    }
                                  }}
                                />
                                {previewImageUrl && (
                                  <img
                                    src={previewImageUrl}
                                    alt="Option Preview"
                                    style={{ width: "80px", height: "80px" }}
                                  />
                                )}
                              </TableCell>
                              <TableCell>
                                <Switch
                                  id={`track-${index}`}
                                  onClick={() => {
                                    const updatedOptions = options.map(
                                      (opt, optIndex) => {
                                        if (index === optIndex) {
                                          return { ...opt, track: !opt.track };
                                        }
                                        return opt;
                                      }
                                    );
                                    setOptions(updatedOptions);
                                  }}
                                  checked={item.track}
                                />
                              </TableCell>
                              <TableCell>
                                {item.track ? (
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const newOptions = [...options];
                                      newOptions[index].quantity =
                                        parseInt(e.target.value, 10) || 0;
                                      setOptions(newOptions);
                                    }}
                                  />
                                ) : (
                                  <Select
                                    value={
                                      item.inStock ? "inStock" : "outStock"
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
                                      <SelectValue />
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
                                )}
                              </TableCell>

                              <TableCell>
                                <Input
                                  id="price"
                                  className="col-span-3 w-32"
                                  placeholder="Option price"
                                  value={item.price}
                                  type="number"
                                  onChange={(e) => {
                                    const newOptions = [...options];
                                    newOptions[index].price = parseInt(
                                      e.target.value
                                    );
                                    setOptions(newOptions);
                                  }}
                                />
                              </TableCell>

                              <TableCell>
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    const newOptions = [...options];
                                    newOptions.splice(index, 1);
                                    setOptions(newOptions);
                                  }}>
                                  <CircleX />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </tbody>
                  </Table>

                  <Button variant="outline" type="button" onClick={addOption}>
                    Add Option
                  </Button>
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
            Edit Product
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="my-5 mx-1" size="lg">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteProduct()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </div>
    </Form>
  );
}

export default EditProduct;
