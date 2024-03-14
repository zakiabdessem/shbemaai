import { MAIN_WEBSITE_URL } from "@/app/constants";
import { asset } from "@/lib/data";

function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <nav className="fixed z-30 w-full bg-gray-50 border-b border-gray-200 shadow-sm">
      <div className="px-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <ToggleNavButton toggleSidebar={toggleSidebar} />
            <a href={MAIN_WEBSITE_URL} className="flex ml-2">
              <img
                src={asset("logo.webp")}
                className="h-20 mr-5"
                alt="FlowBite Logo"
              />
            </a>
          </div>
          <div className="flex items-center">
            <div className="hidden mr-3 -mb-1 sm:block">
              <span />
            </div>

            {/* Notifications */}
            <button
              type="button"
              data-dropdown-toggle="notification-dropdown"
              className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100">
              <span className="sr-only">View notifications</span>
              {/* Bell icon */}
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function ToggleNavButton({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <button
      data-drawer-target="default-sidebar"
      data-drawer-toggle="default-sidebar"
      aria-controls="default-sidebar"
      type="button"
      className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      onClick={toggleSidebar}>
      <span className="sr-only">Open sidebar</span>
      {/* SVG icon here */}
      <svg
        className="w-6 h-6"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg">
        <path
          clipRule="evenodd"
          fillRule="evenodd"
          d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
      </svg>
    </button>
  );
}

export default Navbar;
