// app/actions/categories.ts
import { apiDelete, apiGet, apiPost, apiPut } from "../api";

interface Category {
  name: string;
  subCategories?: string[];
}

export const createCategory = async (category: Category) => {
  return apiPost('/categories', category);
};

export const updateCategory = async (id: string, category: Category) => {
  return apiPut(`/categories/${id}`, category);
};

export const deleteCategory = async (id: string) => {
  return apiDelete(`/categories/${id}`);
};

export const getAllCategories = async () => {
  return apiGet('/categories');
};
   

export const getCategoryById = async (id: string) => {
  return apiGet(`/categories/${id}`);
};

// export const addSubCategory = async (subCategories:string) => {
//   return apiPost(`/subcategories`,{subCategories});
// };
export const addSubCategory = async (name: string, categoryId: string) => {
  return apiPost(`/subcategories`, {
    name,
    category: categoryId,
  });
};


export const removeSubCategory = async (categoryId: string, subCategoryId: string) => {
  return apiDelete(`/categories/${categoryId}/subcategories/${subCategoryId}`);
};

 