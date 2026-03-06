import { useState, useEffect, useCallback, useRef } from 'react';
import { Job } from '../types';
import { API_BASE_URL } from '../constants/theme';
import { generateUUID } from '../utils/uuid';

interface UseJobsReturn {
  jobs: Job[];
  loading: boolean;
  isFetchingNextPage: boolean; 
  error: string | null;
  refreshJobs: () => void;
  fetchNextPage: () => void;
  hasMore: boolean; // 
}

export const useJobsAPI = (): UseJobsReturn => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Use a ref to keep track of seeds so we NEVER get duplicate IDs across pages
  const seenSeeds = useRef<Set<string>>(new Set());

  const fetchJobs = async (pageNumber: number = 1, isRefresh: boolean = false) => {
    if (isRefresh) {
      setLoading(true);
      setPage(1);
      setHasMore(true);
      seenSeeds.current.clear(); // Reset tracker on refresh
    } else {
      setIsFetchingNextPage(true);
    }
    
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}?page=${pageNumber}`, {
         headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API Connection Failed: ${response.status}`);
      }

      const data = await response.json();
      const apiJobs = data.jobs || []; 

      if (apiJobs.length === 0) {
        setHasMore(false); 
      } else {
        const mappedJobs = apiJobs.map((job: any) => {
          const baseString = `${job.title || 'unknown'}-${job.companyName || 'unknown'}`;
          let uniqueString = baseString;
          let counter = 1;

          while (seenSeeds.current.has(uniqueString)) {
            uniqueString = `${baseString}-${counter}`;
            counter++;
          }
          seenSeeds.current.add(uniqueString);

          return {
            id: generateUUID(uniqueString), 
            title: job.title || 'Untitled Role',
            company: job.companyName || 'Unknown Company',
            companyLogo: job.companyLogo, 
            mainCategory: job.mainCategory,
            jobType: job.jobType,
            workModel: job.workModel,
            seniorityLevel: job.seniorityLevel,
            salaryMin: job.minSalary,
            salaryMax: job.maxSalary,
            currency: job.currency,
            locations: job.locations || [], 
            tags: job.tags || [],
            description: job.description || '',
            isSaved: false,
          };
        });

        if (isRefresh) {
          setJobs(mappedJobs); // Replace list
        } else {
          setJobs(prev => [...prev, ...mappedJobs]); // Append to bottom of list
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      setIsFetchingNextPage(false);
    }
  };

  const refreshJobs = useCallback(() => {
    fetchJobs(1, true);
  }, []);

  const fetchNextPage = useCallback(() => {
    // Only fetch if we aren't already fetching, and if the API still has more data
    if (!loading && !isFetchingNextPage && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchJobs(nextPage, false);
    }
  }, [loading, isFetchingNextPage, hasMore, page]);

  useEffect(() => {
    fetchJobs(1, true);
  }, []);

  return { jobs, loading, isFetchingNextPage, error, refreshJobs, fetchNextPage, hasMore };
};