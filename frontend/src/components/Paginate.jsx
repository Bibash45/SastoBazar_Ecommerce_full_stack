import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Importing React Icons

const Paginate = ({ pages, page }) => {
  const pageNumbers = [...Array(pages).keys()].map(x => x + 1); // Generate page numbers

  // Get the range of pages to show based on the current page
  const start = Math.max(1, page - 2); // 2 pages before current
  const end = Math.min(pages, page + 2); // 2 pages after current

  // Filter the page numbers to only show the range + ellipsis if necessary
  const pageRange = pageNumbers.filter(
    (number) => number >= start && number <= end
  );

  // Generate the base link for each page (using pageNumber query)
  const generateLink = (pageNumber) => {
    const currentPath = window.location.pathname; // Get the current URL path
    const searchParams = new URLSearchParams(window.location.search); // Get the current search parameters
    searchParams.set('pageNumber', pageNumber); // Set the new pageNumber query
    return {
      pathname: currentPath,
      search: searchParams.toString() // Convert search parameters back to query string
    };
  };

  return (
    pages > 1 && (
      <Pagination>
        {/* Previous Button */}
        {page > 1 && (
          <LinkContainer to={generateLink(page - 1)}>
            <Pagination.Prev>
              <FaChevronLeft /> {/* React Icon for previous */}
            </Pagination.Prev>
          </LinkContainer>
        )}

        {/* First Page with Ellipsis if there are skipped pages */}
        {start > 1 && (
          <>
            <LinkContainer to={generateLink(1)}>
              <Pagination.Item>1</Pagination.Item>
            </LinkContainer>
            {start > 2 && <Pagination.Ellipsis />}
          </>
        )}

        {/* Page Numbers */}
        {pageRange.map((number) => (
          <LinkContainer key={number} to={generateLink(number)}>
            <Pagination.Item
              className={number === page ? 'active-page' : ''}
            >
              {number}
            </Pagination.Item>
          </LinkContainer>
        ))}

        {/* Last Page with Ellipsis if there are skipped pages */}
        {end < pages && (
          <>
            {end < pages - 1 && <Pagination.Ellipsis />}
            <LinkContainer to={generateLink(pages)}>
              <Pagination.Item>{pages}</Pagination.Item>
            </LinkContainer>
          </>
        )}

        {/* Next Button */}
        {page < pages && (
          <LinkContainer to={generateLink(page + 1)}>
            <Pagination.Next>
              <FaChevronRight /> {/* React Icon for next */}
            </Pagination.Next>
          </LinkContainer>
        )}
      </Pagination>
    )
  );
};

export default Paginate;
