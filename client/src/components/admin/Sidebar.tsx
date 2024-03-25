import { useState } from "react";

import Navbar from "./Navbar";
import { asset } from "@/lib/data";
import { MAIN_DASHBOARD_URL } from "@/app/constants";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const Menus = [
    {
      title: "Dashboard",
      href: MAIN_DASHBOARD_URL,
      src: asset("sidebar/dashboard.svg"),
      disabled: true,
    },
    {
      title: "Customers",
      href: MAIN_DASHBOARD_URL + "/customers",
      src: asset("sidebar/users.svg"),
      disabled: true,
    },
    {
      title: "Products",
      href: MAIN_DASHBOARD_URL + "/products",
      src: asset("sidebar/products.svg"),
    },
    {
      title: "Orders",
      href: MAIN_DASHBOARD_URL + "/orders",
      src: asset("sidebar/orders.svg"),
      inbox: true,
    },
    {
      title: "Coupon",
      href: MAIN_DASHBOARD_URL + "/coupons",
      src: asset("sidebar/coupon.png"),
      gap: true,
      disabled: false,
    },
    {
      title: "Announcement",
      href: MAIN_DASHBOARD_URL + "/announce",
      src: asset("sidebar/coupon.png"),
      gap: true,
      disabled: true,
    },
    {
      title: "Business",
      href: MAIN_DASHBOARD_URL + "/announce",
      src: asset("sidebar/coupon.png"),
      gap: true,
      disabled: true,
    },
  ];

  const toggleSidebar = () => setIsOpen(isOpen);

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      {isOpen && (
        <div
          drawer-backdrop=""
          className="bg-gray-900/50 fixed inset-0 z-30"
          onClick={toggleSidebar}></div>
      )}
      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform sm:translate-x-0 sm:pt-20 ${
          isOpen ? "" : "pt-0 -translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-800 ">
          <ul className="space-y-2 font-medium">
            {Menus.map((menu, index) => (
              <li
                key={index}
                className={
                  menu.disabled ? "opacity-50 cursor-not-allowed" : ""
                }>
                <a
                  href={menu.href}
                  onClick={(e) => {
                    if (menu.disabled) {
                      e.preventDefault();
                    }
                  }}
                  className={`flex items-center p-2 text-gray-100 rounded-lg hover:bg-gray-700 ${
                    menu.disabled ? "pointer-events-none" : ""
                  }`}
                  aria-disabled={menu.disabled}>
                  {/* <img
                    className="w-5 h-5 filter text-gray-500 transition duration-75 group-hover:text-gray-100"
                    src={menu.src}
                    alt={menu.title}
                  /> */}
                  {menu.title}
                  {/* {menu.inbox && (
                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                      3
                    </span>
                  )} */}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
