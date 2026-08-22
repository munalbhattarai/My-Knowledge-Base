import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export function useEntities() {
  const rawCategories = useSelector((state) => state.entities?.categories)
  const rawTags = useSelector((state) => state.entities?.tags)

  const categories = useMemo(() => (Array.isArray(rawCategories) ? rawCategories : []), [rawCategories])
  const tags = useMemo(() => (Array.isArray(rawTags) ? rawTags : []), [rawTags])

  return useMemo(() => {
    const categoryById = new Map(categories.map((c) => [Number(c?.id), c]))
    const tagById = new Map(tags.map((t) => [Number(t?.id), t]))
    return { categories, tags, categoryById, tagById }
  }, [categories, tags])
}

export function useCategoryName(val) {
  const { categoryById } = useEntities()
  if (!val) return null
  if (typeof val === 'object' && val !== null) return val.name || null
  return categoryById.get(Number(val))?.name || null
}

export function useTagNames(tagsOrIds = []) {
  const { tagById } = useEntities()
  return useMemo(
    () =>
      (Array.isArray(tagsOrIds) ? tagsOrIds : [])
        .map((t) => (typeof t === 'object' && t !== null ? t.name : tagById.get(Number(t))?.name))
        .filter(Boolean),
    [tagsOrIds, tagById],
  )
}