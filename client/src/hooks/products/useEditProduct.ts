import { useMutation } from "react-query";
import { Product } from "./useProducts";
import { instance } from "@/app/axios";
import { useNavigate } from "react-router-dom";
import { MAIN_DASHBOARD_URL } from "@/app/constants";
import { toast } from "react-toastify";
import { useDispatch } from "@/redux/hooks";

export const useEditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleAddProduct = async (product: Product) => {
    const { data }: { data: Product } = await instance.post(
      `/product/edit/`,
      product
    );
    return data;
  };

  return useMutation(handleAddProduct, {
    onSuccess: () => {
      navigate(`${MAIN_DASHBOARD_URL}/products`);
      dispatch({
        type: "APP_CLEAR_LOADING",
      });
    },
    onError: (error: any) => {
      if (
        Array.isArray(error.response.data.message) &&
        error.response.data.message.length > 0
      )
        toast.error(error.response.data.message[0], {
          position: "bottom-right",
        });
      else
        toast.error(error.response.data.message, {
          position: "bottom-right",
        });

      dispatch({
        type: "APP_CLEAR_LOADING",
      });
    },
  });
};
