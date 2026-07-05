"use client"

import { useState, useMemo, useEffect } from "react"
import { X, ChevronRight, ChevronLeft, RotateCcw, Plus, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { type Article, type SelectedArticle } from "@/app/dashboard/sales/data/mock-articles"
import { getAllArticles } from "@/lib/actions/documents.actions"
import { getActivePriceCategory } from "../Helper/activePriceCategory"
import { useSelector } from "react-redux"
import { RootState } from "@/app/Redux/store"
import { useSession } from "@clerk/nextjs"

interface ArticlesSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedArticles: SelectedArticle[]) => void
  initialSelectedArticles?: SelectedArticle[]
}

export default function ArticlesSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  initialSelectedArticles = [],
}: ArticlesSelectionModalProps) {
  const [activeTab, setActiveTab] = useState<"search" | "category">("search")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchField, setSearchField] = useState("productId")
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([])
  const [selectedArticles, setSelectedArticles] = useState<SelectedArticle[]>(initialSelectedArticles)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [duplicateArticle, setDuplicateArticle] = useState<Article | null>(null)
  // API State
  const [articles, setArticles] = useState<Article[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const selectedCustomer = useSelector((state: RootState) => state.customer.selectedCustomerForDocument);

  const { session } = useSession();
  const token: any = session?.user?.publicMetadata?.token

  // Fetch articles when modal opens or filters change
  useEffect(() => {
    if (!isOpen) return
    const fetchArticles = async () => {
      setLoading(true)
      try {
        const query = new URLSearchParams()
        if (searchTerm) query.set(searchField, searchTerm)
        query.set("page", page.toString())
        query.set("limit", limit.toString())

        const data = await getAllArticles({
          search: query.toString(),
          page,
          limit,
        },
          token
        )
        // console.log("Data From API ", data)
        setArticles(Array.isArray(data?.data) ? data.data : [])
        setTotalItems(data?.total || 0)
        setTotalPages(Math.ceil((data?.total || 0) / limit))

      } catch (err) {
        console.error("Error fetching articles:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [isOpen, searchTerm, searchField, page, limit])

  const handleArticleSelect = (articleId: string) => {
    setSelectedArticleIds((prev) =>
      prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId],
    )
  }

  const handleMoveToSelected = () => {
    const articlesToMove = articles.filter((article) => selectedArticleIds.includes(article._id))

    // Check for duplicates
    const duplicates = articlesToMove.filter((article) =>
      selectedArticles.some((selected) => selected._id === article._id),
    )

    if (duplicates.length > 0) {
      setDuplicateArticle(duplicates[0])
      setShowConfirmModal(true)
      return
    }

    const newSelectedArticles = articlesToMove.map((article) => {
      const priceCategory = getActivePriceCategory(article, selectedCustomer);
      return {

        ...article,
        quantity: 1, // Default quantity
        discount: 0, // Default discount

        unitPriceVatExcl: priceCategory.priceVatExcl, // 👈 default set
        unitPriceVatIncl: priceCategory.priceVatIncl, // 👈 default set
        isEdited: false,
      };
    });

    setSelectedArticles((prev) => [...prev, ...newSelectedArticles])
    setSelectedArticleIds([])
  }
  // console.log("newSelectedArticles", selectedArticles)
  const handleConfirmDuplicate = () => {
    if (duplicateArticle) {
      const priceCategory = getActivePriceCategory(duplicateArticle, selectedCustomer);
      const newSelectedArticle = {
        ...duplicateArticle,
        quantity: 1,
        discount: 0,
        unitPriceVatExcl: priceCategory.priceVatExcl,
        unitPriceVatIncl: priceCategory.priceVatIncl,
        isEdited: false,
      }
      setSelectedArticles((prev) => [...prev, newSelectedArticle])
    }
    setShowConfirmModal(false)
    setDuplicateArticle(null)
    setSelectedArticleIds([])
  }

  const handleMoveToAvailable = (selectedIds: string[]) => {
    setSelectedArticles((prev) => prev.filter((article) => !selectedIds.includes(article._id)))
    setSelectedArticleIds([])
  }

  const handleOk = () => {
    onConfirm(selectedArticles)
    setSelectedArticleIds([])     // ✅ fix #1
    setSelectedArticles([])       // (Optional use case)

    onClose()
  }

  const handleCancel = () => {
    setSelectedArticles(initialSelectedArticles)
    setSelectedArticleIds([])
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl h-[calc(100dvh-52px)] flex flex-col">
          <DialogHeader className="px-4 py-3 border-b bg-gray-50 h-12  border border-red-500">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-medium">Articles selection</DialogTitle>
              {/* <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button> */}
            </div>
          </DialogHeader>

          <div className="flex flex-col h-full  border border-red-500">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "search"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                onClick={() => setActiveTab("search")}
              >
                Mode de recherche
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "category"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                onClick={() => setActiveTab("category")}
              >
                Category
              </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-auto">
              {/* Left Panel - Available Articles */}
              <div className="flex-1 flex flex-col border-r overflow-y-auto">


                <div className="max-h-72 overflow-y-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="w-8 px-2 py-2"></th>
                        <th className="px-3 py-2 text-left font-medium">Product ID</th>
                        <th className="px-3 py-2 text-left font-medium">Designation</th>
                        <th className="px-3 py-2 text-left font-medium">Qty stock</th>
                        <th className="px-3 py-2 text-left font-medium">Ref art provide Supplier</th>
                        <th className="px-3 py-2 text-left font-medium">Supplier</th>
                        <th className="px-3 py-2 text-left font-medium">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((article) => (
                        <tr
                          key={article._id}
                          className={`border-b hover:bg-blue-50 cursor-pointer transition-colors ${selectedArticleIds.includes(article._id) ? "bg-blue-100" : ""
                            }`}
                          onClick={() => handleArticleSelect(article._id)}
                        >
                          <td className="px-2 py-2">
                            <input
                              type="checkbox"
                              checked={selectedArticleIds.includes(article._id)}
                              onChange={() => handleArticleSelect(article._id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-3 py-2 font-medium">{article.productId}</td>
                          <td className="px-3 py-2">{article.designation}</td>
                          <td className="px-3 py-2 text-center">{article.quantityStock}</td>
                          <td className="px-3 py-2">{article.refArt}</td>
                          <td className="px-3 py-2 text-blue-600">{article?.supplier?.nameDenomination}</td>
                          <td className="px-3 py-2 text-blue-600">{article.category?.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between p-3 border-t bg-gray-50">
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages} | Total: {totalItems}
                  </span>
                  <div>
                    <span className="text-sm text-gray-600">Limit</span>
                    <select
                      className="border rounded p-1 text-sm"
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value))
                        setPage(1) // reset to first page
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    >
                      Previous
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    >
                      Next
                    </Button>
                  </div>
                </div>

              </div>

              {/* Center - Arrow Buttons */}
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 gap-4">
                <Button
                  onClick={handleMoveToSelected}
                  disabled={selectedArticleIds.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3"
                  size="sm"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => handleMoveToAvailable(selectedArticleIds)}
                  disabled={selectedArticles.length === 0}
                  variant="outline"
                  className="p-3"
                  size="sm"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>

              {/* Right Panel - Selected Articles */}
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="font-medium text-gray-800 mb-3">Selected Articles</h3>
                </div>

                <div className="flex-1 max-h-48 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {selectedArticles.map((article) => (
                      <div
                        key={article._id}
                        className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors
      ${selectedArticleIds.includes(article._id) ? "bg-cyan-600" : "bg-cyan-500"}`}
                        onClick={() => handleArticleSelect(article._id)} // same toggle function
                      >
                        <span className="font-medium">{article.designation}</span>
                        <input
                          type="checkbox"
                          checked={selectedArticleIds.includes(article._id)}
                          onChange={() => handleArticleSelect(article._id)}
                          className="ml-2"
                        />
                      </div>
                    ))}

                    {selectedArticles.length === 0 && (
                      <div className="text-center text-gray-500 py-8">No articles selected</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Search Filter Section */}
            <div className="border-t p-4 bg-gray-50">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Search Filter</span>
                <Select value={searchField} onValueChange={setSearchField}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="productId">Product ID</SelectItem>
                    <SelectItem value="designation">Designation</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 max-w-md"
                />
                <Button variant="outline" size="sm">
                  Content
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-1" />
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button onClick={handleOk} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                <Check className="h-4 w-4 mr-1" />
                Ok
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal for Duplicates */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Duplicate Article
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              The article `{duplicateArticle?.designation}` is already selected. Are you sure you want to add it again?
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDuplicate} className="bg-blue-600 hover:bg-blue-700">
              Yes, Add Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
