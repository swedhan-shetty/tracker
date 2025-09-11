export type BookStatus = 'To Read' | 'Reading' | 'Completed';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  pages: number | null;
  status: BookStatus;
  progress: number; // 0-100 percentage
  dateAdded: string; // ISO date string
  dateStarted: string | null; // ISO date string
  dateCompleted: string | null; // ISO date string
  notes: string;
  rating: number | null; // 1-5 stars
}

export interface BookFilters {
  searchTerm: string;
  status: BookStatus | '';
  genre: string;
}

export type BookSortOption = 'dateAdded' | 'title' | 'author' | 'status' | 'progress';

export interface BookStats {
  total: number;
  completed: number;
  reading: number;
  toRead: number;
  totalPages: number;
  pagesRead: number;
  genreBreakdown: Record<string, number>;
}

export interface AddBookFormData {
  title: string;
  author: string;
  genre: string;
  pages: number | null;
  status: BookStatus;
  progress: number;
  notes: string;
}
