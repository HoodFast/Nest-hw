export class SortData {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  pageNumber: number;
  pageSize: number;
}

export class BlogSortData extends SortData {
  searchNameTerm: string | null;
}
