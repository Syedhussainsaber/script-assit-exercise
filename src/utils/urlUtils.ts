
  // src/utils/URLUtils.ts
import { LaunchFilters } from "../store/filterStore";
  
  // Convert filter state to URL query params
  export const filtersToSearchParams = (filters: LaunchFilters): URLSearchParams => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.year !== null) params.set('year', filters.year.toString());
    if (filters.success !== null) params.set('success', filters.success.toString());
    if (filters.upcoming !== null) params.set('upcoming', filters.upcoming.toString());
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.order) params.set('order', filters.order);
    if (filters.page > 1) params.set('page', filters.page.toString());
    if (filters.limit !== 10) params.set('limit', filters.limit.toString());
    
    return params;
  };
  
  // Parse URL query params to filter state
  export const searchParamsToFilters = (searchParams: URLSearchParams): Partial<LaunchFilters> => {
    const filters: Partial<LaunchFilters> = {};
    
    const search = searchParams.get('search');
    const year = searchParams.get('year');
    const success = searchParams.get('success');
    const upcoming = searchParams.get('upcoming');
    const sort = searchParams.get('sort');
    const order = searchParams.get('order');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    
    if (search) filters.search = search;
    if (year) filters.year = parseInt(year, 10);
    if (success !== null) filters.success = success === 'true';
    if (upcoming !== null) filters.upcoming = upcoming === 'true';
    if (sort) filters.sort = sort;
    if (order && (order === 'asc' || order === 'desc')) filters.order = order;
    if (page) filters.page = parseInt(page, 10);
    if (limit) filters.limit = parseInt(limit, 10);
    
    return filters;
  };