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
import { useOrders } from "@/hooks/orders/useOrders";
import { Order } from "@/types/orders";
import { Checkbox } from "@/components/ui/checkbox";
import moment from "moment";
import { capitalize } from "lodash";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { instance } from "@/app/axios";
import { useState } from "react";
import HorizontalCard from "@/components/HorizontalCard";
import { Product } from "@/hooks/products/useProducts";
// TODO: Add table pagination

export default function Products() {
  // const [sortBy, setSortBy] = useState("");
  const { orders, count } = useOrders();

  return (
    <Layout>
      <TitlePage count={count} />
      <div className="bg-white rounded-md">
        {orders && <ProductTable orders={orders} />}
      </div>
    </Layout>
  );
}

function ProductTable({ orders }: { orders: Order[] }) {
  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const [productsData, setProductsData] = useState<Product[]>();
  const handleOrderSelect = async (id: string) => {
    try {
      const res = await instance.post("order/single", {
        id,
      });
      setSelectedOrder(res.data.order);
      setProductsData(res.data.productsData);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Table>
      <TableCaption className="p-2">
        A table for all of your orders.
      </TableCaption>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="w-[50px]"></TableHead>

          <TableHead>OrderAt</TableHead>
          <TableHead>Client</TableHead>
          <TableHead className="text-left">SubPrice</TableHead>
          <TableHead className="text-left">TotalPrice</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Status</TableHead>

          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders &&
          orders.length > 0 &&
          orders.map((order) => {
            const date = moment(order.createdAt.toString()).format("LLL");

            return (
              <TableRow key={order._id}>
                <TableCell className="max-h-16 max-w-16">
                  <Checkbox checked={false} />
                </TableCell>
                <TableCell className="font-medium text-gray-400">
                  {date}
                </TableCell>
                <TableCell className="max-h-16 max-w-16 ">
                  {`${
                    capitalize(order.client.firstName) +
                    " " +
                    capitalize(order.client.lastName)
                  }`}
                </TableCell>
                <TableCell>{order.cart.subTotal.toFixed(2)} DZD</TableCell>
                <TableCell>{order.cart.totalPrice} DZD</TableCell>
                <TableCell>
                  {capitalize(order.client.address.willaya)}
                </TableCell>
                <TableCell>{capitalize(order.paymentType)}</TableCell>
                <TableCell className="font-medium text-gray-400">
                  {capitalize(order.orderStatus)}
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => handleOrderSelect(order._id)}
                        variant="outline">
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl">
                      {selectedOrder && (
                        <DialogHeader>
                          <DialogTitle className="text-2xltext-gray-700">
                            Order{" "}
                            <span className="text-sm">
                              # {selectedOrder._id.slice(-8)}
                            </span>
                            <span
                              className={`text-sm px-2 rounded-full mx-2 text-center  ${
                                selectedOrder.orderStatus === "pending"
                                  ? "bg-yellow-500"
                                  : selectedOrder.orderStatus === "confirmed"
                                  ? "bg-blue-500 text-gray-100"
                                  : selectedOrder.orderStatus === "canceled"
                                  ? "bg-red-500"
                                  : selectedOrder.orderStatus === "delivered"
                                  ? "bg-green-500"
                                  : selectedOrder.orderStatus === "returned"
                                  ? "bg-purple-500"
                                  : ""
                              }`}>
                              {selectedOrder?.orderStatus}
                            </span>
                          </DialogTitle>
                        </DialogHeader>
                      )}
                      <div className="max-w-6xl mx-auto p-4 z-50 w-full">
                        <div className="flex justify-evenly w-full">
                          <div className="bg-white rounded px-8 pt-6 pb-8">
                            <h2 className="block text-gray-700 text-xl font-light mb-2">
                              Customer Details
                            </h2>
                            <div className="p-3">
                              <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                  Date of Order
                                </label>
                                <p className="text-gray-600">{date}</p>
                              </div>
                              <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                  Full Name
                                </label>
                                <p className="text-gray-600">
                                  {capitalize(order.client.firstName) +
                                    " " +
                                    capitalize(order.client.lastName)}
                                </p>
                              </div>
                              <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                  Phone Number
                                </label>
                                <p className="text-gray-600">
                                  {order.client.address.phone}
                                </p>
                              </div>
                              <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                  City
                                </label>
                                <p className="text-gray-600">
                                  {order.client.address.willaya}
                                </p>
                              </div>
                              <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                  State
                                </label>
                                <p className="text-gray-600">
                                  {order.client.address.commun}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded px-8 pt-6 pb-8">
                            <h2 className="block text-gray-700 text-xl font-light mb-2">
                              Order Details
                            </h2>

                            <div className="p-3">
                              <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                  Payment Type
                                </label>
                                <p className="text-gray-600">
                                  {order.paymentType.toUpperCase()}
                                </p>
                              </div>

                              <div className="m-4 ml-0">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                  Livraison
                                </label>
                                <p className="text-gray-600">
                                  {order.isStopDesk ? "Au bureau" : "Au Maison"}
                                </p>
                              </div>

                              <div className="m-4 ml-0">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                  Price Without Discount
                                </label>
                                <p className="text-gray-600">
                                  {order.cart.subTotal} DA
                                </p>
                              </div>

                              <div className="m-4 ml-0">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                  Price Total
                                </label>
                                <p className="text-gray-600">
                                  {order.cart.totalPrice} DA
                                </p>
                              </div>

                              {order?.cart?.note && (
                                <div className="m-4 ml-0">
                                  <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Customer Note
                                  </label>
                                  <p className="text-gray-600">
                                    {order.cart.note}
                                  </p>
                                </div>
                              )}

                              <div className="flex lg:flex-row flex-col justify-between">
                                <div className="flex flex-col gap-3 lg:w-2/3">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline">
                                        View Cart
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-6xl overflow-y-scroll max-h-screen">
                                      <DialogHeader>
                                        <DialogTitle>View Cart</DialogTitle>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        {productsData &&
                                          selectedOrder?.cart?.products?.map(
                                            (_, index) => {
                                              console.log(selectedOrder);
                                              const data = productsData?.find(
                                                (p: Product) => {
                                                  return p._id == _.product;
                                                }
                                              );

                                              return (
                                                <>
                                                  {data && (
                                                    <div key={index}>
                                                      {_.quantity > 0 && (
                                                        <HorizontalCard
                                                          key={index.toString()}
                                                          title={data.name}
                                                          price={data.price}
                                                          image={
                                                            data.image || ""
                                                          }
                                                          quantity={_.quantity}
                                                        />
                                                      )}
                                                      {_.options?.length > 0 &&
                                                        _.options.map(
                                                          (option, index) => {
                                                            const dataOption =
                                                              data?.options.find(
                                                                (o) =>
                                                                  o.name ===
                                                                  option.name
                                                              );

                                                            return (
                                                              <>
                                                                {dataOption && (
                                                                  <div className="mb-2">
                                                                    {option.quantity >
                                                                      0 && (
                                                                      <HorizontalCard
                                                                        key={index.toString()}
                                                                        title={
                                                                          data.name
                                                                        }
                                                                        option={capitalize(
                                                                          option.name
                                                                        )}
                                                                        price={
                                                                          dataOption.price
                                                                        }
                                                                        image={
                                                                          dataOption.image ||
                                                                          ""
                                                                        }
                                                                        quantity={
                                                                          option.quantity
                                                                        }
                                                                      />
                                                                    )}
                                                                  </div>
                                                                )}
                                                              </>
                                                            );
                                                          }
                                                        )}
                                                    </div>
                                                  )}
                                                </>
                                              );
                                            }
                                          )}
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
      Orders <span className="text-gray-500">{count}</span>
    </h1>
  );
}
