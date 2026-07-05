"use client"

import { useState, useEffect } from "react"
import { ModalHeader } from "./modal-header"
import { CategorySidebar } from "./category-sidebar"
import { SelectedCategory } from "./selected-category"
import { SubCategorySection } from "./sub-category-section"
import { NewCategoryForm } from "./new-category-form"
import { PositionControls } from "./position-controls"
import { ModalFooter } from "./modal-footer"
import { addSubCategory, createCategory, deleteCategory, getAllCategories, removeSubCategory, updateCategory } from "@/lib/actions/categories.actions"
 

export type SubCategory = {
  _id: string
  name: string
  category: string
  createdAt: string
  updatedAt: string
}

export type Category = {
  _id: string
  name: string
  subCategories: SubCategory[]
  createdAt: string
  updatedAt: string
  __v: number
  visibleInPanel1?: boolean
  visibleInPanel2?: boolean
}

 

export function CategoryModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const serverCategories = await getAllCategories();

      // Add panel visibility flags locally
      const enrichedCategories = serverCategories.map((cat: any) => ({
        ...cat,
        visibleInPanel1: false,
        visibleInPanel2: false,
      }));

      setCategories(enrichedCategories);
      if (!selectedCategory && enrichedCategories.length > 0) {
        setSelectedCategory(enrichedCategories[0]);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  if (isOpen) {
    fetchCategories();
  }
}, [isOpen]);


  // const handleAddCategory = (name: string) => {
  //   if (name.trim() === "") return

  //   const newCategory: Category = {
  //     _id: Date.now().toString(),
  //     name,
  //     subCategories: [],
  //     visibleInPanel1: false,
  //     visibleInPanel2: false,
  //   }

  //   setCategories([...categories, newCategory])
  // }

  const handleAddCategory = async (name: string) => {
  if (name.trim() === "") return;

  try {
    const newCat = await createCategory({ name });
    setCategories([...categories, { ...newCat, subCategories: [], visibleInPanel1: false, visibleInPanel2: false }]);
  } catch (err) {
    console.error("Add category failed:", err);
  }
};

  // const handleDeleteCategory = () => {
  //   if (!selectedCategory) return

  //   const updatedCategories = categories.filter((c) => c.id !== selectedCategory.id)
  //   setCategories(updatedCategories)
  //   setSelectedCategory(updatedCategories.length > 0 ? updatedCategories[0] : null)
  // }
  const handleDeleteCategory = async () => {
  if (!selectedCategory) return;

  try {
    await deleteCategory(selectedCategory._id);
    const updated = categories.filter(c => c._id !== selectedCategory._id);
    setCategories(updated);
    setSelectedCategory(updated.length ? updated[0] : null);
  } catch (err) {
    console.error("Delete category failed:", err);
  }
};

// ✅ Your delete function
const handleDeleteSubCategory = async (subCategoryId: string) => {
  if (!selectedCategory || !subCategoryId) {
    console.error("Missing category or subCategoryId");
    return;
  }

  try {
    console.log(
      `Trying to delete: /categories/${selectedCategory._id}/subcategories/${subCategoryId}`
    );

    await removeSubCategory(selectedCategory._id, subCategoryId);

    const updatedSubCategories = selectedCategory.subCategories.filter(
      (sc) => sc._id !== subCategoryId
    );

    const updatedCategories = categories.map((cat) =>
      cat._id === selectedCategory._id
        ? { ...cat, subCategories: updatedSubCategories }
        : cat
    );

    setCategories(updatedCategories);
    setSelectedCategory({
      ...selectedCategory,
      subCategories: updatedSubCategories,
    });

    console.log("✅ Subcategory deleted successfully!");
  } catch (error) {
    console.error("❌ Delete subcategory failed:", error);
  }
};
;



  // const handleRenameCategory = (newName: string) => {
  //   if (!selectedCategory || newName.trim() === "") return

  //   const updatedCategories = categories.map((c) => (c.id === selectedCategory.id ? { ...c, name: newName } : c))

  //   setCategories(updatedCategories)
  //   setSelectedCategory({ ...selectedCategory, name: newName })
  // }

  const handleRenameCategory = async (newName: string) => {
  if (!selectedCategory || newName.trim() === "") return;

  try {
    await updateCategory(selectedCategory._id, { name: newName });
    const updated = categories.map((c) =>
      c._id === selectedCategory._id ? { ...c, name: newName } : c
    );
    setCategories(updated);
    setSelectedCategory({ ...selectedCategory, name: newName });
  } catch (err) {
    console.error("Rename category failed:", err);
  }
};

  // const handleAddSubCategory = (name: string) => {
  //   if (!selectedCategory || name.trim() === "") return

  //   const newSubCategory: SubCategory = {
  //     id: Date.now().toString(),
  //     name,
  //   }

  //   const updatedCategories = categories.map((c) =>
  //     c.id === selectedCategory.id ? { ...c, subCategories: [...c.subCategories, newSubCategory] } : c,
  //   )

  //   setCategories(updatedCategories)
  //   setSelectedCategory({
  //     ...selectedCategory,
  //     subCategories: [...selectedCategory.subCategories, newSubCategory],
  //   })
  // }


