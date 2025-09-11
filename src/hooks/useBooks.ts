import { useState, useEffect } from 'react';
import { Book, BookStatus, AddBookFormData, BookStats } from '../types/book';

// Sample data for initial setup
const initialBooks: Book[] = [
  {
    id: '1',
    title: 'The 48 Laws of Power',
    author: 'Robert Greene',
    genre: 'Self-Help',
    pages: 452,
    status: 'To Read',
    progress: 0,
    dateAdded: '2025-08-30',
    dateStarted: null,
    dateCompleted: null,
    notes: '',
    rating: null
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    pages: 320,
    status: 'Reading',
    progress: 45,
    dateAdded: '2025-08-31',
    dateStarted: '2025-09-01',
    dateCompleted: null,
    notes: 'Great insights on habit formation. The 1% better concept is powerful.',
    rating: null
  },
  {
    id: '3',
    title: 'Siddhartha',
    author: 'Hermann Hesse',
    genre: 'Fiction',
    pages: 152,
    status: 'Completed',
    progress: 100,
    dateAdded: '2025-08-15',
    dateStarted: '2025-08-20',
    dateCompleted: '2025-08-25',
    notes: 'A profound journey of self-discovery. Beautiful prose and timeless wisdom.',
    rating: 5
  }
];

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Load books from localStorage on init
  useEffect(() => {
    try {
      const savedBooks = localStorage.getItem('books');
      if (savedBooks) {
        setBooks(JSON.parse(savedBooks));
      } else {
        // If no saved books, use initial sample data
        setBooks(initialBooks);
        localStorage.setItem('books', JSON.stringify(initialBooks));
      }
    } catch (error) {
      console.error('Error loading books from localStorage:', error);
      setBooks(initialBooks);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save books to localStorage whenever books change
  useEffect(() => {
    if (!loading && books.length >= 0) {
      try {
        localStorage.setItem('books', JSON.stringify(books));
      } catch (error) {
        console.error('Error saving books to localStorage:', error);
      }
    }
  }, [books, loading]);

  // Add a new book
  const addBook = (bookData: AddBookFormData): void => {
    const newBook: Book = {
      id: `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...bookData,
      dateAdded: new Date().toISOString().split('T')[0],
      dateStarted: bookData.status === 'Reading' ? new Date().toISOString().split('T')[0] : null,
      dateCompleted: bookData.status === 'Completed' ? new Date().toISOString().split('T')[0] : null,
      rating: null
    };

    setBooks(prevBooks => [...prevBooks, newBook]);
  };

  // Update an existing book
  const updateBook = (id: string, bookData: Partial<AddBookFormData>): void => {
    setBooks(prevBooks => prevBooks.map(book => {
      if (book.id !== id) return book;

      const oldStatus = book.status;
      const newStatus = bookData.status || book.status;

      return {
        ...book,
        ...bookData,
        dateStarted: newStatus === 'Reading' && oldStatus !== 'Reading' 
          ? new Date().toISOString().split('T')[0] 
          : book.dateStarted,
        dateCompleted: newStatus === 'Completed' && oldStatus !== 'Completed'
          ? new Date().toISOString().split('T')[0]
          : newStatus !== 'Completed' ? null : book.dateCompleted
      };
    }));
  };

  // Delete a book
  const deleteBook = (id: string): void => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
  };

  // Get book by ID
  const getBookById = (id: string): Book | undefined => {
    return books.find(book => book.id === id);
  };

  // Calculate statistics
  const getBookStats = (): BookStats => {
    const stats: BookStats = {
      total: books.length,
      completed: 0,
      reading: 0,
      toRead: 0,
      totalPages: 0,
      pagesRead: 0,
      genreBreakdown: {}
    };

    books.forEach(book => {
      // Status counts
      switch (book.status) {
        case 'Completed':
          stats.completed++;
          break;
        case 'Reading':
          stats.reading++;
          break;
        case 'To Read':
          stats.toRead++;
          break;
      }

      // Pages calculation
      if (book.pages) {
        stats.totalPages += book.pages;
        stats.pagesRead += Math.round((book.pages * book.progress) / 100);
      }

      // Genre breakdown
      const genre = book.genre || 'Unknown';
      stats.genreBreakdown[genre] = (stats.genreBreakdown[genre] || 0) + 1;
    });

    return stats;
  };

  // Filter and sort books
  const getFilteredBooks = (
    searchTerm: string = '',
    statusFilter: BookStatus | '' = '',
    sortBy: string = 'dateAdded'
  ): Book[] => {
    let filtered = [...books];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search) ||
        book.genre.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(book => book.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'progress':
          return b.progress - a.progress;
        case 'dateAdded':
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });

    return filtered;
  };

  return {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
    getBookStats,
    getFilteredBooks
  };
};
