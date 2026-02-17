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

      // 2. TARGET THE 'jobs' ARRAY from your sample JSON
      const apiJobs = data.jobs || []; 

      // 3. Map the specific fields from your sample to your App's Job type
      const mappedJobs = apiJobs.map((job: any) => ({
        id: generateUUID(), // Generate ID as required
        title: job.title || 'Untitled Role',
        company: job.companyName || 'Unknown Company', // Sample says 'companyName'
        
        // Sample has 'locations' as an array ["Raleigh"], we join them or take the first one
        location: Array.isArray(job.locations) ? job.locations.join(', ') : (job.locations || 'Remote'),
        
        // Format salary from min/max if available
        salary: (job.minSalary && job.maxSalary) 
          ? `${job.currency} ${job.minSalary} - ${job.maxSalary}` 
          : 'Salary not disclosed',
          
        description: job.description || 'No description available',
        type: job.jobType || 'Full-time', // Sample says 'jobType'
        isSaved: false,
      }));

      setJobs(mappedJobs);

    } catch (err) {
      console.error('Fetch error:', err);
      // Fallback Mock Data just in case
      setJobs([
        { id: generateUUID(), title: 'Head of Sales', company: 'Celonis', location: 'Raleigh', isSaved: false },
        { id: generateUUID(), title: 'Staff Engineer', company: 'Blacksky', location: 'Worldwide', isSaved: false },
        { id: generateUUID(), title: 'Part-Time CFO', company: 'Simscale', location: 'Munich', isSaved: false },
      ]);
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