import { useState, useMemo } from 'react';
import { Job } from '../types';

interface UseSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredJobs: Job[];
}

export const useSearch = (jobs: Job[]): UseSearchReturn => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) {
      return jobs;
    }

    const query = searchQuery.toLowerCase();
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.type?.toLowerCase().includes(query)
    );
  }, [jobs, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredJobs,
  };
};