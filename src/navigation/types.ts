import { Job } from '../types';

export type RootStackParamList = {
  MainTabs: { screen: string } | undefined;
  ApplicationForm: {
    job: Job;
    fromSaved: boolean;
  };
  JobDetails: { job: Job };
};

export type MainTabParamList = {
  JobFinder: undefined;
  SavedJobs: undefined;
};