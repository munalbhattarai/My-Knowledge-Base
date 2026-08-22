// ---------------------------------------------------------------------------
// Mock seed data.
//
// This module exists so the UI can be designed and previewed with realistic
// content before the Django API is wired up. The API layer (src/api/*) decides
// whether to serve this data or hit the real backend via `USE_MOCK` in
// src/api/client.js.
//
// Shape mirrors the documented Django REST endpoints. When USE_MOCK is false,
// the UI is driven entirely by the real API and this file is never imported.
// ---------------------------------------------------------------------------

const DAY = 24 * 60 * 60 * 1000
const daysAgo = (n, hourOffset = 0) => new Date(Date.now() - n * DAY - hourOffset * 3600 * 1000).toISOString()

export const categories = [
  { id: 1, name: 'Python' },
  { id: 2, name: 'Django' },
  { id: 3, name: 'React' },
  { id: 4, name: 'JavaScript' },
  { id: 5, name: 'TypeScript' },
  { id: 6, name: 'SQL' },
  { id: 7, name: 'DevOps' },
  { id: 8, name: 'CSS' },
]

export const tags = [
  { id: 1, name: 'DRF' },
  { id: 2, name: 'JWT' },
  { id: 3, name: 'Security' },
  { id: 4, name: 'ORM' },
  { id: 5, name: 'Hooks' },
  { id: 6, name: 'Performance' },
  { id: 7, name: 'Redux' },
  { id: 8, name: 'Async' },
  { id: 9, name: 'Testing' },
  { id: 10, name: 'PostgreSQL' },
  { id: 11, name: 'Docker' },
  { id: 12, name: 'State' },
  { id: 13, name: 'CSS' },
  { id: 14, name: 'Git' },
  { id: 15, name: 'Vim' },
  { id: 16, name: 'Python' },
]

