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
  console.log(orders);
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
                <TableCell className="max-h-16 max-w-16 ">
                  <Checkbox checked={false} />
                </TableCell>
                <TableCell className="font-medium text-gray-400">
                  {date}
                </TableCell>
                <TableCell className="max-h-16 max-w-16 ">
                  {`${order.client.firstName + " " + order.client.lastName}`}
                </TableCell>
                <TableCell>{order.cart.subTotal.toFixed(2)} DZD</TableCell>
                <TableCell>{order.cart.totalPrice} DZD</TableCell>
                <TableCell>
                  {capitalize(order.client.address.city)}
                </TableCell>
                <TableCell>
                  {capitalize(order.paymentType)}
                </TableCell>
                <TableCell className="font-medium text-gray-400">
                  {capitalize(order.status)}
                </TableCell>
                <TableCell className="text-right">
                  {
                    // Todo : Add model for order
                  }
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
