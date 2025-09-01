import { useQuery } from "@tanstack/react-query";
import { fetchListOfCharacters } from "../apis/api.helper";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

// Columns defined once outside
const columns = [
  { header: "Name", accessorKey: "name" },
  { header: "Gender", accessorKey: "gender" },
  { header: "Status", accessorKey: "status" },
  { header: "Species", accessorKey: "species" },
  { header: "Type", accessorKey: "type" },
];

// RefreshButton
function RefreshButton({
  onClick,
  isFetching,
}: {
  onClick: () => void;
  isFetching: boolean;
}) {
  const [rotating, setRotating] = useState(false);

  const handleClick = async () => {
    setRotating(true);
    await onClick();
    setTimeout(() => setRotating(false), 700);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isFetching}
      className="w-8 h-8 flex items-center justify-center rounded-full border hover:bg-gray-200 disabled:opacity-50 transition"
    >
      <img
        src="/refresh.svg"
        alt="refresh"
        className={`w-5 h-5 transform transition-transform duration-700 ${
          rotating || isFetching ? "rotate-180" : "rotate-0"
        }`}
      />
    </button>
  );
}

//  PaginationControls
function PaginationControls({
  pageIndex,
  totalPages,
  onPageChange,
}: {
  pageIndex: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => onPageChange(pageIndex - 1)}
        disabled={pageIndex === 1}
        className="border hover:bg-gray-100 px-2 py-1 rounded disabled:opacity-50"
      >
        <img
          className="w-5 h-5 transform scale-x-[-1]"
          src="/arrow.svg"
          alt="prev"
        />
      </button>

      <span>
        Page {pageIndex} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(pageIndex + 1)}
        disabled={pageIndex >= totalPages}
        className="border hover:bg-gray-100 px-2 py-1 rounded disabled:opacity-50"
      >
        <img className="w-5 h-5" src="/arrow.svg" alt="next" />
      </button>
    </div>
  );
}

function ListPage() {
  const navigate = useNavigate();

  // LocalStorage for pagination
  const [pagination, setPagination] = useState(() => ({
    pageIndex: Number(localStorage.getItem("pageIndex")) || 1,
    pageSize: 10,
  }));

  useEffect(() => {
    localStorage.setItem("pageIndex", pagination.pageIndex.toString());
  }, [pagination.pageIndex]);

  const { data, isFetching, refetch, isError } = useQuery({
    queryKey: ["characters", pagination.pageIndex],
    queryFn: () => fetchListOfCharacters(pagination.pageIndex),
    placeholderData: (prev) => prev,
  });

  const table = useReactTable({
    columns,
    data: data?.results ?? [],
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: data?.info?.count ?? 0,
    state: { pagination },
    onPaginationChange: setPagination,
  });

  if (isFetching && !data) return <div>Loading...</div>;
  if (isError) return <div>Error loading characters</div>;

  return (
    <div className="flex flex-col gap-5 w-full p-8">
      <h1 className="flex justify-center w-full text-3xl text-gray-500 font-bold py-4">
        Rick & Morty REST API
      </h1>

      {/*  Top Controls */}
      <div className="flex justify-end gap-10 items-center">
        <RefreshButton onClick={refetch} isFetching={isFetching} />
        <PaginationControls
          pageIndex={pagination.pageIndex}
          totalPages={data?.info?.pages ?? 1}
          onPageChange={(page) =>
            setPagination((p) => ({ ...p, pageIndex: page }))
          }
        />
      </div>

      {/* Table */}
      <table className="mt-4 border-collapse border w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => (
                <th key={header.id} className="border px-2 py-2 bg-gray-50">
                  {header.column.columnDef.header}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => navigate({ to: `/character/${row.original.id}` })}
              className="cursor-pointer hover:bg-gray-100"
            >
              {row.getVisibleCells().map((cell: any) => (
                <td key={cell.id} className="text-center border px-2 py-1">
                  {cell.getValue() || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListPage;
