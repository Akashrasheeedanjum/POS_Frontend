"use client"

import { useEffect, useState } from "react"
import {
  Scissors,
  Copy,
  FileText,
  Upload,
  Download,
  X,
  Menu,
  ArrowUpDown,
  Type,
  Search,
  FileInput as FileImport,
  List,
  FolderOpen,
  Save,
  FileEdit,
  Hash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InvoiceLineItem, SelectedArticle } from "../../sales/data/mock-articles"
import ArticlesSelectionModal from "./articles-selection-modal"
import { mergeArticles } from "../Helper/mergeArticles"
import { useSelector } from "react-redux"
import { RootState } from "@/app/Redux/store"
import { getActivePriceCategory } from "../Helper/activePriceCategory"
import SaveDocument from "./save-document"
import { getLatestVatVersion } from "@/lib/actions/sales.actions"
import { useSession } from "@clerk/nextjs"
interface InvoiceInterfaceProps {
  isEditMode?: boolean;
  initialData?: any;
}

export function getActiveCategory(article: any, selectedCustomer: any) {
  let activeCategory: keyof typeof article | null = null;
  if (selectedCustomer?.usePriceList4) activeCategory = "priceCategory4";
  else if (selectedCustomer?.usePriceList3) activeCategory = "priceCategory3";
  else if (selectedCustomer?.usePriceList2) activeCategory = "priceCategory2";
  else if (selectedCustomer?.usePriceList1) activeCategory = "priceCategory1";
  // ⚠️ FIX: return category name, not article property
  return activeCategory || "priceCategory1";
}


