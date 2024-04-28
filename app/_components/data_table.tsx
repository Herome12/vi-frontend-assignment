"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
     // TASK : Make first 2 columns (i.e. checkbox and task id) sticky
     // TASK : Make header columns resizable
    const [columnWidths, setColumnWidths] = useState<{ [key: string]: string }>({});

    const handleResize = (event: React.MouseEvent<HTMLDivElement>, columnId: string) => {
        const tableHeaderRect = event.currentTarget.getBoundingClientRect();
        const newWidth = `${event.clientX - tableHeaderRect.left}px`;
        setColumnWidths((prevWidths) => ({
            ...prevWidths,
            [columnId]: newWidth,
        }));
    };

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header, index) => (
                                    <TableHead
                                        key={header.id}
                                        style={{
                                            width: columnWidths[header.id] || "auto",
                                            position: index < 2 ? "sticky" : "static",
                                            left: index === 0 ? 0 : (index === 1 ? "500px" : "unset"),
                                        }}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={() => setColumnWidths({})}
                                        draggable
                                        onDrag={(e) => handleResize(e, header.id)}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
