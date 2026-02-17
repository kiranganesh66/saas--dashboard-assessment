import { AlertCircle, RefreshCw, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserSearchBar } from './UserSearchBar';
import { UserTable } from './UserTable';
import { UserTableSkeleton } from './UserTableSkeleton';
import { UserPagination } from './UserPagination';
import { EditUserModal } from './EditUserModal';
import { StatsBar } from './StatsBar';
import { useUsers } from '@/hooks/useUsers';
import { useUIStore } from '@/store/uiStore';

export function UsersPage() {
  const { data, isLoading, isError, isFetching, refetch, error } = useUsers();
  const { resetFilters, debouncedSearch } = useUIStore(s => ({
    resetFilters: s.resetFilters,
    debouncedSearch: s.debouncedSearch,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <UsersRound className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-foreground text-lg leading-none">UserHub</h1>
                <p className="text-[10px] text-muted-foreground font-body">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground font-body hidden sm:block">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">User Management</h2>
            <p className="text-sm text-muted-foreground font-body mt-0.5">
              {data ? `${data.total} users across all departments` : 'Loading users...'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="self-start sm:self-auto gap-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        {data && <StatsBar users={data.users} total={data.total} />}
        {isLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl border border-border/50 shimmer-bg" />
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <UserSearchBar />
          {debouncedSearch && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
              Clear filters
            </Button>
          )}
          {isFetching && !isLoading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-body animate-fade-in">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              Syncing...
            </div>
          )}
        </div>

        {/* Content area */}
        {isLoading ? (
          <UserTableSkeleton />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} message={(error as Error)?.message} />
        ) : data && data.users.length === 0 ? (
          <EmptyState onReset={resetFilters} hasSearch={!!debouncedSearch} />
        ) : data ? (
          <>
            <UserTable users={data.users} isFetching={isFetching} />
            <UserPagination total={data.total} totalPages={data.totalPages} />
          </>
        ) : null}
      </main>

      <EditUserModal />
    </div>
  );
}

function ErrorState({ onRetry, message }: { onRetry: () => void; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 rounded-xl border border-destructive/20 bg-destructive/5">
      <AlertCircle className="h-10 w-10 text-destructive mb-4" />
      <h3 className="font-display font-semibold text-foreground mb-1">Failed to load users</h3>
      <p className="text-sm text-muted-foreground font-body mb-6">{message || 'Something went wrong. Please try again.'}</p>
      <Button onClick={onRetry} variant="outline" size="sm">
        <RefreshCw className="h-3.5 w-3.5 mr-2" /> Try Again
      </Button>
    </div>
  );
}

function EmptyState({ onReset, hasSearch }: { onReset: () => void; hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 rounded-xl border border-border/50 bg-muted/20">
      <UsersRound className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="font-display font-semibold text-foreground mb-1">No users found</h3>
      <p className="text-sm text-muted-foreground font-body mb-6">
        {hasSearch ? 'No users match your search criteria.' : 'No users exist yet.'}
      </p>
      {hasSearch && (
        <Button onClick={onReset} variant="outline" size="sm">Clear Search</Button>
      )}
    </div>
  );
}