//   const handleAddSubCategory = async (name: string) => {
//   if (!selectedCategory || name.trim() === "") return;

//   try {
//     const newSub = await addSubCategory(selectedCategory._id, name); // change your API to accept name
//     console.log("addSubCategory is here",addSubCategory)
//     const updated = categories.map((cat) =>
//       cat._id === selectedCategory._id
//         ? { ...cat, subCategories: [...cat.subCategories, newSub] }
//         : cat
//     );
//     setCategories(updated);
//     setSelectedCategory({ ...selectedCategory, subCategories: [...selectedCategory.subCategories, newSub] });
//   } catch (err) {
//     console.error("Add subcategory failed:", err);
//   }
// };
const handleAddSubCategory = async (name: string) => {
  if (!selectedCategory || name.trim() === "") return;

  try {
    // 1. Call API with name and category ID
    const newSub = await addSubCategory(name, selectedCategory._id);

    // 2. Update the local category state (adds new subcategory object)
    const updatedCategories = categories.map((cat) =>
      cat._id === selectedCategory._id
        ? {
            ...cat,
            subCategories: [...cat.subCategories, newSub], // newSub is full object
          }
        : cat
    );

    // 3. Update full categories list
    setCategories(updatedCategories);

    // 4. Update currently selected category
    setSelectedCategory({
      ...selectedCategory,
      subCategories: [...selectedCategory.subCategories, newSub],
    });
  } catch (err) {
    console.error("Add subcategory failed:", err);
  }
};


  // const handleDeleteSubCategory = (subCategoryId: string) => {
  //   if (!selectedCategory) return

  //   const updatedSubCategories = selectedCategory.subCategories.filter((sc) => sc.id !== subCategoryId)

  //   const updatedCategories = categories.map((c) =>
  //     c.id === selectedCategory.id ? { ...c, subCategories: updatedSubCategories } : c,
  //   )

  //   setCategories(updatedCategories)
  //   setSelectedCategory({
  //     ...selectedCategory,
  //     subCategories: updatedSubCategories,
  //   })
  // }

 

 

  // const handleMoveCategory = (direction: "up" | "down") => {
  //   if (!selectedCategory) return

  //   const currentIndex = categories.findIndex((c) => c._id === selectedCategory._id)
  //   if (
  //     (direction === "up" && currentIndex === 0) ||
  //     (direction === "down" && currentIndex === categories.length - 1)
  //   ) {
  //     return
  //   }

  //   const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
  //   const updatedCategories = [...categories]
  //   const [movedCategory] = updatedCategories.splice(currentIndex, 1)
  //   updatedCategories.splice(newIndex, 0, movedCategory)

  //   setCategories(updatedCategories)
  // }
  const handleMoveCategory = (direction: "up" | "down") => {
  if (!selectedCategory) return;

  const index = categories.findIndex((c) => c._id === selectedCategory._id);
  const newIndex = direction === "up" ? index - 1 : index + 1;

  if (newIndex < 0 || newIndex >= categories.length) return;

  const updated = [...categories];
  const [moved] = updated.splice(index, 1);
  updated.splice(newIndex, 0, moved);

  setCategories(updated);
};


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6 md:p-8 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <ModalHeader onClose={onClose} />

        {/* Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Left Column */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Selected Category */}
                  <SelectedCategory
                    selectedCategory={selectedCategory}
                    onRename={handleRenameCategory}
                    onDelete={handleDeleteCategory}
                  />

                  {/* Sub-category */}
                  <SubCategorySection
                    selectedCategory={selectedCategory}
                    onAddSubCategory={handleAddSubCategory}
                    onDeleteSubCategory={handleDeleteSubCategory}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-4 sm:space-y-6">
               

                  {/* New Category */}
                  <NewCategoryForm onAddCategory={handleAddCategory} />

                  {/* Position Controls */}
                  <PositionControls
                    selectedCategory={selectedCategory}
                    categories={categories}
                    onMoveCategory={handleMoveCategory}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <ModalFooter onClose={onClose} />
          </div>
        </div>
      </div>
    </div>
  )
}
