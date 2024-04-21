export class SortData {
  sortBy: string;
  sortDirection: 'asc' | 'desc' | number;
  pageNumber: number;
  pageSize: number;
}

export class BlogSortData extends SortData {
  searchNameTerm: string | null;
}

export class UsersSortData extends SortData {
  searchLoginTerm?: string | null;
  searchEmailTerm?: string | null;
}
