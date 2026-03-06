import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Job } from '../types';

interface JobContextType {
  savedJobs: Job[];
  saveJob: (job: Job) => void;
  removeJob: (jobId: string) => void; // 👈 Back to string
  isJobSaved: (jobId: string) => boolean; // 👈 Back to string

  appliedJobIds: string[];
  applyToJob: (jobId: string) => void;
  hasAppliedToJob: (jobId: string) => boolean;
}

const JobContext = createContext<JobContextType | undefined>(undefined);
const SAVED_JOBS_KEY = '@my_saved_jobs';
const APPLIED_JOBS_KEY = '@my_applied_jobs';

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        const storedJobs = await AsyncStorage.getItem(SAVED_JOBS_KEY);
        if (storedJobs) setSavedJobs(JSON.parse(storedJobs));

        const storedApplied = await AsyncStorage.getItem(APPLIED_JOBS_KEY);
        if (storedApplied) setAppliedJobIds(JSON.parse(storedApplied));
      } catch (error) {
        console.error('Failed to load saved jobs', error);
      }
    };
    loadSavedJobs();
  }, []);

  const saveJob = (job: Job) => {
    setSavedJobs((prevJobs) => {
      if (prevJobs.some((savedJob) => savedJob.id === job.id)) return prevJobs;
      const updatedJobs = [...prevJobs, { ...job, isSaved: true }];
      AsyncStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updatedJobs));
      return updatedJobs;
    });
  };

  const removeJob = (jobId: string) => {
    setSavedJobs((prevJobs) => {
      const updatedJobs = prevJobs.filter((job) => job.id !== jobId);
      AsyncStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updatedJobs));
      return updatedJobs;
    });
  };

  const isJobSaved = (jobId: string): boolean => {
    return savedJobs.some((job) => job.id === jobId);
  };

  const applyToJob = (jobId: string) => {
    setAppliedJobIds((prevIds) => {
      if (prevIds.includes(jobId)) return prevIds; // Already applied
      const updatedIds = [...prevIds, jobId];
      AsyncStorage.setItem(APPLIED_JOBS_KEY, JSON.stringify(updatedIds));
      return updatedIds;
    });
  };

  const hasAppliedToJob = (jobId: string): boolean => {
    return appliedJobIds.includes(jobId);
  };
  
  return (
    <JobContext.Provider value={{ savedJobs, saveJob, removeJob, isJobSaved, appliedJobIds, applyToJob, hasAppliedToJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = (): JobContextType => {
  const context = useContext(JobContext);
  if (!context) throw new Error('useJobs must be used within a JobProvider');
  return context;
};