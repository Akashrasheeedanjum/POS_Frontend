"use client"
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react"
import MainContent from "./_components/main-content";
import ReduxProvider from "@/app/Redux/provider";
import { VatRate } from "@/lib/actions/articles.actions";
import { ArticleCellAction } from "./_components/ArticleCellAction";
import { Supplier } from "@/lib/actions/suppliers.action";


type Article = {
  productId: string;
  designation: string;
  quantityStock: number;
  quantityMinimum: number;
  supplier: Supplier;
  refArt: string;
  vatCode: VatRate;
};

// export const columns: ColumnDef<Article>[] = [
const columns: ColumnDef<Article>[] = [
  {
    id: 'productId',
    accessorKey: 'productId',
    header: 'Product ID',
    enableResizing: true
  },
  {
    id: 'designation',
    accessorKey: 'designation',
    header: 'Designation',
    enableResizing: true
  },
  {
    id: 'quantityStock',
    accessorKey: 'quantityStock',
    header: 'QuantityStock',
    enableResizing: true
  },
  {
    id: 'quantityMinimum',
    accessorKey: 'quantityMinimum',
    header: 'Quantity Minimum',
    enableResizing: true
  },
  {
    id: 'Supplier',
    // accessorKey: 'supplier.nameDenomination',
    accessorFn: (row) => row?.supplier?.nameDenomination ?? row?.supplier,
    header: 'Supplier', 
    enableResizing: true
  },
  {
    id: 'refArt',
    accessorKey: 'refArt',
    header: 'RefArt',
    enableResizing: true
  },
  {
    id: 'category',
    accessorKey: 'category.name',
    header: 'Category',
    enableResizing: true
  },
    {
    id: 'subCategory',
    accessorKey: 'subCategory.name',
    header: 'Sub-Category',
    enableResizing: true
  },
  // {
  //   id: 'tel2',
  //   accessorKey: 'tel2',
  //   header: 'Tel 2',
  //   enableResizing: true
  // },
  // {
  //   id: 'fax',
  //   accessorKey: 'fax',
  //   header: 'Fax',
  //   enableResizing: true
  // },
  // {
  //   id: 'accountNumber',
  //   accessorKey: 'accountNumber',
  //   header: 'Account Number',
  //   enableResizing: true
  // },
  // {
  //   id: 'email',
  //   accessorKey: 'email',
  //   header: 'Email',
  //   enableResizing: true
  // },
  {
    id: 'actions',
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ArticleCellAction data={row.original} />
  }
];

const Page = () => {
  return (

    <ReduxProvider>
      <MainContent
        columns={columns}

      />
    </ReduxProvider>
  )
}

export default Page