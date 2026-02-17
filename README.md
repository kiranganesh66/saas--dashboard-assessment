# SaaS User Management Dashboard

A production-grade user management dashboard built with React 18, TypeScript, Zustand, TanStack Query, and shadcn/ui.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

---

## 🏗 Architecture Decisions

### Folder Structure
```
src/
├── components/ui/        # Reusable shadcn/ui primitives (Button, Input, Badge, etc.)
├── features/users/       # All user-feature-specific components co-located
│   ├── UsersPage.tsx     # Main page orchestrator
│   ├── UserTable.tsx     # Sortable data table
│   ├── UserSearchBar.tsx # Debounced search input
│   ├── UserPagination.tsx# Page navigation + per-page selector
│   ├── EditUserModal.tsx # Edit form with optimistic updates
│   ├── StatsBar.tsx      # Summary stat cards
│   └── UserTableSkeleton.tsx # Loading skeleton
├── hooks/
│   ├── useDebounce.ts    # Debounce side-effect hook
│   ├── useUsers.ts       # TanStack Query data hooks
│   └── useToast.ts       # Toast notification hook
├── lib/
│   ├── mockApi.ts        # Mock API with simulated latency
│   └── utils.ts          # Shared utilities (cn, formatDate, etc.)
├── store/
│   └── uiStore.ts        # Zustand UI state (search, sort, pagination, modal)
└── types/
    └── user.ts           # All TypeScript types and interfaces
```

### State Management Strategy

**Two-layer state architecture:**

1. **Zustand (`uiStore`)** — manages all UI/interaction state:
   - `searchInput` — raw (instant) user input
   - `debouncedSearch` — the debounced value sent to queries
   - `page`, `limit` — pagination
   - `sortField`, `sortOrder` — table sorting
   - `editingUserId` — which modal is open

2. **TanStack Query** — manages all server/async state:
   - `useUsers()` — fetches paginated, sorted, filtered users
   - `useUpdateUser()` — mutation with **optimistic updates**
   - Results are **cached** for 30 seconds (`staleTime`)

This separation keeps concerns clean: Zustand owns "what the user is doing", TanStack Query owns "what data we have".

### Debounced Search
`useDebounceSearch` is a hook that watches `searchInput` from Zustand and writes to `debouncedSearch` after a 400ms delay. The query uses `debouncedSearch` — so API calls only fire when the user pauses typing.

### Optimistic Updates
`useUpdateUser` uses TanStack Query's `onMutate` to:
1. Cancel in-flight queries
2. Snapshot previous cache data
3. Immediately update the UI with new values
4. Roll back on error via `onError`
5. Refetch to sync truth from server via `onSettled`

This gives users instant feedback without waiting for the API.

### Caching
TanStack Query caches every unique `(page, limit, search, sortField, sortOrder)` combination for 30 seconds. Navigating back to a previous page shows cached data instantly.

### Mock API
`src/lib/mockApi.ts` simulates real API behavior:
- Artificial latency (600ms fetch, 400ms update)
- Server-side filtering, sorting, and pagination
- Stateful (mutations persist across interactions in session)

---

## 🧰 Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Utility-first styling |
| Zustand | UI state management |
| TanStack Query v5 | Server state, caching, mutations |
| shadcn/ui | Accessible component primitives |
| Radix UI | Headless component foundation |
| Lucide React | Icon library |

---

## ✅ Feature Checklist

- [x] Fetch list of users (mock API with simulated latency)
- [x] Search with 400ms debounce
- [x] Pagination (page nav + per-page selector)
- [x] Column sorting (ascending/descending toggle)
- [x] Loading skeletons + error state with retry
- [x] Edit user modal with optimistic update + rollback
- [x] Basic caching (30s stale time per query key)
- [x] TypeScript throughout
- [x] Clean folder structure

---

## 📝 Notes

- The mock API (`mockApi.ts`) mutates an in-memory array, so edits persist for the duration of the session but reset on page refresh.
- TanStack Query Devtools are included in development mode (bottom-right corner).
- The dashboard is fully responsive for mobile and desktop.
