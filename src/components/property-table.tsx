'use client';

import { useState } from 'react';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconFile,
} from '@tabler/icons-react';
import {
  useProperties,
  useDeleteProperty,
  usePublishProperty,
  useUnpublishProperty,
  useMarkAsDraft,
} from '@/hooks/use-properties';
import { Property } from '@prisma/client';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

const columns: ColumnDef<Property>[] = [
  {
    accessorKey: 'thumbnail',
    header: 'Thumbnail',
    cell: ({ row }) => {
      const thumbnail = row.original.thumbnail;
      if (thumbnail) {
        return (
          <Image
            src={thumbnail.url}
            alt={thumbnail.altText || 'Property thumbnail'}
            width={64}
            height={64}
            className="object-cover rounded"
          />
        );
      }
      return <div className="w-16 h-16 bg-gray-200 rounded"></div>;
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div className="max-w-xs truncate">{row.original.description}</div>
    ),
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => <div>${row.original.price.toLocaleString()}</div>,
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => <div>{row.original.location}</div>,
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.slug}</div>
    ),
  },
  {
    accessorKey: 'propertyType',
    header: 'Type',
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.propertyType}</Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === 'PUBLISHED'
            ? 'default'
            : row.original.status === 'DRAFT'
            ? 'secondary'
            : 'outline'
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => (
      <div>{new Date(row.original.createdAt).toLocaleDateString()}</div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const property = row.original;
      const publishMutation = usePublishProperty();
      const unpublishMutation = useUnpublishProperty();
      const draftMutation = useMarkAsDraft();
      const deleteMutation = useDeleteProperty();

      const handlePublish = async () => {
        try {
          await publishMutation.mutateAsync(property.id);
          toast.success('Property published');
        } catch (error) {
          toast.error('Failed to publish property');
        }
      };

      const handleUnpublish = async () => {
        try {
          await unpublishMutation.mutateAsync(property.id);
          toast.success('Property unpublished');
        } catch (error) {
          toast.error('Failed to unpublish property');
        }
      };

      const handleMarkAsDraft = async () => {
        try {
          await draftMutation.mutateAsync(property.id);
          toast.success('Property marked as draft');
        } catch (error) {
          toast.error('Failed to mark as draft');
        }
      };

      const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this property?')) {
          try {
            await deleteMutation.mutateAsync(id);
            toast.success('Property deleted successfully');
          } catch (error) {
            toast.error('Failed to delete property');
          }
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Actions">
              <IconDotsVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/properties/${property.id}/edit`}>
                {' '}
                <IconEdit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            {property.status === 'DRAFT' && (
              <DropdownMenuItem onClick={handlePublish}>
                <IconEye className="mr-2 h-4 w-4" />
                Publish
              </DropdownMenuItem>
            )}
            {property.status === 'PUBLISHED' && (
              <DropdownMenuItem onClick={handleUnpublish}>
                <IconEyeOff className="mr-2 h-4 w-4" />
                Unpublish
              </DropdownMenuItem>
            )}
            {property.status === 'PUBLISHED' && (
              <DropdownMenuItem onClick={handleMarkAsDraft}>
                <IconFile className="mr-2 h-4 w-4" />
                Mark as Draft
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              variant="destructive"
              onClick={() => handleDelete(property.id)}
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function PropertyTable() {
  const { data: properties, isLoading, error } = useProperties();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data: properties || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading properties</div>;
  }

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter properties..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
