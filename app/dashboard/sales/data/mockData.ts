import type { Category, Product, User } from "@/types/sales"

export const categories: Category[] = [
  {
    id: "1",
    name: "PC",
    slug: "pc",
    subCategories: [
      { id: "1-1", name: "Gaming" },
      { id: "1-2", name: "Office" },
    ],
  },
  {
    id: "2",
    name: "CLAVIERS",
    slug: "keyboards",
    subCategories: [
      { id: "2-1", name: "Mechanical" },
      { id: "2-2", name: "Wireless" },
    ],
  },
  {
    id: "3",
    name: "ECRANS",
    slug: "screens",
    subCategories: [
      { id: "3-1", name: "LED" },
      { id: "3-2", name: "LCD" },
    ],
  },
  {
    id: "4",
    name: "MOUSE",
    slug: "mouse",
    subCategories: [
      { id: "4-1", name: "Wireless" },
      { id: "4-2", name: "Gaming" },
    ],
  },
  // ✅ New Category: PRINTERS
  {
    id: "5",
    name: "PRINTERS",
    slug: "printers",
    subCategories: [
      { id: "5-1", name: "Inkjet" },
      { id: "5-2", name: "Laser" },
    ],
  },
    {
    id: "6",
    name: "Umelles",
    slug: "pc",
    subCategories: [
      { id: "1-1", name: "Gaming" },
      { id: "1-2", name: "Office" },
    ],
  },
  {
    id: "7",
    name: "Awais",
    slug: "keyboards",
    subCategories: [
      { id: "2-1", name: "Mechanical" },
      { id: "2-2", name: "Wireless" },
    ],
  },
  {
    id: "8",
    name: "Eley",
    slug: "screens",
    subCategories: [
      { id: "3-1", name: "LED" },
      { id: "3-2", name: "LCD" },
    ],
  },
  {
    id: "9",
    name: "Mount",
    slug: "mouse",
    subCategories: [
      { id: "4-1", name: "Wireless" },
      { id: "4-2", name: "Gaming" },
    ],
  },
    {
    id: "10",
    name: "PRINTERS",
    slug: "printers",
    subCategories: [
      { id: "5-1", name: "Inkjet" },
      { id: "5-2", name: "Laser" },
    ],
  },
    {
    id: "11",
    name: "Umelles",
    slug: "pc",
    subCategories: [
      { id: "1-1", name: "Gaming" },
      { id: "1-2", name: "Office" },
    ],
  },
  {
    id: "12",
    name: "Awais",
    slug: "keyboards",
    subCategories: [
      { id: "2-1", name: "Mechanical" },
      { id: "2-2", name: "Wireless" },
    ],
  },
  {
    id: "13",
    name: "Eley",
    slug: "screens",
    subCategories: [
      { id: "3-1", name: "LED" },
      { id: "3-2", name: "LCD" },
    ],
  },
  {
    id: "14",
    name: "Mount",
    slug: "mouse",
    subCategories: [
      { id: "4-1", name: "Wireless" },
      { id: "4-2", name: "Gaming" },
    ],
  },
]


export const products: Product[] = [
  {
    id: "1",
    name: "LOGITECH K480 BK BT",
    price: 39.0,
    image: "/girls.jpg",
    categoryId: "2",
    subCategoryId: "2-2",
    stock: 20,
    description: "Bluetooth multi-device wireless keyboard",
  },
  {
    id: "2",
    name: "STEELSERIES 6GV2",
    price: 19.0,
    image: "/keyboard-6gv2.jpg",
    categoryId: "2",
    subCategoryId: "2-1",
    stock: 10,
    description: "Mechanical gaming keyboard",
  },
  {
    id: "3",
    name: "ACER ASPIRE ZC-700",
    price: 325.0,
    image: "/acer-aspire.jpg",
    categoryId: "1",
    subCategoryId: "1-2",
    stock: 5,
    description: "All-in-one office desktop PC",
  },
  {
    id: "4",
    name: "OMEN GAMING RIG X100",
    price: 999.0,
    image: "/omen-x100.jpg",
    categoryId: "1",
    subCategoryId: "1-1",
    stock: 4,
    description: "High-performance gaming desktop",
  },
  {
    id: "5",
    name: "PHILIPS 223V5LSB/00",
    price: 119.0,
    image: "/philips-223v.jpg",
    categoryId: "3",
    subCategoryId: "3-1",
    stock: 9,
    description: "21.5\" LED monitor",
  },
  {
    id: "6",
    name: "DELL LCD 19”",
    price: 89.0,
    image: "/dell-lcd.jpg",
    categoryId: "3",
    subCategoryId: "3-2",
    stock: 7,
    description: "Standard 19” LCD screen for office use",
  },
]


export const currentUser: User = {
  id: "1",
  name: "Admin",
  role: "Administrator",
}
