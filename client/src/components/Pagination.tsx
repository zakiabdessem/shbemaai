import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const MAX_ITEMS = 15;

export default function PaginationComponent({ count }: { count: number }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const handleNextClick = () => setCurrentPage((prevPage) => prevPage + 1);

  const handlePreviousClick = () =>
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));

  useEffect(() => {
    if (count / MAX_ITEMS < currentPage) setCurrentPage(1);
    else navigate(`?page=${currentPage}`);
  }, [currentPage]);

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={handlePreviousClick} />
          </PaginationItem>
        )}
        {/* Assuming you want to show the current page */}
        <PaginationItem>
          <PaginationLink>{currentPage}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={handleNextClick} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
