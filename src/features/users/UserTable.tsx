import { ChevronUp, ChevronDown, ChevronsUpDown, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUIStore } from '@/store/uiStore';
import { formatDate, getInitials } from '@/lib/utils';
import type { User, SortField } from '@/types/user';

interface UserTableProps {
  users: User[];
  isFetching?: boolean;
}

function SortIcon({ field, currentField, order }: { field: SortField; currentField: SortField; order: 'asc' | 'desc' }) {
  if (field !== currentField) return <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />;
  return order === 'asc'
    ? <ChevronUp className="h-3.5 w-3.5 text-primary" />
    : <ChevronDown className="h-3.5 w-3.5 text-primary" />;
}

const AVATAR_COLORS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
  'from-rose-500 to-pink-600',
  'from-indigo-500 to-blue-600',
];

function getAvatarColor(name: string) {
  const idx = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

const COLUMNS: { label: string; field?: SortField; className?: string }[] = [
  { label: 'User', field: 'name', className: 'min-w-[200px]' },
  { label: 'Email', field: 'email', className: 'min-w-[200px]' },
  { label: 'Department', className: 'min-w-[120px]' },
  { label: 'Role', field: 'role', className: 'w-[100px]' },
  { label: 'Status', field: 'status', className: 'w-[100px]' },
  { label: 'Joined', field: 'joinedAt', className: 'w-[120px]' },
  { label: '', className: 'w-[60px]' },
];

export function UserTable({ users, isFetching }: UserTableProps) {
  const { sortField, sortOrder, setSorting, openEditModal } = useUIStore(s => ({
    sortField: s.sortField,
    sortOrder: s.sortOrder,
    setSorting: s.setSorting,
    openEditModal: s.openEditModal,
  }));

  return (
    <div className={`relative overflow-hidden rounded-xl border border-border/50 bg-card transition-opacity duration-300 ${isFetching ? 'opacity-70' : 'opacity-100'}`}>
      {/* Scrollable wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/30">
              {COLUMNS.map(col => (
                <th key={col.label} className={`px-4 py-3 text-left font-medium font-display text-muted-foreground text-xs uppercase tracking-wide ${col.className ?? ''}`}>
                  {col.field ? (
                    <button
                      onClick={() => setSorting(col.field!)}
                      className="flex items-center gap-1.5 hover:text-foreground transition-colors group"
                    >
                      {col.label}
                      <SortIcon field={col.field} currentField={sortField} order={sortOrder} />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={user.id}
                className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors group"
                style={{ animation: `fade-in 0.3s ease-out ${i * 40}ms both` }}
              >
                {/* User */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className={`bg-gradient-to-br ${getAvatarColor(user.name)} text-white text-xs font-display font-semibold`}>
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium font-body text-foreground truncate">{user.name}</span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3.5">
                  <span className="text-muted-foreground font-mono text-xs">{user.email}</span>
                </td>

                {/* Department */}
                <td className="px-4 py-3.5">
                  <span className="text-foreground/80 font-body">{user.department}</span>
                </td>

                {/* Role */}
                <td className="px-4 py-3.5">
                  <Badge variant={user.role as 'admin' | 'editor' | 'viewer'} className="capitalize">
                    {user.role}
                  </Badge>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                      user.status === 'active' ? 'bg-emerald-500' :
                      user.status === 'pending' ? 'bg-amber-500' : 'bg-zinc-400'
                    }`} />
                    <Badge variant={user.status as 'active' | 'inactive' | 'pending'} className="capitalize">
                      {user.status}
                    </Badge>
                  </div>
                </td>

                {/* Joined */}
                <td className="px-4 py-3.5">
                  <span className="text-muted-foreground text-xs font-body">{formatDate(user.joinedAt)}</span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => openEditModal(user.id)}
                    title="Edit user"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
