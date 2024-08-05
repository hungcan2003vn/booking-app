import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ui/data-table-column-header";
import React from "react";

export const usersColumns: ColumnDef<any>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[500px] truncate font-medium">
        {row.original.username}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <a href={row.original.email} target="_blank" rel="noopener noreferrer">
        {row.original.email}
      </a>
    ),
  },
];
