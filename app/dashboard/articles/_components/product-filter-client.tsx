"use client"

import { useState } from "react"
import { RotateCcw, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CategoryModal } from "./category/category-modal"
import { transformSearchFieldValue } from "@/app/customers/Helper/transformSearchFieldValue"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/app/Redux/store"
import { filterArticles, setPageNumber, setQuery } from "@/app/Redux/Slices/articlesSlice"

export default function ProductFilterClient() {

    const dispatch = useDispatch<AppDispatch>();
    const pageLimit = useSelector((state: RootState) => state.article.pageLimitArticle);

    const [searchType, setSearchType] = useState("productId")
    const [searchQuery, setSearchQuery] = useState("")

    const handleSearch = () => {
        console.log(`Searching for ${searchQuery} by ${searchType}`)
        // Implement your search logic here
        if (!searchQuery?.trim() || !searchType) {
            toast.error(`${!searchType ? 'Select a filter!' : 'Provide Search value!'}`)
            return
        }

        if (searchType) {
            const value = transformSearchFieldValue(searchQuery)

            const query = { [searchType]: value?.trim() }
            console.log('query', query)
            dispatch(setQuery(query))    //setting new query in the redux so it can be fetched every where
            dispatch(setPageNumber(1));  //set page number to 1 for this new query
            dispatch(filterArticles({ search: query, limit: pageLimit, page: 1 }))
        } else {
            // if we don't have any query
            dispatch(setQuery({}))
            dispatch(setPageNumber(1));
            dispatch(filterArticles({}))
        }
    }

    const handleReset = () => {
        dispatch(setQuery({}))
        dispatch(setPageNumber(1));
        dispatch(filterArticles({}))
        setSearchType("productId")
        setSearchQuery("")
        // Additional reset logic
    }

    return (
        <>
            <div className="flex flex-col      gap-2">
                {/* <div className="flex-1"> */}
                <div className="flex flex-col ELMB:flex-row gap-2">
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value='productId'>Product ID</option>
                        <option value='designation'>Article name</option>
                        <option value='supplier'>Supplier</option>
                        <option value='refArt'>Suppliers Article Number</option>
                        <option value='createdAt'>Date</option>
                    </select>
                    <Input
                        type={searchType == 'createdAt' ? 'date' : 'text'}
                        placeholder="Search..."

                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full ELMB:w-[200px] rounded-r-md border-l-0 bg-white bg-background shadow-sm transition-colors  focus-visible:ring-1 focus-visible:ring-ring dark:placeholder-white
                                ${searchType == 'createdAt' && 'date-icon-right '}`}
                    />
                    <div className="flex items-center justify-center ELMB:justify-start">
                        <Button variant="outline" className="rounded-l-md rounded-r-none border-l-0 bg-muted/90" 
                        onClick={handleSearch}>
                            Content
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-l-none rounded-r-md bg-muted/90 px-1 " onClick={handleReset}>
                            <RotateCcw className="h-4 w-4  " />
                            <span className="sr-only">Reset</span>
                        </Button>
                    </div>

                </div>
                {/* </div> */}

            </div>

        </>
    )
}
