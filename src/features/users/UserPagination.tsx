import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUIStore } from '@/store/uiStore';

interface UserPaginationProps {
  total: number;
  totalPages: number;
}

export function UserPagination({ total, totalPages }: UserPaginationProps) {
  const { page, limit, setPage, setLimit } = useUIStore(s => ({
    page: s.page,
    limit: s.limit,
    setPage: s.setPage,
    setLimit: s.setLimit,
  }));

  const from = Math.min((page - 1) * limit + 1, total);
  const to = Math.min(page * limit, total);

  // Generate visible page numbers
  const getPages = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
      {/* Count info */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground font-body">
        <span>
          Showing <span className="font-medium text-foreground">{from}–{to}</span> of{' '}
          <span className="font-medium text-foreground">{total}</span> users
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs">Rows:</span>
          <Select value={String(limit)} onValueChange={v => setLimit(Number(v))}>
            <SelectTrigger className="h-7 w-[60px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 8, 10, 20].map(n => (
                <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost" size="icon"
          className="h-8 w-8"
          onClick={() => setPage(1)}
          disabled={page === 1}
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost" size="icon"
          className="h-8 w-8"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1 mx-1">
          {getPages().map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="w-8 text-center text-muted-foreground text-sm">…</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 w-8 rounded-lg text-sm font-medium font-body transition-all ${
                  p === page
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <Button
          variant="ghost" size="icon"
          className="h-8 w-8"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost" size="icon"
          className="h-8 w-8"
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
          title="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
