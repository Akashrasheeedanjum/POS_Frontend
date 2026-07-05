"use client"

import { useEffect, useState } from "react"
import { Calendar, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { filterSalesAnalisis, setPageNumber, setQuery } from "@/app/Redux/Slices/folder/salesanalisisSlice"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/app/Redux/store"
import { setSelectedArticle } from '@/app/Redux/Slices/folder/salesanalisisSlice';
import { setIsAddNewUser } from '@/app/Redux/Slices/articlesSlice';
import ArticleModal from '@/app/dashboard/sales/_components/cart/ArticleModal';
import { selectArticleForCart } from '@/app/Redux/Slices/salesSlice';
const SearchFilters = ({ employees }: { employees: any[] }) => {
    const dispatch = useDispatch<AppDispatch>();
    const pageLimit = useSelector((state: RootState) => state.salesanalisis.pageLimitReceipts);
    const [date, setDate] = useState<Date>()
    const [viewMode, setViewMode] = useState<"date" | "month">("date")
    const [employee, setEmployee] = useState("All")
const [selectedArticleName, setSelectedArticleName] = useState('');
// const selectedArticle = useSelector((state: RootState) => state.salesanalisis.selectedArticle);
const selectedProductForCart = useSelector((state: RootState) => state.sales.selectedProductForCart);
  const isAddNewUser = useSelector(
    (state: RootState) => state.article.isAddNewUser
  );
    const handleDateIconClick = () => {
        const today = new Date()
        setDate(today)
        setViewMode("date")
    }

    const handleMonthIconClick = () => {
        setViewMode("month")
        if (!date) {
            setDate(new Date())
        }
    }

    const formatDisplayValue = () => {
        if (!date) return ""

        if (viewMode === "month") {
            return format(date, "MMM yyyy")
        }
        return format(date, "d/MM/yyyy")
    }

    const handleMonthSelect = (month: string, year: number) => {
        const monthIndex = new Date(Date.parse(month + " 1, 2000")).getMonth()
        const newDate = new Date(year, monthIndex, 1)
        setDate(newDate)
    }
// const handleArticleSelect = () => {
//     if (selectedArticle) {
//         console.log("selectedArticle  in sales ananlysisi", selectedArticle);
//         setSelectedArticleName(selectedArticle.designation || selectedArticle.productId || '');
//         // Update query to include article filter
//         const query: any = {};
        
//         if (date && viewMode === "date") {
//             const day = String(date.getDate()).padStart(2, '0');
//             const month = String(date.getMonth() + 1).padStart(2, '0');
//             const year = date.getFullYear();
//             query.completedAt = `${day}/${month}/${year}`;
//         }
//         if (date && viewMode === "month") {
//             const monthValue = String(date.getMonth() + 1).padStart(2, "0");
//             query.period = `${date.getFullYear()}-${monthValue}`;
//         }
//         console.log("selectedArticle.productId", selectedArticle.productId);
//         // Add article filter
//         console.log("query", query);
//       query.article_productId = selectedArticle.productId;
        
//         if(employee && employee !== "All"){
//             query.employee = employee;
//         }
        
//         dispatch(setQuery(query));
//         dispatch(setPageNumber(1));
//         dispatch(filterSalesAnalisis({ query, limit: pageLimit, page: 1 }));
//     }
// };
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)
 
    // 🔹 Apply Filters on change
    useEffect(() => {
        const query: any = {};

        if (date && viewMode === "date") {
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            query.completedAt = `${day}/${month}/${year}`;
        }
        if (date && viewMode === "month") {
            const monthValue = String(date.getMonth() + 1).padStart(2, "0");
            query.period = `${date.getFullYear()}-${monthValue}`; // YYYY-MM
        }

        if (employee && employee !== "All") {
            query.employee = employee;
        }
        dispatch(setQuery(query));
        dispatch(setPageNumber(1));
        dispatch(filterSalesAnalisis({ query, limit: pageLimit, page: 1 }));
    }, [date, viewMode, employee]);
// useEffect(() => {
//     if (selectedProductForCart && isAddNewUser) {
//         console.log("Article selected via salesSlice:", selectedProductForCart);
        
//         // Your filtering logic here
//         setSelectedArticleName(selectedProductForCart.designation || selectedProductForCart.productId || '');
        
//         const query: any = {
//             article_productId: selectedProductForCart.productId,
//         };
        
//         // Add date filters if needed...
//           if (date && viewMode === "date") {
//             const day = String(date.getDate()).padStart(2, '0');
//             const month = String(date.getMonth() + 1).padStart(2, '0');
//             const year = date.getFullYear();
//             query.completedAt = `${day}/${month}/${year}`;
//         }
//         if (date && viewMode === "month") {
//             const monthValue = String(date.getMonth() + 1).padStart(2, "0");
//             query.period = `${date.getFullYear()}-${monthValue}`;
//         }
//         dispatch(setQuery(query));
//         dispatch(setPageNumber(1));
//         dispatch(filterSalesAnalisis({ query, limit: pageLimit, page: 1 }));
        
//         // Close modal
//         dispatch(setIsAddNewUser(false));
        
//         // Clear the selection to prevent re-triggering
//         dispatch(selectArticleForCart({ userData: null }));
//     }
// }, [selectedProductForCart, isAddNewUser]);
    return (
        <div>
            <div className=" w-full  mx-auto">
                <div className=" flex gap-2 p-2 items-center  bg-white rounded-lg shadow-sm border">
                    <div className="flex items-center gap-8 ">
                        {/* Date Section */}
                        <div className="flex justify-center items-center gap-3  ">
                            <div className="  mt-4 items-end">

                                <div className="flex  gap-1 ">
                                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={handleDateIconClick}>
                                        <Calendar className="h-4 w-4 text-gray-600" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={handleMonthIconClick}>
                                        <CalendarDays className="h-4 w-4 text-gray-600" />
                                    </Button>
                                </div>
                            </div>

                            <Popover >
                                <div className="flex flex-col items-center">
                                    <Label className="text-sm font-medium text-gray-700">Period</Label>
                                    <PopoverTrigger asChild>

                                        <Button
                                            variant="outline"
                                            className={cn("w-32 justify-between text-left font-normal", !date && "text-muted-foreground")}
                                        >
                                            {formatDisplayValue() || "Select date"}
                                            <svg className="ml-2 h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </Button>
                                    </PopoverTrigger>
                                </div>
                                <PopoverContent className="w-auto p-0" align="start">
                                    {viewMode === "date" ? (
                                        <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                                    ) : (
                                        <div className="p-4 space-y-4">
                                            <div className="text-sm font-medium text-center mb-3">Select Month & Year</div>
                                            <div className="grid grid-cols-3 gap-2">
                                                {months.map((month) => (
                                                    <Button
                                                        key={month}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-xs h-8"
                                                        onClick={() => handleMonthSelect(month, date?.getFullYear() || currentYear)}
                                                    >
                                                        {month.slice(0, 3)}
                                                    </Button>
                                                ))}
                                            </div>
                                            <Select
                                                value={date?.getFullYear().toString() || currentYear.toString()}
                                                onValueChange={(year) => {
                                                    const currentMonth = date?.getMonth() || 0
                                                    const newDate = new Date(Number.parseInt(year), currentMonth, 1)
                                                    setDate(newDate)
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {years.map((year) => (
                                                        <SelectItem key={year} value={year.toString()}>
                                                            {year}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Employee Section */}
                        <div className="flex flex-col items-center ">
                            <Label className="text-sm font-medium text-gray-700">Employee</Label>
                            <Select value={employee} onValueChange={setEmployee}>
                                <SelectTrigger className="w-24">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    {employees?.map((emp: any) => (
                                        <SelectItem className='capitalize' key={emp._id} value={emp._id}>{emp.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-2 gap-3  ">
                        {/* Left Column */}
                        <div className="space-y-8">
                            {/* Article Section */}
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="text-xs px-2  bg-transparent"
                                    onClick={() => dispatch(setIsAddNewUser(true))}
                                    >
                                        Article
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-xs px-3 py-1 bg-transparent">
                                        Category
                                    </Button>
                                </div>
                                <Input placeholder="Enter article details" className="w-full h-8" 
                                value={selectedArticleName}
                                readOnly
                                
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Customer/Provider Section */}
                            <div className="space-y-2">
                                <div className="flex gap-2 ">
                                    <Button variant="outline" size="sm" className="text-xs px-3 py-1 bg-transparent">
                                        Customer
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-xs px-3 py-1 bg-transparent">
                                        Provider
                                    </Button>
                                </div>
                                <Input placeholder="Enter customer/provider details" className="w-full h-8" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
<ArticleModal
    open={isAddNewUser}
    mode="add"
    onClose={() => dispatch(setIsAddNewUser(false))}
    onArticleSelect={(article) => {
        console.log("Article selected:", article);
        setSelectedArticleName(article.designation || article.productId || '');
        
        const query: any = {
            articleId: article._id,
        };
        
        // Add date filters if needed
        if (date && viewMode === "date") {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            query.completedAt = `${day}/${month}/${year}`;
        }
        if (date && viewMode === "month") {
            const monthValue = String(date.getMonth() + 1).padStart(2, "0");
            query.period = `${date.getFullYear()}-${monthValue}`;
        }
        
        if(employee && employee !== "All"){
            query.employee = employee;
        }
        
        console.log("Final query:", query);
        dispatch(setQuery(query));
        dispatch(setPageNumber(1));
        dispatch(filterSalesAnalisis({ query, limit: pageLimit, page: 1 }));
          dispatch(selectArticleForCart({ userData: null }));
           dispatch(setIsAddNewUser(false));
    }}
    preserveExistingBehavior={false}
/>
        </div>
    )
}

export default SearchFilters