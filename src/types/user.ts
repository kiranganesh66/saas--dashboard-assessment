export type UserRole = 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar: string;
  joinedAt: string;
  lastActive: string;
  department: string;
}

export type SortField = keyof Pick<User, 'name' | 'email' | 'role' | 'status' | 'joinedAt'>;
export type SortOrder = 'asc' | 'desc';

export interface UsersQueryParams {
  page: number;
  limit: number;
  search: string;
  sortField: SortField;
  sortOrder: SortOrder;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateUserPayload {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
}
