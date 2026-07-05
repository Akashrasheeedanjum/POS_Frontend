"use client"
import { Button } from '@/components/ui/button'
import { Grid } from 'lucide-react'
 
import { useState } from "react"
import { CategoryModal } from './category/category-modal'

const ProductCategory = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    return (
        <>
              <div className="flex items-center">
            <Button variant="outline" className="ml-auto flex gap-2 rounded-r-md border-l-0 bg-white bg-background shadow-sm transition-colors  focus-visible:ring-1 focus-visible:ring-ring"
                onClick={() => setIsModalOpen(true)}
            >
                <Grid className="h-4 w-4" />
                <span>Categories</span>
            </Button>
        </div>
            <CategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    )
}

export default ProductCategory