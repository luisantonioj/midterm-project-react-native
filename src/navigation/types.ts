import { Job } from '../types';

export type RootStackParamList = {
  MainTabs: undefined;
  ApplicationForm: {
    job: Job;
    fromSaved: boolean;
  };
};

export type MainTabParamList = {
  JobFinder: undefined;
  SavedJobs: undefined;
};