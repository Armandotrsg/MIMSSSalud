import { Pagination } from "@nextui-org/pagination";
import { Button } from "@nextui-org/button";

interface DataTablePaginationProps {
  pages: number;
  page: number;
  setPage: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

/**
 * DataTablePagination is a component that provides pagination for the DataTable.
 * It displays the current page number, total pages, and buttons for navigating to the next and previous pages.
 *
 * @param {Object} props - The properties that define the DataTablePagination component.
 * @param {number} props.pages - The total number of pages.
 * @param {number} props.page - The current page number.
 * @param {function} props.setPage - Function to set the current page number.
 * @param {function} props.onNextPage - Function to navigate to the next page.
 * @param {function} props.onPreviousPage - Function to navigate to the previous page.
 *
 * @component
 *
 * @returns {ReactNode} The DataTablePagination component.
 * 
 * @since 2024-04-10
 * @author Armando Terrazas
 */
export const DataTablePagination = ({
  pages,
  page,
  setPage,
  onNextPage,
  onPreviousPage,
}: DataTablePaginationProps) => (
  <section className="flex items-center justify-between px-2 py-2">
    <span className="w-[30%] text-small text-default-400" />
    {pages > 0 && (
      <>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Anterior
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Siguiente
          </Button>
        </div>
      </>
    )}
  </section>
);
