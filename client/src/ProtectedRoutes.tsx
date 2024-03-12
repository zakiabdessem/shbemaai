import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "./redux/hooks";
import { verifyToken } from "./redux/auth/authActions";
import { RootState } from "./redux/stateTypes";

const ProtectedRoutes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    dispatch(verifyToken());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) navigate("/auth/login");

  return <Outlet />;
};

export default ProtectedRoutes;
