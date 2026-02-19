import { useState, useMemo } from 'react';
import { Job } from '../types';

export interface FilterState {
  jobType: string[];
  workModel: string[];
  seniorityLevel: string[];
  sortBy: 'none' | 'salary-high' | 'salary-low';
}

interface UseSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredJobs: Job[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  removeFilter: (category: keyof FilterState, value: string) => void;
}

export const useSearch = (jobs: Job[]): UseSearchReturn => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [filters, setFilters] = useState<FilterState>({
    jobType: [],
    workModel: [],
    seniorityLevel: [],
    sortBy: 'none',
  });

  const removeFilter = (category: keyof FilterState, value: string) => {
    if (category === 'sortBy') {
      setFilters(prev => ({ ...prev, sortBy: 'none' }));
    } else {
      setFilters(prev => ({
        ...prev,
        [category]: (prev[category] as string[]).filter(item => item !== value)
      }));
    }
  };

  const filteredJobs = useMemo(() => {
    let result = jobs;

    // 1. Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.location?.toLowerCase().includes(query)
      );
    }

    // 2. Category Filters
    if (filters.jobType.length > 0) {
      result = result.filter(job => job.jobType && filters.jobType.includes(job.jobType));
    }
    if (filters.workModel.length > 0) {
      result = result.filter(job => job.workModel && filters.workModel.includes(job.workModel));
    }
    if (filters.seniorityLevel.length > 0) {
      result = result.filter(job => job.seniorityLevel && filters.seniorityLevel.includes(job.seniorityLevel));
    }

    // 3. Sorting
    if (filters.sortBy === 'salary-high') {
      result = [...result].sort((a, b) => (b.salaryMin || 0) - (a.salaryMin || 0));
    } else if (filters.sortBy === 'salary-low') {
      result = [...result].sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
    }

    return result;
  }, [jobs, searchQuery, filters]);

  return {
    searchQuery,
    setSearchQuery,
    filteredJobs,
    filters,
    setFilters,
    removeFilter,
  };
};