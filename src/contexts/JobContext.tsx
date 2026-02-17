import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Job } from '../types';

interface JobContextType {
  savedJobs: Job[];
  saveJob: (job: Job) => void;
  removeJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  const saveJob = (job: Job) => {
    setSavedJobs((prevJobs) => {
      // Prevent duplicates
      const exists = prevJobs.some((savedJob) => savedJob.id === job.id);
      if (exists) {
        return prevJobs;
      }
      return [...prevJobs, { ...job, isSaved: true }];
    });
  };

  const removeJob = (jobId: string) => {
    setSavedJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  };

  const isJobSaved = (jobId: string): boolean => {
    return savedJobs.some((job) => job.id === jobId);
  };

  return (
    <JobContext.Provider value={{ savedJobs, saveJob, removeJob, isJobSaved }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = (): JobContextType => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};