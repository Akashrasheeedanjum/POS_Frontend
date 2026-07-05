import { SelectedArticle } from "../../sales/data/mock-articles"

// Helper to merge duplicates by _id
export const mergeArticles = (articles: SelectedArticle[]) => {
  const map = new Map<string, SelectedArticle>()

  for (const article of articles) {
    if (map.has(article._id)) {
      const existing = map.get(article._id)!
      map.set(article._id, {
        ...existing,
        quantity: existing.quantity + article.quantity, // ✅ quantity merge
      })
    } else {
      map.set(article._id, { ...article })
    }
  }

  return Array.from(map.values())
}