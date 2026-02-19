import { useState, useEffect } from 'react';
import { Job } from '../types';
import { API_BASE_URL } from '../constants/theme';
import { generateUUID } from '../utils/uuid';

interface UseJobsReturn {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  refreshJobs: () => void;
}

export const useJobsAPI = (): UseJobsReturn => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch from the Empllo API
      const response = await fetch(`${API_BASE_URL}`, {
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

      // 1. Create a tracker for seeds we have already used
      const seenSeeds = new Set<string>();

      const mappedJobs = apiJobs.map((job: any) => {
        
        // 2. Create the base string
        const baseString = `${job.title || 'unknown'}-${job.companyName || 'unknown'}`;
        let uniqueString = baseString;
        let counter = 1;

        // 3. If we already used this string, add a counter to make it unique (e.g., "-1", "-2")
        while (seenSeeds.has(uniqueString)) {
          uniqueString = `${baseString}-${counter}`;
          counter++;
        }
        
        // Mark this string as used
        seenSeeds.add(uniqueString);

        return {
          id: generateUUID(uniqueString), // 4. Generate the fixed UUID with the guaranteed unique string
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

      setJobs(mappedJobs);

    } catch (err) {
      console.error('Fetch error:', err);
      // Fallback Mock Data just in case
      // setJobs([
      //   { id: generateUUID(), title: 'Head of Sales', company: 'Celonis', location: 'Raleigh', isSaved: false },
      //   { id: generateUUID(), title: 'Staff Engineer', company: 'Blacksky', location: 'Worldwide', isSaved: false },
      //   { id: generateUUID(), title: 'Part-Time CFO', company: 'Simscale', location: 'Munich', isSaved: false },
      // ]);
      // Optional: Set error if you want to show the red warning
      // setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return { jobs, loading, error, refreshJobs: fetchJobs };
};