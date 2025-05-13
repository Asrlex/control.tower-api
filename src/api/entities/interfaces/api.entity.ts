export interface FilterI {
  field?: string;
  operator?:
    | '<'
    | '<='
    | '='
    | '>'
    | '>='
    | 'like'
    | 'in'
    | 'between'
    | 'LIKE'
    | 'IN'
    | 'BETWEEN';
  value?: string;
}

export interface SortI {
  field?: string;
  order?: 'asc' | 'desc' | 'ASC' | 'DESC';
}

export interface SearchCriteriaI {
  filters: FilterI[];
  search: string;
  sort: SortI[];
}

export interface FormattedResponseI {
  statusCode: number;
  data: any;
  pagination?: {
    total?: number;
    offset?: number;
    limit?: number;
    hasMore?: boolean;
    loading?: boolean;
  };
  id?: string | number;
  searchCriteria?: SearchCriteriaI;
  batch?: string;
  article?: string;
}

export interface StatusI {
  statusCode: string; // STATUS
  statusDescription: string;
}
