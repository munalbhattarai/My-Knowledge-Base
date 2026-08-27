import { lazy, Suspense, useEffect, useRef } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'
import { Toaster } from '@/components/common/Toaster'
import { Spinner } from '@/components/common/Spinner'
import { bootstrap, loadProfile } from '@/store/slices/authSlice'
import { loadEntities } from '@/store/slices/entitiesSlice'

const AuthPage = lazy(() => import('@/pages/auth/AuthPage'))
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const NotesPage = lazy(() =>
  import('@/pages/notes/NotesPage').then((m) => ({ default: m.NotesPage })),
)
const NoteEditorPage = lazy(() => import('@/pages/notes/NoteEditorPage'))
const NoteDetailPage = lazy(() => import('@/pages/notes/NoteDetailPage'))
const CategoryRouteBase = lazy(() =>
  import('@/pages/notes/CollectionPages').then((m) => ({ default: m.CategoryNotesPage })),
)
const TagRouteBase = lazy(() =>
  import('@/pages/notes/CollectionPages').then((m) => ({ default: m.TagNotesPage })),
)
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))

function RootRedirect() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  return <Navigate to={isAuthenticated ? '/app' : '/login'} replace />
}

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner size={22} />
    </div>
  )
}

const withSuspense = (Component) =>
  function Suspended(props) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Component {...props} />
      </Suspense>
    )
  }

const AuthRoute = withSuspense(AuthPage)
const DashboardRoute = withSuspense(DashboardPage)
const NotesRoute = withSuspense(NotesPage)
const EditorRoute = withSuspense(NoteEditorPage)
const DetailRoute = withSuspense(NoteDetailPage)
const CategoryRoute = withSuspense(CategoryRouteBase)
const TagRoute = withSuspense(TagRouteBase)
const SettingsRoute = withSuspense(SettingsPage)

const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  { path: '/login', element: <AuthRoute initialMode="login" /> },
  { path: '/register', element: <AuthRoute initialMode="register" /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/app',
        element: <AppShell />,
        children: [
          { index: true, element: <DashboardRoute /> },
          { path: 'notes', element: <NotesRoute /> },
          { path: 'notes/new', element: <EditorRoute /> },
          { path: 'notes/:id', element: <DetailRoute /> },
          { path: 'notes/:id/edit', element: <EditorRoute /> },
          {
            path: 'favorites',
            element: (
              <NotesRoute
                title="Favorites"
                fixedFilters={{ isFavorite: true }}
                emptyTitle="No favorites yet"
                emptyDescription="Star notes to pin them here."
              />
            ),
          },
          {
            path: 'review',
            element: (
              <NotesRoute
                title="Review"
                fixedFilters={{ status: 'REVIEW' }}
                emptyTitle="Nothing to review"
                emptyDescription="Notes flagged for a second pass appear here."
              />
            ),
          },
          {
            path: 'archived',
            element: (
              <NotesRoute
                title="Archived"
                fixedFilters={{ isArchived: true }}
                emptyTitle="Nothing archived"
                emptyDescription="Archived notes are tucked away here — still searchable."
              />
            ),
          },
          { path: 'category/:id', element: <CategoryRoute /> },
          { path: 'tag/:id', element: <TagRoute /> },
          { path: 'settings', element: <SettingsRoute /> },
          { path: 'profile', element: <SettingsRoute /> },
          { path: '*', element: <Navigate to="/app" replace /> },
        ],
      },
    ],
  },
])

function AppRoutes() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const user = useSelector((state) => state.auth.user)
  const entities = useSelector((state) => state.entities)
  const profileDispatched = useRef(false)
  const entitiesDispatched = useRef(false)

  useEffect(() => {
    dispatch(bootstrap()).catch(() => {})
  }, [dispatch])

  useEffect(() => {
    if (!isAuthenticated) return
    if (!user && !profileDispatched.current) {
      profileDispatched.current = true
      dispatch(loadProfile()).catch(() => {})
    }
    if (!entities.loaded && !entities.loading && !entitiesDispatched.current) {
      entitiesDispatched.current = true
      const timer = setTimeout(
        () => {
          dispatch(loadEntities()).catch(() => {})
        },
        entities.failed ? 3000 : 0,
      )
      return () => clearTimeout(timer)
    }
  }, [dispatch, isAuthenticated, user, entities.loaded, entities.loading, entities.failed])

  useEffect(() => {
    if (!isAuthenticated) {
      profileDispatched.current = false
      entitiesDispatched.current = false
    }
  }, [isAuthenticated])

  return <RouterProvider router={router} />
}

export default function App() {
  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  )
}