export default function InvoiceInterface({ isEditMode = false }: any) {

  const { session } = useSession();
  const token: any = session?.user?.publicMetadata?.token

  const [forcingVAT, setForcingVAT] = useState("0 %")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [articlesModalOpen, setArticlesModalOpen] = useState(false)
  const [selectedArticles, setSelectedArticles] = useState<SelectedArticle[]>([])
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [noArticlesModalOpen, setNoArticlesModalOpen] = useState(false);
  const [openEditPaymentModal, setOpenEditPaymentModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
console.log("selectedTicket-->", selectedTicket)
  const [latestVAT, setLatestVAT] = useState(null);

  const selectedDocument = useSelector((state: any) => state.newdocument.selectedDocument);//Edit mode me selected
  console.log("selectedDocument-->", selectedDocument)
  //  document laega
  useEffect(() => {
    if (
      isEditMode && selectedDocument?.articles?.length > 0 &&
      selectedDocument?.customer
    ) {
      const customer = selectedDocument.customer;

      const mappedArticles = selectedDocument.articles.map((a: any) => {
        const activeCategory = getActiveCategory(a, customer);

        const baseArticle: any = {
          _id: a.articleId,
          productId: a.article_productId,
          designation: a.nameAtPurchase,
          quantity: a.quantityAtPurchase,
          articleCategory: a.articleCategory,
          purchasePrice: a.purchasePrice,
          supplierName: a.supplierName,
          vatRate: a.rateOfVat_atPurchase,
          totalPriceVatExcl: a.totalPrice_vatExclude,
          totalPriceVatIncl: a.totalPrice_vatInclude,
          vatAmount: a.calcVatAmount,

          // initialize all categories
          priceCategory1: {},
          priceCategory2: {},
          priceCategory3: {},
          priceCategory4: {},
        };

        // ✅ assign using category name (now valid string)
        baseArticle[activeCategory] = {
          priceVatExcl: a.singleUnitPrice_vatExclude ?? a.purchasePrice,
          priceVatIncl:
            a.totalPrice_vatInclude / (a.quantityAtPurchase || 1),
          vatId: {
            code: a.codeOfVat_atPurchase,
            rate: a.rateOfVat_atPurchase,
          },
        };

        return baseArticle;
      });

      setSelectedArticles(mappedArticles);
    }
  }, [isEditMode, selectedDocument]);
  useEffect(() => {
    if (selectedDocument) {
      setSelectedTicket(selectedDocument); // EDIT MODE
    } else {
      setSelectedTicket(null); // CREATE MODE
    }
  }, [selectedDocument]);
  useEffect(() => {
    const fetchLatestVAT = async () => {
      try {
        if(token){
          const res = await getLatestVatVersion(token);
          setLatestVAT(res); // assume apiGet returns { data: { VAT1: ..., VAT2: ... } }
        }
      } catch (error) {
        console.error("❌ Error fetching latest VAT version:", error);
      }
    };

    fetchLatestVAT();
  }, []);
  const handleArticlesSelection = (articles: SelectedArticle[]) => {
    if (!latestVAT) {
      console.warn("⚠️ Latest VAT version not loaded yet!");
      return;
    }

    const updatedArticles = articles.map((article) => {
      // 1️⃣ Get active category object
      const activeCategory = getActivePriceCategory(article, selectedCustomer);

      // 2️⃣ Find which priceCategory key this object belongs to
      const activeKey =
        Object.keys(article).find(
          (key) => article[key as keyof SelectedArticle] === activeCategory
        ) || "priceCategory1"; // fallback safe side

      // 3️⃣ Calculate VAT
      const vatCode = activeCategory?.vatId?.code; // e.g. "VAT2"
      const latestRate = latestVAT[vatCode]; // e.g. 15

      if (latestRate) {
        const priceVatExcl = activeCategory?.priceVatExcl || 0;
        const priceVatIncl = priceVatExcl * (1 + latestRate / 100);

        return {
          ...article,
          [activeKey]: {
            ...activeCategory,
            priceVatIncl: Number(priceVatIncl?.toFixed(2)), // round properly
          },
        };
      } else {
        console.warn(`⚠️ No matching VAT code found for ${vatCode}`);
        return article;
      }
    });

    // setSelectedArticles(updatedArticles);
    // FINAL FIX: append new items + keep previous
    setSelectedArticles((prev) => {
      return [...prev, ...updatedArticles]; // simply append everything
    });

  };

  const selectedCustomer = useSelector((state: RootState) => state.customer.selectedCustomerForDocument);
  // console.log("selectedCustomer in invoice interface", selectedCustomer)
  const selectedTab = useSelector((state: RootState) => state.newdocument.selectedTab);
  // const handleInputChange = (id: string, field: string, rawValue: any) => {
  //   // rawValue is string from input; convert carefully
  //   setSelectedArticles(prev =>
  //     prev.map(a => {
  //       if (a._id !== id) return a;
  //       const article = { ...a };
  //       const priceCategory = getActivePriceCategory(article, selectedCustomer);
  //       // parse numbers for numeric fields, but allow empty string while typing
  //       // string fields
  //       const stringFields = ["productId", "designation"];
  //       // number fields
  //       const numericFields = ["unitPriceVatExcl", "unitPriceVatIncl", "quantity", "discount"];

  //       if (stringFields.includes(field)) {
  //         // string fields directly assign karo
  //         (article as any)[field] = rawValue;
  //       } else if (numericFields.includes(field)) {
  //         // number fields me empty allow karo warna number cast karo
  //         (article as any)[field] = rawValue === "" ? "" : Number(rawValue);
  //       } else {
  //         // fallback (in case koi naya field add ho future me)
  //         (article as any)[field] = rawValue;
  //       }

  //       // ensure vatRate is preserved (so UI doesn't lose VAT code)
  //       (article as any).vatRate = priceCategory.vatId?.code ?? (article as any).vatRate ?? null;

  //       // mark edited
  //       article.isEdited = true;
  //       return article;
  //     })
  //   );
  // };

  const handleInputChange = (id: string, field: string, value: any) => {
    setSelectedArticles((prev) =>
      prev.map((article) => {
        if (article._id !== id) return article;

        const updated = { ...article };
        // 🧭 Determine active category based on customer
        let activeCategoryKey: keyof typeof article | null = "priceCategory1";
        if (customerforlineitem?.usePriceList4) activeCategoryKey = "priceCategory4";
        else if (customerforlineitem?.usePriceList3) activeCategoryKey = "priceCategory3";
        else if (customerforlineitem?.usePriceList2) activeCategoryKey = "priceCategory2";
        else if (customerforlineitem?.usePriceList1) activeCategoryKey = "priceCategory1";

        const activeCategoryz = article[activeCategoryKey] || article.priceCategory1;
        const activeCategory = getActivePriceCategory(article, selectedCustomer);
        const activeKey =
          Object.keys(article).find(
            (key) => article[key as keyof SelectedArticle] === activeCategory
          ) || "priceCategory1";

        // 🧾 VAT Rate Logic
        let vatRate = 0;
        if (isEditMode) {
          // ✅ Persist VAT rate in edit mode (do not change)
          vatRate = article.vatRate ?? (
            activeCategoryz?.vatId?.rate ??
            (activeCategoryz?.vatId?.code && latestVAT
              ? latestVAT[activeCategoryz.vatId.code]
              : 0)
          );
        } else {
          // ✅ Normal mode (calculate VAT fresh)
          vatRate =
            activeCategory?.vatId?.rate ??
            (activeCategory?.vatId?.code && latestVAT
              ? latestVAT[activeCategory.vatId.code]
              : 0);
        }

        // for safe numeric parsing
        const parsed = Number(value);
        const isNum = !isNaN(parsed) && value !== "";
        console.log("Parsed in numeruc ",parsed)
        // main input logic
        switch (field) {
          case "unitPriceVatIncl":
            updated.unitPriceVatIncl = isNum ? parsed : value;
            if (isNum && vatRate) {
              // reverse calculation — recalc Excl
              const excl = +(parsed / (1 + vatRate / 100))?.toFixed(2);
              updated.unitPriceVatExcl = excl;
              if (updated[activeKey]) {
                updated[activeKey] = {
                  ...updated[activeKey],
                  priceVatIncl: parsed,
                  priceVatExcl: excl,
                };
              }
            }
            break;

          case "unitPriceVatExcl":
            updated.unitPriceVatExcl = isNum ? parsed : value;
            if (isNum && vatRate) {
              // forward calculation — recalc Incl
              const incl = +(parsed * (1 + vatRate / 100))?.toFixed(2);
              updated.unitPriceVatIncl = incl;
              if (updated[activeKey]) {
                updated[activeKey] = {
                  ...updated[activeKey],
                  priceVatExcl: parsed,
                  priceVatIncl: incl,
                };
              }
            }
            break;

          case "quantity":
          case "discount":
            updated[field] = isNum ? parsed : value;
            break;

          default:
            updated[field] = value;
        }

        // updated.vatRate =
        //   activeCategory?.vatId?.code ?? updated.vatRate ?? null;
        const codeFromCategory = activeCategory?.vatId?.code ?? updated.vatCode ?? null;
        updated.vatCode = codeFromCategory;
        updated.vatRate = vatRate;  // the numeric one you already computed above
        updated.isEdited = true;

        return updated;
      })
    );
  };


  const calculateLineItem = (
    article: any,
    selectedCustomer: any
  ) => {
    if (!selectedCustomer) {
      return {
        ...article,
        unitPriceVatExcl: 0,
        unitPriceVatIncl: 0,
        totalPriceVatExcl: 0,
        totalPriceVatIncl: 0,
        vatAmount: 0,
        vatRate: 0,
        buyingPrice: article.purchasePrice || 0,
      };
    }
    const priceCategory = getActivePriceCategory(article, selectedCustomer);
    const priceVatExcl = priceCategory?.priceVatExcl || 0;
    const priceVatIncl = priceCategory?.priceVatIncl || 0;
    const vatRate = priceCategory?.vatId?.rate || 0;

    //  Discount calculation
    const discountMultiplier = (100 - (article.discount || 0)) / 100;

    const unitPriceVatExcl = priceVatExcl * discountMultiplier;
    const unitPriceVatIncl = priceVatIncl * discountMultiplier;

    const totalPriceVatExcl = unitPriceVatExcl * (article.quantity || 1);
    const totalPriceVatIncl = unitPriceVatIncl * (article.quantity || 1);

    const vatAmount = totalPriceVatIncl - totalPriceVatExcl;

    return {
      ...article,
      unitPriceVatExcl,
      unitPriceVatIncl,
      totalPriceVatExcl,
      totalPriceVatIncl,
      vatAmount,
      vatRate,
      buyingPrice: article.purchasePrice || 0,
    };
  };

  const customerforlineitem = isEditMode ? selectedDocument?.customer : selectedCustomer;

  const calculateTotals = () => {


    // const lineItems = selectedArticles.map(calculateLineItem)
    // ✅ merge first
    const mergedArticles = mergeArticles(selectedArticles);
    console.log("mergedArticles-->", mergedArticles)
    const lineItems = mergedArticles.map((article) => {

      //.............................
      // ✅ EDIT MODE (customer based only)
      if (isEditMode && article.isEdited) {
        const qty = Number(article.quantity) || 1;

        // bas customer ke according category lo
        let activeCategory: keyof typeof article | null = "priceCategory1";
        if (customerforlineitem?.usePriceList4) activeCategory = "priceCategory4";
        else if (customerforlineitem?.usePriceList3) activeCategory = "priceCategory3";
        else if (customerforlineitem?.usePriceList2) activeCategory = "priceCategory2";
        else if (customerforlineitem?.usePriceList1) activeCategory = "priceCategory1";

        // sirf customer ke price list category lo (article ke andar match check nahi)
        const priceCategory = article[activeCategory] || article.priceCategory1;
        const unitExcl =
          article.unitPriceVatExcl !== undefined && String(article.unitPriceVatExcl) !== ""
            ? Number(article.unitPriceVatExcl)
            : priceCategory?.priceVatExcl || 0;

        const unitIncl =
          article.unitPriceVatIncl !== undefined && String(article.unitPriceVatIncl) !== ""
            ? Number(article.unitPriceVatIncl)
            : priceCategory?.priceVatIncl || 0;

        // edit mode me hamesha updateTarget = activeCategory
        const updateTarget = activeCategory;

        return {
          ...article,
          [updateTarget]: {
            ...(article[updateTarget] || {}),
            priceVatExcl: unitExcl,
            priceVatIncl: unitIncl,
          },
          unitPriceVatExcl: unitExcl,
          unitPriceVatIncl: unitIncl,
          quantity: qty,
          totalPriceVatExcl: unitExcl * qty,
          totalPriceVatIncl: unitIncl * qty,
          vatAmount: unitIncl * qty - unitExcl * qty,
        };
      }

      // ...................................
      // Agar user ne manually edit kiya hai, wahi value use karo
      if (article.isEdited) {
        const qty = Number(article.quantity) || 1;

        // decide active category based on customer
        let activeCategory: keyof typeof article | null = null;
        if (selectedCustomer?.usePriceList4) activeCategory = "priceCategory4";
        else if (selectedCustomer?.usePriceList3) activeCategory = "priceCategory3";
        else if (selectedCustomer?.usePriceList2) activeCategory = "priceCategory2";
        else if (selectedCustomer?.usePriceList1) activeCategory = "priceCategory1";
        else activeCategory = "priceCategory1";

        // customer category ya fallback
        const priceCategory = (activeCategory && article[activeCategory]) || article.priceCategory1;
        // Agar user ne manual value dali hai, wahi use hogi
        const unitExcl =
          article.unitPriceVatExcl !== undefined && String(article.unitPriceVatExcl) !== ""
            ? Number(article.unitPriceVatExcl)
            : priceCategory?.priceVatExcl || 0;

        const unitIncl =
          article.unitPriceVatIncl !== undefined && String(article.unitPriceVatIncl) !== ""
            ? Number(article.unitPriceVatIncl)
            : priceCategory?.priceVatIncl || 0;

        // Decide kaha update karna hai → match me activeCategory, mismatch me priceCategory1
        const updateTarget =
          activeCategory && article[activeCategory] ? activeCategory : "priceCategory1";

        return {
          ...article,
          [updateTarget]: {
            ...(article[updateTarget] || {}),
            priceVatExcl: unitExcl,
            priceVatIncl: unitIncl,
          },
          unitPriceVatExcl: unitExcl,
          unitPriceVatIncl: unitIncl,
          quantity: qty,
          totalPriceVatExcl: unitExcl * qty,
          totalPriceVatIncl: unitIncl * qty,
          vatAmount: unitIncl * qty - unitExcl * qty,
        };
      }



      // Warna backend/calc wali default values use karo
      return calculateLineItem(article, customerforlineitem);
    });


    const totalQty = lineItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalVATExcl = lineItems.reduce((sum, item) => sum + (item.totalPriceVatExcl || 0), 0);
    const totalVAT = lineItems.reduce((sum, item) => sum + (item.vatAmount || 0), 0);
    const totalVATIncl = totalVATExcl + totalVAT;

    const totalDiscount = lineItems.reduce(
      (sum, item) =>
        sum + ((item.purchasePrice || 0) * (item.quantity || 0) * (item.discount || 0)) / 100,
      0,
    );
    const totalBuyingPrice = lineItems.reduce(
      (sum, item) => sum + (item.purchasePrice || 0) * (item.quantity || 0),
      0,
    );
    const margin = totalVATExcl - totalBuyingPrice;


    return {
      lineItems,
      totalQty,
      totalVATExcl: totalVATExcl?.toFixed(2),
      totalVAT: totalVAT?.toFixed(2),
      totalVATIncl: totalVATIncl?.toFixed(2),
      totalDiscount: totalDiscount?.toFixed(2),
      totalBuyingPrice: totalBuyingPrice?.toFixed(2),
      margin: margin?.toFixed(2),
    }
  }

  const totals = calculateTotals()
  return (
    <div className="h-[calc(100dvh-52px)] flex flex-col bg-white overflow-y-auto">
      {/* Header Bar */}
      <div className="bg-blue-600 text-white px-2 sm:px-4 py-2 flex items-center justify-between">
        <h1 className="font-medium text-sm sm:text-base truncate">{selectedTab.name} : {customerforlineitem?.nameDenomination}</h1>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden text-white hover:bg-blue-700"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-100 border-b px-2 sm:px-4 py-2 flex items-center gap-1 sm:gap-2 overflow-x-auto">
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button variant="ghost" size="sm" className="p-1.5 sm:p-2">
            <Scissors className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-1.5 sm:p-2">
            <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-1.5 sm:p-2">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-1.5 sm:p-2">
            <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-1.5 sm:p-2">
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-1.5 sm:p-2 text-red-600">
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-1.5 sm:p-2 hidden sm:flex">
            <Menu className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-1.5 sm:p-2">
            <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-1.5 sm:p-2">
            <Type className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <span className="text-xs sm:text-sm whitespace-nowrap">Forcing VAT to:</span>
          <Select value={forcingVAT} onValueChange={setForcingVAT}>
            <SelectTrigger className="w-16 sm:w-20 h-7 sm:h-8 text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0 %">0 %</SelectItem>
              <SelectItem value="21 %">21 %</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs sm:text-sm">off</span>
        </div>
      </div>

      <div className="flex flex-1  relative overflow-y-auto">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 ">
          {/* Data Table */}
          <div className="flex-1 overflow-y-auto min-h-[200px]">
            <div className="min-w-[800px] lg:min-w-0 ">
              <table className="w-full">
                <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    <th className="px-1 sm:px-3 py-2 text-left text-xs sm:text-sm font-medium border-r">Product ID</th>
                    <th className="px-1 sm:px-3 py-2 text-left text-xs sm:text-sm font-medium border-r">Designation</th>
                    <th className="px-1 sm:px-3 py-2 text-left text-xs sm:text-sm font-medium border-r">Qty</th>
                    <th className="px-1 sm:px-3 py-2 text-left text-xs sm:text-sm font-medium border-r">C. TVA</th>
                    <th className="px-1 sm:px-3 py-2 text-left text-xs sm:text-sm font-medium border-r">
                      Unit Pr.VAT excl
                    </th>
                    <th className="px-1 sm:px-3 py-2 text-left text-xs sm:text-sm font-medium border-r">Unit price</th>
                    <th className="px-1 sm:px-3 py-2 text-left text-xs sm:text-sm font-medium border-r">Discount %</th>
                    <th className="px-1 sm:px-3 py-2 text-left text-xs sm:text-sm font-medium border-r">Nbr Colis</th>
                    <th className="px-1 sm:px-3 py-2 text-left text-xs sm:text-sm font-medium border-r">Total prijs</th>
                    <th className="px-1 sm:px-3 py-2 text-left text-xs sm:text-sm font-medium border-r">Total prijs</th>
                    <th className="px-1 sm:px-3 py-2 text-left text-xs sm:text-sm font-medium">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {totals.lineItems.map((lineItem, index) => (
                    <tr key={lineItem._id} className="border-b hover:bg-gray-50">
                      <td className="px-1 sm:px-3 py-2 border-r h-8 text-xs sm:text-sm">
                        <input
                          type="text"
                          value={lineItem.productId}
                          onChange={(e) => handleInputChange(lineItem._id, "productId", e.target.value)}
                          className="w-full bg-transparent border-none outline-none text-xs sm:text-sm"
                        />
                      </td>
                      <td className="px-1 sm:px-3 py-2 border-r text-xs sm:text-sm font-medium">
                        <input
                          type="text"
                          value={lineItem.designation}
                          onChange={(e) =>
                            handleInputChange(lineItem._id, "designation", e.target.value)
                          }
                          className="w-full bg-transparent border-none outline-none font-medium text-xs sm:text-sm"
                        />
                      </td>
                      <td className="px-1 sm:px-3 py-2 border-r text-xs sm:text-sm text-center">
                        <input
                          type="number"
                          value={lineItem.quantity}
                          onChange={(e) =>
                            handleInputChange(lineItem._id, "quantity", e.target.value)
                          }
                          className="w-16 text-center bg-transparent border rounded p-0.5"
                        />
                      </td>
                      {/* C. TVA - Non editable */}
                      <td className="px-1 sm:px-3 py-2 border-r text-xs sm:text-sm text-center">

                        {/* {lineItem.vatRate} */}
                        {lineItem.vatCode}
                      </td>
                      <td className="px-1 sm:px-3 py-2 border-r text-xs sm:text-sm text-right">
                        <input
                          type="number"
                          value={lineItem.unitPriceVatExcl ?? ""}
                          onChange={(e) => handleInputChange(lineItem._id, "unitPriceVatExcl", e.target.value)}

                          className="w-20 text-right bg-transparent border rounded p-0.5"
                        />
                      </td>
                      <td className="px-1 sm:px-3 py-2 border-r text-xs sm:text-sm text-right">
                        <input
                          type="number"
                          value={lineItem.unitPriceVatIncl ?? ""}
                          onChange={(e) =>
                            handleInputChange(lineItem._id, "unitPriceVatIncl", e.target.value)
                          }
                          className="w-20 text-right bg-transparent border rounded p-0.5"
                        />
                      </td>
                      <td className="px-1 sm:px-3 py-2 border-r text-xs sm:text-sm text-center">
                        {lineItem.discount?.toFixed(0)}
                      </td>
                      <td className="px-1 sm:px-3 py-2 border-r text-xs sm:text-sm text-center">{lineItem.quantity}</td>
                      <td className="px-1 sm:px-3 py-2 border-r text-xs sm:text-sm text-right">
                        {lineItem.totalPriceVatExcl?.toFixed(2)}
                      </td>
                      <td className="px-1 sm:px-3 py-2 border-r text-xs sm:text-sm text-right">
                        {lineItem.totalPriceVatIncl?.toFixed(2)}
                      </td>
                      <td className="px-1 sm:px-3 py-2 text-xs sm:text-sm text-center">
                        {lineItem.isEdited ? "X" : "T1"}
                      </td>
                    </tr>
                  ))}
                  {Array.from({ length: Math.max(0, 15 - selectedArticles.length) }).map((_, i) => (
                    <tr key={`empty-${i}`} className="border-b hover:bg-gray-50">
                      <td className="px-1 sm:px-3 py-2 border-r h-8"></td>
                      <td className="px-1 sm:px-3 py-2 border-r"></td>
                      <td className="px-1 sm:px-3 py-2 border-r"></td>
                      <td className="px-1 sm:px-3 py-2 border-r"></td>
                      <td className="px-1 sm:px-3 py-2 border-r"></td>
                      <td className="px-1 sm:px-3 py-2 border-r"></td>
                      <td className="px-1 sm:px-3 py-2 border-r"></td>
                      <td className="px-1 sm:px-3 py-2 border-r"></td>
                      <td className="px-1 sm:px-3 py-2 border-r"></td>
                      <td className="px-1 sm:px-3 py-2 border-r"></td>
                      <td className="px-1 sm:px-3 py-2"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Bottom Pricing Section */}
          <div className="border-t bg-white p-2 sm:p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
              {/* Sell Price */}
              <div>
                <h3 className="font-medium mb-3 text-sm sm:text-base">Sell price</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm text-gray-600">Total VAT excl</label>
                    <Input
                      value={`${totals.totalVATExcl} €`}
                      className="mt-1 text-xs sm:text-sm h-8 sm:h-10"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-600">Total VAT</label>
                    <Input value={`${totals.totalVAT} €`} className="mt-1 text-xs sm:text-sm h-8 sm:h-10" readOnly />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs sm:text-sm text-gray-600">Total VAT incl.</label>
                    <Input
                      value={`${totals.totalVATIncl} €`}
                      className="mt-1 text-xs sm:text-sm h-8 sm:h-10"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-600">Total Discount</label>
                    <Input
                      value={totals.totalDiscount}
                      onChange={() => { }}
                      className="mt-1 text-xs sm:text-sm h-8 sm:h-10"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-600">Total Qty</label>
                    <Input
                      value={totals.totalQty.toString()}
                      className="mt-1 text-xs sm:text-sm h-8 sm:h-10"
                      readOnly
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs sm:text-sm text-gray-600">Total colis</label>
                    <Input
                      value={totals.totalQty.toString()}
                      className="mt-1 text-xs sm:text-sm h-8 sm:h-10"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Buying Price */}
              <div>
                <h3 className="font-medium mb-3 text-sm sm:text-base">Buying price</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm text-gray-600">Total VAT excl</label>
                    <Input
                      value={totals.totalBuyingPrice}
                      onChange={() => { }}
                      className="mt-1 text-xs sm:text-sm h-8 sm:h-10"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-600">Margin</label>
                    <Input
                      value={`${totals.margin} €`}
                      onChange={() => { }}
                      className="mt-1 text-xs sm:text-sm h-8 sm:h-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div
          className={`
          ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          fixed lg:relative top-0 right-0 h-full lg:h-auto
          w-64 sm:w-72 lg:w-64 border-l bg-gray-50 p-3 sm:p-4
          transition-transform duration-300 ease-in-out
          z-50 lg:z-auto
          ${sidebarOpen ? "shadow-lg lg:shadow-none" : ""}
        `}
        >
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <h2 className="font-medium">Menu</h2>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="p-1">
              <X className="h-4 w-4" />
            </Button>
          </div>


          {/* Articles Selection */}
          <div className="mb-6">
            <div
              className="flex items-center gap-2 mb-3 cursor-pointer hover:text-pink-700 transition-colors"
              onClick={() => setArticlesModalOpen(true)}
            >
              <Search className="h-4 w-4 text-pink-600" />
              <span className="font-medium text-pink-600 text-sm sm:text-base">Articles selection</span>
            </div>
            {selectedArticles.length > 0 && (
              <div className="text-xs text-gray-600 ml-6">
                {selectedArticles.length} article{selectedArticles.length !== 1 ? "s" : ""} selected
              </div>
            )}
          </div>

          {/* Import Section */}
          <div className="mb-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-3">Import</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer hover:text-blue-600">
                <FileImport className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>.. since document</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer hover:text-blue-600">
                <List className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>.. order list</span>
              </div>
            </div>
          </div>

          {/* Modeles Section */}
          <div className="mb-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-3">Modeles</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer hover:text-blue-600">
                <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Open template</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer hover:text-blue-600">
                <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Save template</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer hover:text-blue-600">
                <FileEdit className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Article form</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer hover:text-blue-600">
                <Hash className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Insert Serial Number</span>
              </div>
            </div>
          </div>

          {/* Save Document */}
          <div>
            <div
              onClick={() => {
                if (selectedArticles.length === 0) {
                  setNoArticlesModalOpen(true); // show message modal
                  return
                }
                if (selectedTicket) {
                  setOpenEditPaymentModal(true);
                }
                else {
                  setOpenSaveModal(true); // show save document modal
                }
              }}
              className="flex items-center gap-2 text-xs sm:text-sm text-pink-600 cursor-pointer hover:text-pink-700">
              <Save className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Save document</span>
            </div>
          </div>
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </div>
      {noArticlesModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] text-center">
            <h2 className="text-lg font-semibold mb-2">No Articles Selected</h2>
            <p className="text-gray-600 text-sm mb-4">
              Please select at least one article before saving the document.
            </p>
            <Button
              className="bg-pink-600 hover:bg-pink-700 text-white"
              onClick={() => setNoArticlesModalOpen(false)}
            >
              OK
            </Button>
          </div>
        </div>
      )}

      {/* Articles Selection Modal */}
      <ArticlesSelectionModal
        isOpen={articlesModalOpen}
        onClose={() => setArticlesModalOpen(false)}
        onConfirm={handleArticlesSelection}
        initialSelectedArticles={selectedArticles}
      />
      <SaveDocument
        open={openSaveModal}
        setOpen={setOpenSaveModal}
        mode="create"
        selectedTab={selectedTab.id}
        selectedCustomer={selectedCustomer}
        lineItems={totals.lineItems}
        total={totals.totalVATIncl}
        docNo=""
        customer={{
          name: selectedCustomer?.nameDenomination || "",
          address: `${selectedCustomer?.billingAddress?.address || ""} ${selectedCustomer?.billingAddress?.zipCode || ""} ${selectedCustomer?.billingAddress?.city?.cityName || ""}`,
        }}

      />
      {selectedTicket && (
              <SaveDocument
        open={openEditPaymentModal}
        setOpen={setOpenEditPaymentModal}
        docNo={selectedTicket.ticketNumber}
        mode="edit"               // 👈 important
        ticket={selectedTicket}   // 👈 backend se aya hua ticket
        selectedCustomerUpdate={
          {
            name:selectedTicket?.customer?.nameDenomination,
          address: `${selectedTicket?.customer?.billingAddress?.address || ""} ${selectedTicket?.customer?.billingAddress?.zipCode || ""} `
          }
          
        }
           selectedCustomer={selectedTicket.customer}
        lineItems={totals.lineItems}
        total={totals.totalVATIncl}          
      />
      )}
 

    </div>
  )
}
