import { Input } from "@nextui-org/input";
import { SearchIcon } from "@/assets/icons/search_icon";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { FilterIcon } from "@/assets/icons/filter_icon";

interface DataTableHeaderProps {
  searchValue: string;
  onClear: () => void;
  onSearchChange: (value: string) => void;
  totalRecords: number;
  label: string;
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  createManyButton: React.ReactNode;
  createButton: React.ReactNode;
  filterNodes?: React.ReactNode[];
}

const ApplyFiltersModal = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        startContent={<FilterIcon className="size-4 text-default-900" />}
        onPress={onOpen}
        className="w-full md:w-auto"
      >
        Filtros
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Filtros</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">{children}</div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={onClose}
                  className="w-full md:w-auto"
                >
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

/**
 * DataTableHeader is a component that displays the header of the DataTable.
 * It provides features like search input, buttons for creating new records, and a dropdown for rows per page selection.
 *
 * @param {Object} props - The properties that define the DataTableHeader component.
 * @param {string} props.searchValue - The current value of the search input.
 * @param {function} props.onClear - Function to clear the search input.
 * @param {function} props.onSearchChange - Function to handle changes in the search input.
 * @param {number} props.totalRecords - The total number of records.
 * @param {string} props.label - The label for the table.
 * @param {function} props.onRowsPerPageChange - Function to handle changes in the rows per page selection.
 * @param {ReactNode} props.createButton - The button to create a new record.
 * @param {ReactNode} props.createManyButton - The button to create many new records.
 * @param {Array} props.filterNodes - Other filters to be applied to the table data.
 *
 * @component
 *
 * @returns {ReactNode} The DataTableHeader component.
 *
 * @since 2024-04-10
 * @author Armando Terrazas
 */
export const DataTableHeader = ({
  searchValue,
  onClear,
  onSearchChange,
  totalRecords,
  label,
  onRowsPerPageChange,
  createManyButton,
  createButton,
  filterNodes,
}: DataTableHeaderProps) => {
  return (
    <section className="flex flex-col gap-4">
      <search className="flex flex-wrap items-end justify-between gap-3">
        <Input
          role="searchbox"
          isClearable
          className="w-full md:max-w-[44%]"
          placeholder="Buscar"
          startContent={<SearchIcon />}
          value={searchValue}
          onClear={onClear}
          onValueChange={onSearchChange}
        />
        <div className="flex flex-grow flex-col items-center justify-center gap-2 sm:flex-grow-0 sm:flex-row">
          {createManyButton}
          {createButton}
        </div>
        {filterNodes && <ApplyFiltersModal>{filterNodes}</ApplyFiltersModal>}
      </search>
      <div className="flex flex-wrap items-center justify-between">
        <small className="text-small text-default-400">
          Total de {label}: {totalRecords}
        </small>
        <label
          htmlFor="rowsPerPage"
          className="flex items-center gap-2 text-small text-default-400"
        >
          Filas por p&aacute;gina:
          <select
            name="rowsPerPage"
            id="rowsPerPage"
            className="bg-transparent text-small text-default-400 outline-none"
            onChange={onRowsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    </section>
  );
};
