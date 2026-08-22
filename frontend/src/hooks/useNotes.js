import { useCallback, useEffect, useState } from 'react'
import { notesApi } from '@/api/notesApi'
import { httpError } from '@/api/client'
import { useDebounce } from './useDebounce'

// Fetch notes with filters + page-number pagination.
// Filters are intentionally driven from the URL by the pages themselves, so the
// hook stays a dumb data fetcher.
export function useNotes({ search = '', status, category, tags, isFavorite, isArchived } = {}) {
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const debouncedSearch = useDebounce(search, 250)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const params = {
      page,
      search: debouncedSearch || undefined,
      status: status || undefined,
      category: category || undefined,
      tags: tags || undefined,
      is_favorite: isFavorite,
      is_archived: isArchived,
    }

    notesApi
      .list(params)
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch((err) => {
        if (!cancelled) setError(httpError(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [page, reloadKey, debouncedSearch, status, category, tags, isFavorite, isArchived])

  const refetch = useCallback(() => {
    setReloadKey((k) => k + 1)
  }, [])

  const setResults = useCallback((updater) => {
    setData((current) => {
      if (!current) return current
      return { ...current, results: updater(current.results) }
    })
  }, [])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, status, category, tags, isFavorite, isArchived])

  return { data, loading, error, page, setPage, refetch, setResults }
}

export function pageFromUrl(url) {
  if (!url) return null
  const match = url.match(/[?&]page=(\d+)/)
  return match ? Number(match[1]) : null
}