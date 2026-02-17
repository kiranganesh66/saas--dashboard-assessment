import { Users, UserCheck, Clock, ShieldCheck } from 'lucide-react';
import type { User } from '@/types/user';

interface StatsBarProps {
  users: User[];
  total: number;
}

export function StatsBar({ users, total }: StatsBarProps) {
  const allUsers = users;
  const active = allUsers.filter(u => u.status === 'active').length;
  const pending = allUsers.filter(u => u.status === 'pending').length;
  const admins = allUsers.filter(u => u.role === 'admin').length;

  const stats = [
    { label: 'Total Users', value: total, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active', value: active, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Admins', value: admins, icon: ShieldCheck, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="relative bg-card border border-border/50 rounded-xl p-4 overflow-hidden"
          style={{ animation: `fade-in 0.4s ease-out ${i * 80}ms both` }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-body font-medium uppercase tracking-wide mb-1">{stat.label}</p>
              <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
            </div>
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
          {/* Subtle decorative corner */}
          <div className={`absolute -bottom-4 -right-4 h-16 w-16 rounded-full ${stat.bg} opacity-50`} />
        </div>
      ))}
    </div>
  );
}
