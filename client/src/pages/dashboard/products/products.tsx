import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Layout from "../Layout";
import { Checkbox } from "@/components/ui/checkbox";
import { MAIN_DASHBOARD_URL } from "@/app/constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Category, Product, useProducts } from "@/hooks/products/useProducts";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusIcon } from "lucide-react";
import PaginationComponent from "@/components/Pagination";
import { useSearchParams } from "react-router-dom";
import { capitalize } from "lodash";

// TODO: Add table pagination

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [searchParams] = useSearchParams();

  const { products, categories, count, refetch } = useProducts({
    sortBy,
    selectedCategoryId,
    searchQuery,
  });

  const handleReset = () => {
    setSortBy("");
    setSelectedCategoryId("");
  };

  const handleSelectChangeSortCategory = (selectedId: string) => {
    setSortBy("category");
    setSelectedCategoryId(selectedId);
  };

  useEffect(() => {
    refetch(parseInt(searchParams.get("page") ?? "1"));
  }, [selectedCategoryId, sortBy, refetch, searchParams, searchQuery]);

  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleSelectAll = () => {
    if (selectedAll) {
      setSelectedProducts([]);
      return setSelectedAll(false);
    }

    setSelectedAll(!selectedAll);
    const productIds = products.map((product: Product) => product._id);
    setSelectedProducts(productIds);
  };

  const handleSelectUnselectProduct = (productId: string) => {
    setSelectedProducts((prevSelectedProducts: string[]) => {
      if (prevSelectedProducts.includes(productId))
        return prevSelectedProducts.filter((id: string) => id !== productId);
      else return [...prevSelectedProducts, productId];
    });
  };

  return (
    <Layout>
      <div className="flex max-sm:flex-col justify-between p-2">
        <TitlePage count={count} />
        <a href={`${MAIN_DASHBOARD_URL}/products/create`}>
          <Button>
            <PlusIcon className="mr-2" width={16} height={16} />
            Add product
          </Button>
        </a>
      </div>

      <div className="bg-white rounded-md">
        <div className="p-5 flex max-xl:flex-col justify-between">
          <div className="flex items-center p-4">
            <Checkbox
              id="selectall"
              onClick={handleSelectAll}
              checked={selectedAll && selectedProducts.length !== 0}
            />
            <label htmlFor="selectall" className="font-montserrat text-sm pl-3">
              Select all
            </label>
          </div>

          <div className="flex max-md:flex-col xl:justify-center xl:items-center p-4">
            <div className="flex items-center mr-2 p-2">
              <label className="font-montserrat text-sm pr-3">Category</label>
              <Select
                onValueChange={(value) => {
                  if (value === "all") handleReset();
                  else handleSelectChangeSortCategory(value);
                }}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>

                    <SelectItem key="all" value="all">
                      All
                    </SelectItem>
                    {categories &&
                      categories.length > 0 &&
                      categories.map((category: Category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {capitalize(category.name)}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center p-2">
              <label className="font-montserrat text-sm pr-3">Sort by:</label>
              <Select
                onValueChange={(value) => {
                  setSortBy(value);
                }}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="stock">InStock</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center p-4 max-md:pt-0">
            <Input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-48"
              type="search"
              placeholder="Search"
            />
          </div>
        </div>
        {products && (
          <ProductTable
            products={products}
            selectedProducts={selectedProducts}
            handleSelectUnselectProduct={handleSelectUnselectProduct}
          />
        )}
      </div>
      <PaginationComponent count={count} />
    </Layout>
  );
}

function ProductTable({
  products,
  selectedProducts,
  handleSelectUnselectProduct,
}: {
  products: Product[];
  selectedProducts: string[];
  handleSelectUnselectProduct: (productId: string) => void;
}) {
  return (
    <Table>
      <TableCaption className="p-2">
        A table for all of your products.
      </TableCaption>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="w-[50px]"></TableHead>
          <TableHead className="w-[80px]"></TableHead>

          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead className="text-left">Price</TableHead>
          <TableHead>Inventory</TableHead>
          <TableHead>Show</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products &&
          products.length > 0 &&
          products.map((product) => {
            return (
              <TableRow key={product._id}>
                <TableCell>
                  <Checkbox
                    onClick={() => handleSelectUnselectProduct(product._id)}
                    checked={selectedProducts.includes(product._id)}
                  />
                </TableCell>
                <TableCell className="max-h-16 max-w-16 ">
                  <img
                    src={product?.image ?? ""}
                    className="h-16 min-w-16 rounded-full"
                    alt=""
                  />
                </TableCell>
                <TableCell className="w-60">{product.name}</TableCell>
                <TableCell className="font-medium text-gray-500">
                  {capitalize(product.categories[0]?.name) || "-"}
                </TableCell>
                <TableCell className="font-medium text-gray-400">
                  {product.sku}
                </TableCell>
                <TableCell className="text-left">
                  DZD {product.price.toFixed(2)}
                </TableCell>
                <TableCell className="font-medium text-gray-400">
                  {product.track
                    ? product.quantity
                    : product.inStock
                    ? "In Stock"
                    : "Out of Stock"}
                </TableCell>
                <TableCell className="font-medium text-gray-400">
                  {product.show ? "Available" : "Hidden"}
                </TableCell>
                <TableCell className="text-right">
                  <a href={`${MAIN_DASHBOARD_URL}/products/${product._id}`}>
                    <Button
                      variant="ghost"
                      className="hover:opacity-50 object-contain min-w-5 h-5">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="min-w-5 h-5" />
                    </Button>
                  </a>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}

function TitlePage({ count }: { count: number }) {
  return (
    <h1 className="text-3xl font-semibold text-gray-800 p-5 pt-0 pl-0">
      Products <span className="text-gray-500">{count}</span>
    </h1>
  );
}
