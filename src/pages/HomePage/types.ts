/* eslint-disable @typescript-eslint/no-explicit-any */
import { TagDoc } from 'pouchDB/types';

export interface CreateNewIdea {
  title: string;
  description: string;
  tags: {
    name: string;
  }[];
}

export interface TabType {
  tabIndex: number;
  tabName: 'recent' | 'popular';
}

export interface Filter {
  author: string | null;
  category: string;
}

export interface TagCount {
  isLoading: boolean;
  data: Array<{
    id: any;
    key: any;
    value: any;
    doc?: PouchDB.Core.ExistingDocument<TagDoc & PouchDB.Core.AllDocsMeta>;
  }>;
}
