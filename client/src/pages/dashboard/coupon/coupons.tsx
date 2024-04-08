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
import { Coupon } from "@/types/coupons";
import { useCoupons } from "@/hooks/coupons/useCoupons";

import { Checkbox } from "@/components/ui/checkbox";
import moment from "moment";
import { DeleteIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
// TODO: Add table pagination

export default function Coupons() {
  // const [sortBy, setSortBy] = useState("");
  const { coupons, count } = useCoupons();

  return (
    <Layout>
      <div className="flex max-sm:flex-col justify-between p-2">
        <TitlePage count={count} />
        <a href={`${MAIN_DASHBOARD_URL}/coupons/create`}>
          <Button>
            <PlusIcon className="mr-2" width={16} height={16} />
            Create Coupon
          </Button>
        </a>
      </div>
      <div className="bg-white rounded-md">
        {coupons && <ProductTable coupons={coupons} />}
      </div>
    </Layout>
  );
}

function ProductTable({ coupons }: { coupons: Coupon[] }) {
  console.log(coupons);
  return (
    <Table>
      <TableCaption className="p-2">
        A table for all of your coupons.
      </TableCaption>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="w-[50px]"></TableHead>

          <TableHead>CreatedAt</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>expireDate</TableHead>

          <TableHead>Status</TableHead>

          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coupons &&
          coupons.length > 0 &&
          coupons.map((coupon) => {
            const date = moment(coupon.createdAt.toString()).format("LLL");
            const expireDate = moment(coupon.expireDate.toString()).format(
              "LLL"
            );
            return (
              <TableRow key={coupon._id}>
                <TableCell className="max-h-16 max-w-16">
                  <Checkbox checked={false} />
                </TableCell>
                <TableCell className="font-medium text-gray-400">
                  {date}
                </TableCell>
                <TableCell className="max-h-16 max-w-16">
                  {coupon.code.toUpperCase()}
                </TableCell>
                <TableCell className="max-h-16 max-w-16">
                  {coupon.discount}
                </TableCell>
                <TableCell className="font-medium text-gray-400">
                  {expireDate}
                </TableCell>
                <TableCell className="font-medium text-gray-400">
                  {coupon.isActive ? "Active" : "Inactive"}
                </TableCell>

                <TableCell className="text-right">
                  {
                    // Todo : Add model for coupon
                  }
                  <Button variant="destructive">
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

function TitlePage({ count }: { count: number }) {
  return (
    <h1 className="text-3xl font-semibold text-gray-800 p-5 pt-0 pl-0">
      Coupons <span className="text-gray-500">{count}</span>
    </h1>
  );
}
