import { TitlePage } from "@/components/PageTitle";
import Layout from "../Layout";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { instance } from "@/app/axios";
import { useNavigate } from "react-router-dom";
import { MAIN_DASHBOARD_URL } from "@/app/constants";
import { useDispatch } from "@/redux/hooks";
import { APP_SET_ERROR } from "@/redux/app/appTypes";

const formSchema = z.object({
  code: z.string(),
  discount: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number()),
  expireDate: z.date(),
});

export function CreateCoupon() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      expireDate: undefined,
    },
  });

  const onSubmit = async (data: any) => {
    Object.assign(data, {
      isActive: true,
    });

    dispatch({
      type: "APP_SET_LOADING",
    });

    await instance
      .post("/coupon/create", data, {
        withCredentials: true,
      })
      .then(() => navigate(`${MAIN_DASHBOARD_URL}/coupons`))
      .catch((error) => {
        dispatch({
          type: APP_SET_ERROR,
          payload: {
            error: error.response.data.message || "something went wrong",
          },
        });
      });

    dispatch({
      type: "APP_CLEAR_LOADING",
    });
  };

  return (
    <Layout>
      <TitlePage>Create Coupon</TitlePage>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-lg:flex-col gap-2">
        <div className="bg-white rounded-md w-full">
          <div className="p-5 flex flex-col justify-between">
            <Form {...form}>
              <FormField
                name="code"
                render={({ field }) => (
                  <FormItem className="max-w-72">
                    <FormLabel>Code</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Code Remise"
                        maxLength={64}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      le code que le client utilisera pour obtenir une
                      réduction.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                name="discount"
                render={({ field }) => (
                  <FormItem className="mt-2 w-32">
                    <FormLabel>Percentage</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        id="discount"
                        type="number" // Render input as number type
                        placeholder="Example: 5%"
                        max={100} // Set max value for percentage
                        min={0} // Set min value for percentage
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expireDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-3 max-w-64">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "LLL dd, y")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="single"
                          selected={field?.value}
                          onSelect={field.onChange}
                          numberOfMonths={1}
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
          </div>
          <Button className="m-5" type="submit" color="primary">
            Create Coupon
          </Button>
        </div>
      </form>
    </Layout>
  );
}
