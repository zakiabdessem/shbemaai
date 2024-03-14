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
import { asset } from "@/lib/data";
import { MAIN_WEBSITE_URL } from "@/app/constants";
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

import { useQuery, gql } from "@apollo/client";

const GET_DATA = gql`
  query GetData {
    categories {
      products {
        description
      }
    }
  }
`;

export default function Products() {
  const { loading, error, data } = useQuery(GET_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Layout>
      <TitlePage />

      <div className="bg-white rounded-md">
        <div className="p-5 flex max-xl:flex-col justify-between">
          <div className="flex items-center p-4">
            <Checkbox id="selectall" />
            <label htmlFor="selectall" className="font-montserrat text-sm pl-3">
              Select all
            </label>
          </div>

          <div className="flex max-md:flex-col xl:justify-center xl:items-center p-4">
            <div className="flex items-center mr-2 p-2">
              <label className="font-montserrat text-sm pr-3">Category</label>
              <Select>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="books">Books</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center p-2">
              <label className="font-montserrat text-sm pr-3">Sort by:</label>
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="apple">Date</SelectItem>
                    <SelectItem value="banana">InStock</SelectItem>
                    <SelectItem value="blueberry">Quantity</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center p-4 max-md:pt-0">
            <Input className="max-w-48" type="search" placeholder="Search" />
          </div>
        </div>
        <ProductTable />
      </div>
    </Layout>
  );
}

function ProductTable() {
  return (
    <Table>
      <TableCaption className="p-2">
        A table for all of your products.
      </TableCaption>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="w-[80px]"></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead className="text-left">Price</TableHead>
          <TableHead>Inventory</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <Checkbox />
          </TableCell>
          <TableCell>Notebook</TableCell>
          <TableCell>Books</TableCell>
          <TableCell>435934636360457</TableCell>
          <TableCell className="text-left">$250.00</TableCell>
          <TableCell>In Stock</TableCell>
          <TableCell className="text-right">
            <a href={MAIN_WEBSITE_URL}>
              <img
                src={asset("icons/dots.png")}
                className="hover:opacity-50 object-contain min-w-5 h-5"
                alt="edit"
              />
            </a>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function TitlePage() {
  return (
    <h1 className="text-3xl font-semibold text-gray-800 p-5 pt-0 pl-0">
      Products <span className="text-gray-500">20</span>
    </h1>
  );
}
