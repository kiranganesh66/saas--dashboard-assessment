import type { User, UsersQueryParams, UsersResponse, UpdateUserPayload } from '@/types/user';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Aria Chen', email: 'aria.chen@company.io', role: 'admin', status: 'active', avatar: '', joinedAt: '2023-01-15', lastActive: '2024-01-10', department: 'Engineering' },
  { id: '2', name: 'Marcus Webb', email: 'marcus.webb@company.io', role: 'editor', status: 'active', avatar: '', joinedAt: '2023-02-20', lastActive: '2024-01-09', department: 'Design' },
  { id: '3', name: 'Sophia Laurent', email: 'sophia.l@company.io', role: 'viewer', status: 'inactive', avatar: '', joinedAt: '2023-03-10', lastActive: '2023-12-01', department: 'Marketing' },
  { id: '4', name: 'Dante Rivera', email: 'dante.r@company.io', role: 'editor', status: 'active', avatar: '', joinedAt: '2023-04-05', lastActive: '2024-01-10', department: 'Product' },
  { id: '5', name: 'Imogen Blake', email: 'imogen.blake@company.io', role: 'admin', status: 'active', avatar: '', joinedAt: '2023-01-28', lastActive: '2024-01-10', department: 'Engineering' },
  { id: '6', name: 'Felix Nakamura', email: 'felix.n@company.io', role: 'viewer', status: 'pending', avatar: '', joinedAt: '2023-12-01', lastActive: '2023-12-15', department: 'Sales' },
  { id: '7', name: 'Zara Okafor', email: 'zara.o@company.io', role: 'editor', status: 'active', avatar: '', joinedAt: '2023-05-14', lastActive: '2024-01-08', department: 'Content' },
  { id: '8', name: 'Theo Marchetti', email: 'theo.m@company.io', role: 'viewer', status: 'active', avatar: '', joinedAt: '2023-06-22', lastActive: '2024-01-07', department: 'Finance' },
  { id: '9', name: 'Lyra Osei', email: 'lyra.osei@company.io', role: 'editor', status: 'inactive', avatar: '', joinedAt: '2023-07-30', lastActive: '2023-11-20', department: 'HR' },
  { id: '10', name: 'Caspian Voss', email: 'caspian.v@company.io', role: 'admin', status: 'active', avatar: '', joinedAt: '2023-08-11', lastActive: '2024-01-10', department: 'Engineering' },
  { id: '11', name: 'Mira Delacroix', email: 'mira.d@company.io', role: 'viewer', status: 'active', avatar: '', joinedAt: '2023-09-03', lastActive: '2024-01-06', department: 'Design' },
  { id: '12', name: 'Orion Kestrel', email: 'orion.k@company.io', role: 'editor', status: 'pending', avatar: '', joinedAt: '2023-12-20', lastActive: '2024-01-02', department: 'Marketing' },
  { id: '13', name: 'Sable Huang', email: 'sable.h@company.io', role: 'viewer', status: 'active', avatar: '', joinedAt: '2023-10-17', lastActive: '2024-01-09', department: 'Product' },
  { id: '14', name: 'Remy Fontaine', email: 'remy.f@company.io', role: 'editor', status: 'active', avatar: '', joinedAt: '2023-03-29', lastActive: '2024-01-10', department: 'Engineering' },
  { id: '15', name: 'Nova Ashworth', email: 'nova.a@company.io', role: 'admin', status: 'inactive', avatar: '', joinedAt: '2023-11-05', lastActive: '2023-12-28', department: 'Sales' },
  { id: '16', name: 'Elio Vasquez', email: 'elio.v@company.io', role: 'viewer', status: 'active', avatar: '', joinedAt: '2023-04-18', lastActive: '2024-01-08', department: 'Finance' },
  { id: '17', name: 'Petra Wolff', email: 'petra.w@company.io', role: 'editor', status: 'active', avatar: '', joinedAt: '2023-05-27', lastActive: '2024-01-10', department: 'Content' },
  { id: '18', name: 'Idris Saleh', email: 'idris.s@company.io', role: 'viewer', status: 'pending', avatar: '', joinedAt: '2023-12-12', lastActive: '2024-01-03', department: 'HR' },
  { id: '19', name: 'Vesper Crane', email: 'vesper.c@company.io', role: 'editor', status: 'active', avatar: '', joinedAt: '2023-06-09', lastActive: '2024-01-09', department: 'Engineering' },
  { id: '20', name: 'Sylvan Park', email: 'sylvan.p@company.io', role: 'viewer', status: 'active', avatar: '', joinedAt: '2023-07-22', lastActive: '2024-01-07', department: 'Design' },
];

let usersData = [...MOCK_USERS];

const simulateLatency = (ms = 600) => new Promise(res => setTimeout(res, ms));

export async function fetchUsers(params: UsersQueryParams): Promise<UsersResponse> {
  await simulateLatency();

  let filtered = usersData.filter(user => {
    if (!params.search) return true;
    const q = params.search.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.department.toLowerCase().includes(q) ||
      user.role.toLowerCase().includes(q)
    );
  });

  filtered.sort((a, b) => {
    const aVal = a[params.sortField];
    const bVal = b[params.sortField];
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return params.sortOrder === 'asc' ? cmp : -cmp;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / params.limit);
  const start = (params.page - 1) * params.limit;
  const users = filtered.slice(start, start + params.limit);

  return { users, total, page: params.page, limit: params.limit, totalPages };
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  await simulateLatency(400);

  const index = usersData.findIndex(u => u.id === id);
  if (index === -1) throw new Error('User not found');

  usersData[index] = { ...usersData[index], ...payload };
  return usersData[index];
}