export const notes = [
  {
    id: 1,
    title: 'JWT authentication in Django REST Framework',
    owner: 1,
    category: 2,
    tags: [1, 2, 3],
    status: 'LEARNING',
    is_archived: false,
    is_favorite: true,
    created_at: daysAgo(21),
    updated_at: daysAgo(0, 2),
    content: `# JWT authentication in DRF

Token-based auth for a SPA where the frontend stores tokens and attaches an \`Authorization: Bearer <access>\` header.

## Why JWT over sessions

- Stateless — the server never stores session state.
- The **access token** is short-lived; the **refresh token** is long-lived and used only to mint new access tokens.
- Works cleanly for mobile and desktop clients, not just browsers.

## Setup

\`\`\`python
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}
\`\`\`

Three endpoints matter:

| Endpoint | Purpose |
| --- | --- |
| \`/api/accounts/login/\` | POST username + password → \`{refresh, access}\` |
| \`/api/accounts/refresh/\` | POST refresh → new \`access\` |
| \`/api/accounts/register/\` | POST username, email, password → creates user |

## The refresh dance

The frontend **must never** send the refresh token on every request. It is only
exchanged when the access token expires (HTTP 401).

> Do not put the access token in localStorage if you can avoid it — a memory-based
> store is safer against XSS, at the cost of losing the session on reload.

## Gotchas

- Keep \`ACCESS_TOKEN_LIFETIME\` short (30 min feels right) so a stolen token expires quickly.
- \`REFRESH_TOKEN_LIFETIME\` ~ 7 days. Revoking refresh tokens server-side requires extra bookkeeping.
- The axios interceptor should be *single-flight* — don't fire 10 refresh calls when 10 requests 401 at once.`,
    resources: [
      {
        id: 101,
        title: 'Simple JWT — official docs',
        url: 'https://django-rest-framework-simplejwt.readthedocs.io/',
        resource_type: 'DOCUMENTATION',
        description: 'Installation, settings and the full endpoint reference.',
      },
      {
        id: 102,
        title: 'Stop using JWT for sessions (good counter-argument)',
        url: 'https://supertokens.io/blog/why-you-should-stop-using-jwt-as-sessions',
        resource_type: 'ARTICLE',
        description: 'A solid opposing view — worth reading before committing.',
      },
      {
        id: 103,
        title: 'Using JWT with Django REST Framework',
        url: 'https://www.django-rest-framework.org/api-guide/authentication/',
        resource_type: 'DOCUMENTATION',
        description: 'DRF docs on the authentication backends.',
      },
    ],
    code_snippets: [
      {
        id: 201,
        title: 'Axios refresh interceptor (single-flight)',
        language: 'JAVASCRIPT',
        code: `let refreshing = null

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }
    original._retry = true
    refreshing = refreshing || refreshTokens()
    const { access } = await refreshing
    refreshing = null
    original.headers.Authorization = \`Bearer \${access}\`
    return api(original)
  },
)`,
      },
      {
        id: 202,
        title: 'curl the whole flow',
        language: 'BASH',
        code: `curl -X POST /api/accounts/login/ \\
  -H "Content-Type: application/json" \\
  -d '{"username": "dev", "password": "hunter2"}'

# returns { "refresh": "...", "access": "..." }

curl /api/notes/ \\
  -H "Authorization: Bearer <access>"`,
      },
    ],
  },
  {
    id: 2,
    title: 'The Django ORM queries I reach for every day',
    owner: 1,
    category: 2,
    tags: [4, 10],
    status: 'LEARNED',
    is_archived: false,
    is_favorite: false,
    created_at: daysAgo(60),
    updated_at: daysAgo(6),
    content: `# Django ORM — the everyday set

A mental model: the ORM is *lazy*. Nothing hits the database until the queryset
is evaluated (iteration, \`list()\`, \`.count()\`, slicing).

## Selecting related data

- \`select_related\` — one query for FK joins (the "select * from a join b" case).
- \`prefetch_related\` — separate queries, then Python-side joining (reverse FK / M2M).

\`\`\`python
# detail view
note = Note.objects.select_related("category").prefetch_related(
    "tags", "resources", "code_snippets"
).get(pk=pk, owner=request.user)
\`\`\`

## Aggregation

\`\`\`python
from django.db.models import Count

# tags ranked by how many notes reference them
Tag.objects.annotate(n=Count("notes")).order_by("-n")
\`\`\`

## The filterset pattern

django-filter keeps the view dead simple:

\`\`\`python
class NoteFilter(django_filters.FilterSet):
    class Meta:
        model = Note
        fields = ["category", "tags", "status", "is_favourite", "is_archived"]
\`\`\`

## Lessons

- Fetching a queryset twice is a bug 90% of the time — cache it with \`list()\`.
- \`.count()\` on a *filtered* queryset is fine; \`.count()\` on a huge table is not.
- Put \`select_related\`/\`prefetch_related\` in the *view*, not the serializer, so the serializer stays dumb.`,
    resources: [
      {
        id: 104,
        title: 'Django docs — queries',
        url: 'https://docs.djangoproject.com/en/stable/topics/db/queries/',
        resource_type: 'DOCUMENTATION',
        description: 'The canonical reference for making queries.',
      },
    ],
    code_snippets: [],
  },
  {
    id: 3,
    title: 'useMemo vs useCallback — when they actually matter',
    owner: 1,
    category: 3,
    tags: [5, 6],
    status: 'LEARNING',
    is_archived: false,
    is_favorite: false,
    created_at: daysAgo(9),
    updated_at: daysAgo(1),
    content: `# useMemo vs useCallback

Both are *memoization*, not "make things faster" buttons. They trade a little
memory and staleness risk for fewer re-renders.

## The rule of thumb

- **useCallback** — keep a function reference stable so \`React.memo\` children and
  effect dependencies don't re-run.
- **useMemo** — keep a *computed value* from re-computing on every render.

\`\`\`jsx
const handleSave = useCallback(() => { /* ... */ }, [deps])
const filtered = useMemo(() => notes.filter(byStatus), [notes, status])
\`\`\`

## When it's not worth it

If the computation is cheap (a filter over 50 items) or the component re-renders
rarely, the wrapper adds more code than it saves. Premature memoization is a
code smell.

> Profiling first. React DevTools "Profiler" shows you exactly which
> components re-render and why. Optimize the ones at the top of the flame.

## The classic trap

\`\`\`jsx
// Bad — new array every render, memoization useless
const items = useMemo(() => props.list.map(mapFn), [])
\`\`\`

\`props.list\` itself needs a stable reference (useMemo at the *source*), or the
whole chain leaks.`,
    resources: [],
    code_snippets: [
      {
        id: 203,
        title: 'Stable props chain',
        language: 'JAVASCRIPT',
        code: `const Parent = () => {
  // stable across renders
  const items = useMemo(() => buildItems(), [])

  return <Child items={items} onSave={handleSave} />
}`,
      },
    ],
  },
  {
    id: 4,
    title: 'Redux Toolkit — slices, thunks and the modern setup',
    owner: 1,
    category: 3,
    tags: [7, 12],
    status: 'LEARNED',
    is_archived: false,
    is_favorite: true,
    created_at: daysAgo(45),
    updated_at: daysAgo(12),
    content: `# Redux Toolkit

RTK is the "boring, correct" way to write Redux. Immer gives you mutable-looking
reducers, and slices collapse actions + reducers into one file.

## A slice

\`\`\`js
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, tokens: null },
  reducers: {
    setTokens(state, action) {
      state.tokens = action.payload
    },
  },
})
\`\`\`

## Why thunks for side effects

Reducers must stay pure. API calls belong in \`createAsyncThunk\` — you get
\`pending\` / \`fulfilled\` / \`rejected\` actions for free, which drive the
loading/error UI.

## Selectors

Compute derived state once, memoized:

\`\`\`js
const selectActiveNotes = createSelector(
  [selectAllNotes, selectStatusFilter],
  (notes, status) => notes.filter((n) => n.status === status),
)
\`\`\`

## When NOT to use it

If the state is local to one page and dies with it, \`useState\` + a fetch hook is
simpler. Global state should mean "many unrelated components need this": auth,
session, toasts, preferences.`,
    resources: [
      {
        id: 105,
        title: 'Redux Style Guide',
        url: 'https://redux.js.org/style-guide/',
        resource_type: 'DOCUMENTATION',
        description: 'The official guidance — opinionated and practical.',
      },
    ],
    code_snippets: [],
  },
  {
    id: 5,
    title: 'Async error handling — the patterns that hold up',
    owner: 1,
    category: 4,
    tags: [8, 9],
    status: 'REVIEW',
    is_archived: false,
    is_favorite: false,
    created_at: daysAgo(18),
    updated_at: daysAgo(3),
    content: `# Async error handling

Most JS error-handling advice collapses to: *don't let errors escape into the void,
and don't swallow them either*.

## try / await

\`\`\`js
async function load() {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
    return res.json()
  } catch (err) {
    // log + rethrow or handle
    throw err
  }
}
\`\`\`

## The unhandled promise

A rejected promise nobody awaits → \`unhandledrejection\`. In a browser tab this is
silent; on Node it can crash the process. **Always** attach a \`.catch\` or \`await\`
inside try.

## Marked for review

Re-reading this note — I want to add coverage for:
- \`Promise.allSettled\` for parallel work where one failure shouldn't kill the rest.
- AbortController timeouts for hanging requests.
- Error boundaries in React for render-time errors.`,
    resources: [
      {
        id: 106,
        title: 'MDN — Promise guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises',
        resource_type: 'DOCUMENTATION',
        description: 'Baseline reference for promise semantics.',
      },
    ],
    code_snippets: [
      {
        id: 204,
        title: 'Parallel work with allSettled',
        language: 'JAVASCRIPT',
        code: `const results = await Promise.allSettled([
  fetch("/a"),
  fetch("/b"),
  fetch("/c"),
])

const ok = results.filter((r) => r.status === "fulfilled")
const failed = results.filter((r) => r.status === "rejected")`,
      },
    ],
  },
  {
    id: 6,
    title: 'Python dataclasses — when they beat dictionaries',
    owner: 1,
    category: 1,
    tags: [16],
    status: 'LEARNED',
    is_archived: false,
    is_favorite: false,
    created_at: daysAgo(70),
    updated_at: daysAgo(30),
    content: `# dataclasses

\`@dataclass\` removes the ceremony of writing \`__init__\`, \`__repr__\`, \`__eq__\` by hand —
and gives you type-annotated fields that tools and editors can use.

\`\`\`python
from dataclasses import dataclass

@dataclass(frozen=True)
class Vector:
    x: float
    y: float

    def __add__(self, other: "Vector") -> "Vector":
        return Vector(self.x + other.x, self.y + other.y)
\`\`\`

## Dict vs dataclass

| Dict | Dataclass |
| --- | --- |
| Fast to write | Slightly more setup |
| No shape guarantee | Fields enforced |
| \`d["x"]\` typos break at runtime | \`.x\` is checked by tooling |
| Great for JSON round-trips | Great for domain objects |

## The rule

Dictionaries are the right call at the API boundary (JSON in/out). The moment a
value has *behavior* or travels through your code as a "thing", promote it to a
dataclass (or a small class).`,
    resources: [],
    code_snippets: [],
  },
  {
    id: 7,
    title: 'TypeScript generics — the part that finally clicked',
    owner: 1,
    category: 5,
    tags: [],
    status: 'LEARNING',
    is_archived: false,
    is_favorite: false,
    created_at: daysAgo(5),
    updated_at: daysAgo(1, 3),
    content: `# Generics without the jargon

A generic is a *placeholder for a type you don't know yet*, decided by the caller.

\`\`\`ts
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

const a = first([1, 2, 3])   // T inferred as number
const b = first(["a", "b"])  // T inferred as string
\`\`\`

## Constraints keep it honest

\`\`\`ts
function pick<K extends keyof T, T extends object>(obj: T, key: K): T[K] {
  return obj[key]
}
\`\`\`

## The mental model

Think of \`T\` as a variable in a type-level function. When you call it, TypeScript
fills it in and checks the body against *every* possible fill-in. That's why the
compiler complains about things like \`return null\` when \`T\` could be \`string\`.

## TODO

- Generic conditional types (\`T extends U ? X : Y\`).
- \`infer\` in utility types.`,
    resources: [],
    code_snippets: [],
  },
  {
    id: 8,
    title: 'PostgreSQL indexing strategies that actually scale',
    owner: 1,
    category: 6,
    tags: [10, 6],
    status: 'LEARNING',
    is_archived: false,
    is_favorite: true,
    created_at: daysAgo(11),
    updated_at: daysAgo(2),
    content: `# Indexes in PostgreSQL

An index is a trade: write cost + storage, for read speed. The question is always
*which reads*.

## B-tree is the default

Covers \`=\`, \`>\`, \`<\`, \`BETWEEN\`, \`ORDER BY\`, and prefix \`LIKE\`. Good enough for
most FK lookups.

## Multi-column — column order matters

\`\`\`sql
CREATE INDEX idx_notes_owner_status ON notes (owner_id, status);
\`\`\`

Put the most-selective column first. An index on \`(a, b)\` also serves queries on
just \`a\`, but not just \`b\`.

## Partial indexes

Index only the rows you query:

\`\`\`sql
CREATE INDEX idx_notes_active ON notes (updated_at)
WHERE is_archived = false;
\`\`\`

Smaller index → faster scans and fewer writes to maintain.

## The one tool to know

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;
\`\`\`

Always check whether Postgres actually *uses* your index before celebrating.`,
    resources: [
      {
        id: 107,
        title: 'Use the Index, Luke!',
        url: 'https://use-the-index-luke.com/',
        resource_type: 'COURSE',
        description: 'The best free course on indexing for relational databases.',
      },
    ],
    code_snippets: [
      {
        id: 205,
        title: 'Verify the planner is using it',
        language: 'SQL',
        code: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, title FROM notes
WHERE owner_id = 42 AND status = 'LEARNING'
ORDER BY updated_at DESC;`,
      },
    ],
  },
  {
    id: 9,
    title: 'Docker multi-stage builds for lean Python images',
    owner: 1,
    category: 7,
    tags: [11],
    status: 'LEARNED',
    is_archived: false,
    is_favorite: false,
    created_at: daysAgo(35),
    updated_at: daysAgo(25),
    content: `# Multi-stage builds

Compile/build in one image, copy only the artifacts into the runtime image.

\`\`\`dockerfile
FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --prefix=/install -r requirements.txt

FROM python:3.12-slim
COPY --from=builder /install /usr/local
COPY . /app
WORKDIR /app
CMD ["uvicorn", "app.main:app"]
\`\`\`

The final image skips the build tools (gcc, etc.) — smaller, fewer CVEs.

## Why it matters

- **Size** — a 30MB image vs 1.2GB is night and day for pull times.
- **Surface** — fewer packages = smaller attack surface.
- **Layers** — \`COPY requirements.txt\` before the code keeps the dependency layer cached across builds.`,
    resources: [
      {
        id: 108,
        title: 'Best practices for writing Dockerfiles',
        url: 'https://docs.docker.com/build/building/best-practices/',
        resource_type: 'DOCUMENTATION',
        description: 'Official guidance on layer caching and multi-stage.',
      },
      {
        id: 109,
        title: 'Google — slim images vs scratch',
        url: 'https://github.com/GoogleContainerTools/distroless',
        resource_type: 'GITHUB',
        description: 'Distroless images — "containers only for your application".',
      },
    ],
    code_snippets: [],
  },
  {
    id: 10,
    title: 'Axios interceptors for token refresh — done right',
    owner: 1,
    category: 4,
    tags: [8, 2, 3],
    status: 'LEARNING',
    is_archived: false,
    is_favorite: true,
    created_at: daysAgo(4),
    updated_at: daysAgo(0, 5),
    content: `# The single-flight refresh interceptor

The classic pitfall: 10 parallel requests all 401 → 10 refresh calls → refresh
token gets blacklisted. Fix it by caching the refresh promise.

## Response interceptor

\`\`\`js
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { config, response } = err
    if (!response || response.status !== 401 || config._retry) return Promise.reject(err)
    config._retry = true

    try {
      const { data } = await api.post("/accounts/token/refresh/", {
        refresh: getRefreshToken(),
      })
      setAccessToken(data.access)
      config.headers.Authorization = \`Bearer \${data.access}\`
      return api(config)
    } catch (refreshError) {
      logout()
      return Promise.reject(refreshError)
    }
  },
)
\`\`\`

## What "done right" means here

- Single-flight — one refresh promise shared by all queued requests.
- Retry exactly once (\`_retry\` guard) so a truly broken token doesn't loop forever.
- On refresh failure → **logout**, don't hang the app in a zombie state.
- Attach the header only where it matters (the \`Authorization\` header, never the refresh token).`,
    resources: [],
    code_snippets: [
      {
        id: 206,
        title: 'Shared axios instance',
        language: 'JAVASCRIPT',
        code: `import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = \`Bearer \${token}\`
  return config
})`,
      },
    ],
  },
  {
    id: 11,
    title: 'Container queries — the CSS upgrade to media queries',
    owner: 1,
    category: 8,
    tags: [13],
    status: 'REVIEW',
    is_archived: false,
    is_favorite: false,
    created_at: daysAgo(26),
    updated_at: daysAgo(4),
    content: `# Container queries

Media queries respond to the *viewport*. Container queries respond to the *parent*.
That's the entire idea — components adapt to their slot, not the window.

\`\`\`css
.card-list {
  container-type: inline-size;
}

.card {
  /* when the list is narrow */
  @container (max-width: 400px) {
    display: block;
  }
}
\`\`\`

## When to reach for them

- Sidebar widgets, dashboard panels, embedded cards — anything reused in multiple
  widths.
- Grid components that must work at any column count.

## Still in the review pile

- \`container-name\` for multiple containers in one tree.
- Safari support matrix — it's shipped, but older versions need a fallback.`,
    resources: [
      {
        id: 110,
        title: 'MDN — CSS container queries',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries',
        resource_type: 'DOCUMENTATION',
        description: 'Syntax, units and gotchas.',
      },
    ],
    code_snippets: [],
  },
  {
    id: 12,
    title: 'pytest fixtures and parametrize — tests without the boilerplate',
    owner: 1,
    category: 1,
    tags: [9, 16],
    status: 'LEARNED',
    is_archived: false,
    is_favorite: false,
    created_at: daysAgo(55),
    updated_at: daysAgo(20),
    content: `# pytest patterns

\`\`\`python
import pytest

@pytest.fixture
def note(client, user):
    return client.post("/api/notes/", data={...})

@pytest.mark.parametrize("status", ["LEARNING", "LEARNED", "REVIEW"])
def test_status_filter(client, status):
    resp = client.get(f"/api/notes/?status={status}")
    assert resp.status_code == 200
\`\`\`

## Fixture scope matters

- \`function\` — fresh per test (default). Slow for DB-heavy suites.
- \`session\` / \`module\` — shared, but be careful with mutable state bleeding between tests.

## The one thing that tripped me up

A fixture that *returns* a client vs one that *yields* and cleans up after the
test. Cleanup goes in \`yield\` form:

\`\`\`python
@pytest.fixture
def db_session():
    session = Session()
    yield session
    session.close()
\`\`\``,
    resources: [],
    code_snippets: [],
  },
  {
    id: 13,
    title: 'Git worktrees — parallel feature work without the stash',
    owner: 1,
    category: 7,
    tags: [14],
    status: 'LEARNED',
    is_archived: false,
    is_favorite: true,
    created_at: daysAgo(28),
    updated_at: daysAgo(15),
    content: `# git worktree

A worktree is a second checkout of the repo on a different branch, sharing the
same \`.git\`. Two features at once, no stashing, no context-switch purge.

\`\`\`bash
# add a linked worktree on branch feature/x
git worktree add ../repo-x feature/x

# list
git worktree list

# remove when done
git worktree remove ../repo-x
\`\`\`

## The rules

- Each branch can be checked out in only **one** worktree at a time.
- \`.git\` is shared, so refs, remotes, and config are common.
- Drop the worktree before deleting the branch.

## When I use it

- A bugfix lands while a feature is mid-flight.
- Code review wants a clean tree for an experiment.

**Mnemonic:** "one brain, two desks" — same repo, different working copies.`,
    resources: [
      {
        id: 111,
        title: 'git-worktree(1)',
        url: 'https://git-scm.com/docs/git-worktree',
        resource_type: 'DOCUMENTATION',
        description: 'The man page — short and precise.',
      },
    ],
    code_snippets: [],
  },
  {
    id: 14,
    title: 'Vim navigation — the 10% covering 90% of edits',
    owner: 1,
    category: 7,
    tags: [15],
    status: 'REVIEW',
    is_archived: false,
    is_favorite: false,
    created_at: daysAgo(14),
    updated_at: daysAgo(7),
    content: `# Vim motions worth muscle-memory

- \`f<char>\` — jump to the next \`char\` on the line. \`;\` repeats.
- \`w\` / \`b\` — word forward / back. \`W\`\`B\` skip punctuation.
- \`ci"\` — change *inside* quotes. \`da(\` — delete around parens.
- \`zz\` — center the cursor line in the view.
- \`C\` — delete to end of line, enter insert mode.

## The 90/10 rule

I mapped \`jk\` → escape and \`<space>\` → leader. Two changes, massive day-to-day
gain. Everything else can come later.

## To review

- \`q:\` command-line history vs \`q/\` search history.
- Marks \`mA\` … \`\`'A\` for cross-file jumps.`,
    resources: [],
    code_snippets: [
      {
        id: 207,
        title: 'Essential keymap',
        language: 'OTHER',
        code: `" jk as escape
inoremap jk <Esc>

" space as leader
let mapleader = " "

" quick save
nnoremap <leader>w :w<CR>`,
      },
    ],
  },
  {
    id: 15,
    title: 'Old Docker networking notes',
    owner: 1,
    category: 7,
    tags: [11],
    status: 'LEARNED',
    is_archived: true,
    is_favorite: false,
    created_at: daysAgo(120),
    updated_at: daysAgo(90),
    content: `# Docker networking — archived notes

Legacy notes on bridge networks, \`--network host\` and \`docker-compose\` service
discovery. Mostly superseded by the compose file:

\`\`\`yaml
services:
  app:
    build: .
    networks: [backend]
  db:
    image: postgres:16
    networks: [backend]

networks:
  backend: {}
\`\`\`

Services resolve each other by name over the shared network.`,
    resources: [],
    code_snippets: [],
  },
  {
    id: 16,
    title: 'Legacy jQuery migration checklist',
    owner: 1,
    category: 4,
    tags: [],
    status: 'LEARNED',
    is_archived: true,
    is_favorite: false,
    created_at: daysAgo(200),
    updated_at: daysAgo(150),
    content: `# jQuery → vanilla migration

Kept for reference. The checklist:

1. \`$.ajax\` → \`fetch\` (or axios).
2. \`$(el).on\` → \`addEventListener\`.
3. \`$.each\` → \`forEach\`.
4. \`$(document).ready\` → \`defer\` script + DOMContentLoaded.

Completed and archived.`,
    resources: [],
    code_snippets: [],
  },
]

export const user = {
  id: 1,
  username: 'mausam',
  email: 'mausam@dev.local',
  first_name: '',
  last_name: '',
  date_joined: daysAgo(320),
}

export const dashboard = {
  total_notes: 14,
  learning: 5,
  learned: 6,
  review: 3,
  favorites: 4,
  archived: 2,
  categories: 6,
}