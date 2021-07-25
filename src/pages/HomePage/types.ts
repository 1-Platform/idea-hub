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
