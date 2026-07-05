"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Trash2, ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  imageUrl: string | null | Blob
  onUpload: (previewUrl: string, file: File) => void // ⬅️ also send the file
  onDelete: () => void
}


export function ImageUpload({ imageUrl, onUpload, onDelete }: ImageUploadProps) {
  // console.log("ON Image Uploaded",onUpload)
  const [isHovering, setIsHovering] = useState(false)

  // This would be replaced with actual file upload logic in a real application
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (file) {
    const localUrl = URL.createObjectURL(file)
    onUpload(localUrl, file) // ⬅️ pass both preview and file
  }
}


  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="text-center">
        <div
          className="relative w-full h-48 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4 overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {imageUrl ? (
            <>
              {/* <img
                src={imageUrl || "/placeholder.svg"}
                alt="Product thumbnail"
                className="w-full h-full object-contain"
              /> */}
              <Image
              src={String(imageUrl) || "/placeholder.svg"}
              alt="Product thumbnail"
              width={500} // required
              height={500} // required
              className="w-full h-full object-contain"
              />
              {isHovering && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Button type="button" variant="destructive" size="sm" onClick={onDelete} className="mr-2">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                  <label>
                    <Button type="button" variant="secondary" size="sm" className="cursor-pointer" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-1" />
                        Change
                      </span>
                    </Button>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
              <ImageIcon className="h-12 w-12 mb-2" />
              <span className="block text-sm mb-2">Product Image</span>
              <label>
                <Button type="button" variant="outline" size="sm" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-1" />
                    Upload Image
                  </span>
                </Button>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
