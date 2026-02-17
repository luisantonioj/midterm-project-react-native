import { useState, useEffect } from 'react';
import axios from 'axios';
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
      
      const response = await axios.get(`${API_BASE_URL}/jobs`);
      
      // Add unique IDs to each job since API doesn't provide them
      const jobsWithIds = response.data.map((job: any) => ({
        ...job,
        id: generateUUID(),
        title: job.title || 'Untitled Position',
        company: job.company || 'Unknown Company',
        salary: job.salary || 'Not specified',
        location: job.location || 'Remote',
        description: job.description || 'No description available',
        type: job.type || 'Full-time',
        isSaved: false,
      }));
      
      setJobs(jobsWithIds);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const refreshJobs = () => {
    fetchJobs();
  };

  return { jobs, loading, error, refreshJobs };
};