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
  hasMore: boolean; 
}

export const useJobsAPI = (): UseJobsReturn => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const seenSeeds = useRef<Set<string>>(new Set());

  const fetchJobs = async (pageNumber: number = 1, isRefresh: boolean = false) => {
    if (isRefresh) {
      setLoading(true);
      setPage(1);
      setHasMore(true);
      seenSeeds.current.clear(); 
    } else {
      setIsFetchingNextPage(true);
    }
    
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}?page=${pageNumber}`, {
         headers: {
          'User-Agent': 'Mozilla/5.0',
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
        const strictlyUniqueJobs: Job[] = [];
        let newJobsFound = false;

        for (const job of apiJobs) {
          const jobLocations = job.locations ? job.locations.join(',') : 'Remote';
          
          // Make fingerprint highly specific so legitimate similar roles don't collide
          const jobFingerprint = `${job.title || 'unknown'}-${job.companyName || 'unknown'}-${jobLocations}-${job.description?.length || 0}`;
          
          if (!seenSeeds.current.has(jobFingerprint)) {
            seenSeeds.current.add(jobFingerprint); 
            newJobsFound = true;

            strictlyUniqueJobs.push({
              id: generateUUID(jobFingerprint), 
              title: job.title || 'Untitled Role',
              company: job.companyName || 'Unknown Company',
              companyLogo: job.companyLogo, 
              mainCategory: job.mainCategory,
              jobType: job.jobType,
              workModel: job.workModel,
              seniorityLevel: job.seniorityLevel,
              salary: job.salary || '',
              salaryMin: job.minSalary,
              salaryMax: job.maxSalary,
              currency: job.currency,
              locations: job.locations || [], 
              tags: job.tags || [],
              description: job.description || '',
              isSaved: false,
            });
          }
        }

        // Stop the 429 Loop! If the API just returned data we already saw, shut it down.
        if (!newJobsFound && !isRefresh) {
            setHasMore(false);
        }

        if (isRefresh) {
          setJobs(strictlyUniqueJobs); 
        } else if (newJobsFound) {
          // Stop the React Duplicate Key Crash! Final safety check before appending.
          setJobs(prev => {
            const existingIds = new Set(prev.map(j => j.id));
            const safeNewJobs = strictlyUniqueJobs.filter(j => !existingIds.has(j.id));
            return [...prev, ...safeNewJobs];
          });
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
      // Immediately kill the infinite loop if the API throws an error
      setHasMore(false); 
    } finally {
      setLoading(false);
      setIsFetchingNextPage(false);
    }
  };

  const refreshJobs = useCallback(() => {
    fetchJobs(1, true);
  }, []);

  const fetchNextPage = useCallback(() => {
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