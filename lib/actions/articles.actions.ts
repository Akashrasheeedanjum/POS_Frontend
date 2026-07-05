import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "../api";
import { compressImageTo500KB } from "../Helper/compressImage";

export interface SubCategory {
    _id: string;
    name: string;
    category: Category;
    __v: number;
    updatedAt?: string;
    createdAt?: string;
}
export interface Category {
    _id: string;
    name: string;
    subCategories: SubCategory[];
    __v: number;
    updatedAt?: string;
    createdAt?: string;
}

export interface VatRate {
    _id: string;
    code: string;
    rate: number;
    isActive: boolean;
    __v: number;
    updatedAt?: string;
    createdAt?: string;
}
export interface priceCategory {
        
       vatCode?: string 
        vatId?: string
        vatRate?: number
        priceVatExcl: number
        priceVatIncl: number
        minPrice: string
        // purchasePrice: number
        grossProfitMargin: number
        __v?: number;
        updatedAt?: string;
        createdAt?: string;
    
}


// {
//     "productId": "66666",
//     "designation": "u-mobile",
//     "category": "683daffbabbf826633fa2c6f",
//     "subCategory": "",
//     "qtyStock": "50",
//     "qtyMin": "3",
//     "supplier": "Awais",
//     "refArt": "awwa",
//     "purchasePrice": "200",
//     "pmp": "200",
//     "manageStock": true,
//     "remarks": "okay",
//     "imageUrl": null,
//     "priceCategories": {
//         "4": {
//             "vatCode": "VAT1",
//             "vatRate": 0,
//             "priceVatExcl": 200,
//             "priceVatIncl": 200,
//             "minPrice": "200",
//             "grossProfitMargin": 0,
//             "purchasePrice": "200"
//         }
//     }
// }
export interface Article {
    _id?: string;
    productId?: string;
    designation?: string;
    quantityStock?: number;
    quantityMinimum?: number;
    supplier?: any;
    refArt?: string;
    // vatCode: VatRate;
    // priceVatExcluded: string;
    // minimumPrice: number;
    purchasePrice?: number;
    pmp?: number;
    remarks?: string;
    image?: string | null;
    lastSale?: Date;
    category?: Category | string;
    subCategory?: SubCategory | string;
    manageStock?: boolean;
    // pricecategories: priceCategories[];
    priceCategory1?:priceCategory | undefined
    priceCategory2?:priceCategory | undefined
    priceCategory3?:priceCategory | undefined
    priceCategory4?:priceCategory | undefined
    __v?: number;
    updatedAt?: string;
    createdAt?: string;
}


// export const createArticles = async (articleData: Omit<Article,'_id'>) => {
//     return apiPost('/articles', articleData);
// };

  async function handleImageUpload(file:any) {
    const CLOUDINARY_CLOUD_NAME = String(process.env.NEXT_PUBLIC_CLOUD_NAME); 
    const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUD_PRESET; // <-- Replace with your unsigned preset name


  try {
    // const compressedFile = await imageCompression(file, options);
    const compressedFile = await compressImageTo500KB(file, 500, 1280, 720);    
    const formData = new FormData();
    formData.append('file', compressedFile);
    formData.append('upload_preset', String(CLOUDINARY_UPLOAD_PRESET));
    formData.append('folder', 'articles');

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      return data
  } catch (error) {
    console.error('Image compression failed:', error);
  }
}

export const createArticles = async (articleData: Omit<Article, '_id'>, file: File, token?: string) => {

  if (file) {
    const uploaded:any = await handleImageUpload(file)
    articleData.image = uploaded?.secure_url
  }

return apiPost('/articles', articleData,token)
};



export const uploadImage = async (file: File, token?:string) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/articles/upload-image', {
    method: 'POST',
    body: formData,
    headers:{
      Authorization: `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  return await response.json();
  

};


export const updateArticles = async (_id: string, data: Omit<Article, '_id'>, file: File, token?: string) => {
  if(file){
    const uploaded:any = await handleImageUpload(file)
    data.image = uploaded?.secure_url

  }
  return apiPatch(`/articles/${_id}`, data, token);
};


export const updateStock = async (_id: string, newStockQuantity: number, token?: string) => {
console.log('newStockQuantity', newStockQuantity)
console.log('token', token)
  return apiPatch(`/articles/updateArticleStock/${_id}`, {newStockQuantity}, token);
};

export const deleteArticles = async (id: string | undefined, token?: string) => {
    return apiDelete(`/articles/${id}`, token);
};
export const getArticleById = async (id: string | undefined, token?: string) => {
    return apiGet(`/articles/${id}`, token);
};

export const getAllArticles = async ({
    search = '',
    page = 1,
    limit = 5
}: {
    search?: string;
    page?: number;
    limit?: number;
},
token?: string
) => {
    const params = new URLSearchParams();

    // Append parsed query string params to the main params
    if (search) {
        const queryParams = new URLSearchParams(search);
        queryParams.forEach((value, key) => {
            params.set(key, value);
        });
    }

    params.set('page', page.toString());
    params.set('limit', limit.toString());

    return apiGet(`/articles?${params.toString()}`, token);
};

export async function uploadArticleImage(articleId: string, imageFile: File) {
  try {
    const formData = new FormData();
    formData.append('file', imageFile); // 👈 field name 'file' backend route ke mutabiq

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/${articleId}/upload-image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data; // This will likely include { imageUrl: "..." } or similar
  } catch (error: any) {
    console.error("Upload image error:", error);
    throw error;
  }
}




// export const getSuppliersCount = async () => {
//     return apiGet(`/suppliers/totalSuppliersCount`);
// };
