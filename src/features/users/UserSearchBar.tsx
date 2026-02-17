import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/uiStore';
import { useDebounceSearch } from '@/hooks/useDebounce';

export function UserSearchBar() {
  const searchInput = useUIStore(s => s.searchInput);
  const setSearchInput = useUIStore(s => s.setSearchInput);

  useDebounceSearch(400);

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
        placeholder="Search by name, email, role..."
        className="pl-9 pr-9 bg-background/60 border-border/60 focus:bg-background transition-colors"
      />
      {searchInput && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={() => setSearchInput('')}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
