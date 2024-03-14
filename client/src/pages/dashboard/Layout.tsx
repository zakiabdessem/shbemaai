import React from "react";
import { useSelector } from "../../redux/hooks";
import { MoonLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "@/components/admin/Sidebar";
import Navigation from "@/components/Navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { loading } = useSelector((state) => state.app);

  return (
    <div className="bg-gray-100 scrollbar scrollbar-w-3 scrollbar-thumb-rounded-[0.25rem] scrollbar-track-slate-200 scrollbar-thumb-gray-400 min-h-[100vh]">
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex justify-center items-center">
          <MoonLoader size={25} loading={loading} />
        </div>
      )}
      <Sidebar />
      <div className="flex-grow p-4 sm:ml-64">
        <div className="h-full p-4 rounded-lg ">
          {/* <NavbarDashboard />*/}

          <main className="mt-16">
            <Navigation />
            <div className="p-4">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
