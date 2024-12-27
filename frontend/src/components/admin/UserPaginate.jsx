import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Importing React Icons

const UserPaginate = ({ pages, page, isAdmin = false, keyword }) => {
  const pageNumbers = [...Array(pages).keys()].map(x => x + 1); // Generate page numbers

  // Get the range of pages to show based on the current page
  const start = Math.max(1, page - 2); // 2 pages before current
  const end = Math.min(pages, page + 2); // 2 pages after current

  // Filter the page numbers to only show the range + ellipsis if necessary
  const pageRange = pageNumbers.filter(
    (number) => number >= start && number <= end
  );

  return (
    pages > 1 && (
      <Pagination>
        {/* Previous Button with React Icon */}
        {page > 1 && (
          <LinkContainer
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${page - 1}`
                  : `/page/${page - 1}`
                : `/admin/userlist/${page - 1}`
            }
          >
            <Pagination.Prev>
              <FaChevronLeft /> {/* React Icon for previous */}
            </Pagination.Prev>
          </LinkContainer>
        )}

        {/* First Page with Ellipsis if there are skipped pages */}
        {start > 1 && (
          <>
            <LinkContainer
              to={
                !isAdmin
                  ? keyword
                    ? `/search/${keyword}/page/1`
                    : `/page/1`
                  : `/admin/userlist/1`
              }
            >
              <Pagination.Item>1</Pagination.Item>
            </LinkContainer>
            {start > 2 && <Pagination.Ellipsis />}
          </>
        )}

        {/* Page Numbers */}
        {pageRange.map((number) => (
          <LinkContainer
            key={number}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${number}`
                  : `/page/${number}`
                : `/admin/userlist/${number}`
            }
          >
            <Pagination.Item active={number === page}>{number}</Pagination.Item>
          </LinkContainer>
        ))}

        {/* Last Page with Ellipsis if there are skipped pages */}
        {end < pages && (
          <>
            {end < pages - 1 && <Pagination.Ellipsis />}
            <LinkContainer
              to={
                !isAdmin
                  ? keyword
                    ? `/search/${keyword}/page/${pages}`
                    : `/page/${pages}`
                  : `/admin/userlist/${pages}`
              }
            >
              <Pagination.Item>{pages}</Pagination.Item>
            </LinkContainer>
          </>
        )}

        {/* Next Button with React Icon */}
        {page < pages && (
          <LinkContainer
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${page + 1}`
                  : `/page/${page + 1}`
                : `/admin/userlist/${page + 1}`
            }
          >
            <Pagination.Next>
              <FaChevronRight /> {/* React Icon for next */}
            </Pagination.Next>
          </LinkContainer>
        )}
      </Pagination>
    )
  );
};

export default UserPaginate;
