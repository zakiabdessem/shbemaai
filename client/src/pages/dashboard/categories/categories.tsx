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
import { MAIN_DASHBOARD_URL } from "@/app/constants";

import { Checkbox } from "@/components/ui/checkbox";
import { DeleteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { instance } from "@/app/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useCategories from "@/hooks/categories/useCategories";
import { Category } from "@/types/product";
import { capitalize } from "lodash";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
// TODO: Add table pagination

export default function Categories() {
  // const [sortBy, setSortBy] = useState("");
  const { data } = useCategories();

  return (
    <Layout>
      <div className="flex max-sm:flex-col justify-between p-2">
        <TitlePage />
      </div>
      <div className="bg-white rounded-md">
        {data && <ProductTable data={data} />}
      </div>
    </Layout>
  );
}

function ProductTable({ data }: { data: Category[] }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleDeleteCategory = async (id: string) => {
    await instance
      .post("category/delete", {
        id,
      })
      .then(() => {
        toast.success(`category is deleted`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          navigate(`${MAIN_DASHBOARD_URL}/categories`);
        }, 3000);
      })
      .catch(() =>
        toast.error(`Error`, {
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

  const handleUpdateCategory = async (id: string) => {
    await instance
      .post("category/update", {
        id,
        name: selectedCategory,
      })
      .then(() => {
        toast.success(`Category is updated`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .then(() => window.location.reload())
      .catch(() =>
        toast.error(`Error`, {
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

  return (
    <Table>
      <TableCaption className="p-2">
        A table for all of your Categories.
      </TableCaption>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="w-[50px]"></TableHead>

          <TableHead>Category</TableHead>

          <TableHead className="text-center">Edit</TableHead>

          <TableHead className="text-right">Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data &&
          data.length > 0 &&
          data.map((category) => {
            return (
              <TableRow key={category._id}>
                <TableCell className="max-h-16 max-w-16">
                  <Checkbox checked={false} />
                </TableCell>

                <TableCell className="max-h-16 max-w-16">
                  {capitalize(category.name)}
                </TableCell>
                <TableCell className="max-h-16 max-w-16 text-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedCategory(category.name)}>
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Ajouter une note</DialogTitle>
                      </DialogHeader>
                      <div className="flex justify-between items-center gap-1">
                        <Input
                          id="categories"
                          placeholder="Votre category ..."
                          className="col-span-3 "
                          defaultValue={category.name}
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                        />
                        <DialogFooter className="col-span-1 ml-2">
                          <DialogClose>
                            <Button
                              type="submit"
                              onClick={() => {
                                handleUpdateCategory(category._id);
                              }}>
                              Valider
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>

                <TableCell className="text-right">
                  {
                    // Todo : Add model for coupon
                  }
                  <Button
                    onClick={() => handleDeleteCategory(category._id)}
                    variant="destructive">
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}

function TitlePage() {
  return (
    <h1 className="text-3xl font-semibold text-gray-800 p-5 pt-0 pl-0">
      Categories
    </h1>
  );
}
