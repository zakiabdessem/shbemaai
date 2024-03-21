import { useLocation, Link } from "react-router-dom";

function Navigation() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="flex p-3 " aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rounded-lg overflow-auto">
        <li className="inline-flex items-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-700 hover:text-primary-600 px-2 py-1 rounded-lg">
            <svg
              className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </Link>
          {/* Icon separation for mobile vs desktop view */}
          <svg
            className="w-5 h-5 text-gray-400 hidden md:inline-block"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const formatText = (text: string) =>
            text.charAt(0).toUpperCase() + text.slice(1);

          return (
            <li
              key={name}
              className="inline-flex items-center text-gray-700 hover:text-primary-600 px-2 py-1 rounded-lg">
              {index > 0 && (
                <svg
                  className="w-5 h-5 text-gray-400 hidden md:inline-block"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}

              {isLast ? (
                <span className="inline-flex items-center text-gray-700 hover:text-primary-600 px-2 py-1 rounded-lg">
                  {formatText(name)}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="ml-1 text-gray-700 hover:text-primary-600 md:ml-2 px-2 py-1 rounded-lg">
                  {formatText(name)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Navigation;
