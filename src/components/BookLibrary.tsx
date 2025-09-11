import React from 'react';
import { Book, BookStatus } from '../types/book';
import BookCard from './BookCard';

interface BookLibraryProps {
  books: Book[];
  searchTerm: string;
  statusFilter: BookStatus | '';
  sortBy: string;
  totalBooks: number;
  onSearchChange: (term: string) => void;
  onStatusFilterChange: (status: BookStatus | '') => void;
  onSortChange: (sortBy: string) => void;
  onAddBook: () => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (bookId: string) => void;
}

const BookLibrary: React.FC<BookLibraryProps> = ({
  books,
  searchTerm,
  statusFilter,
  sortBy,
  totalBooks,
  onSearchChange,
  onStatusFilterChange,
  onSortChange,
  onAddBook,
  onEditBook,
  onDeleteBook
}) => {
  return (
    <div className="book-library">
      {/* Controls */}
      <div className="card" style={{ marginBottom: 'var(--space-24)' }}>
        <div className="card__body">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            gap: 'var(--space-16)',
            marginBottom: 'var(--space-16)' 
          }}>
            <button 
              className="btn btn--primary"
              onClick={onAddBook}
            >
              + Add Book
            </button>
            
            <div style={{ 
              display: 'flex', 
              gap: 'var(--space-12)', 
              flex: 1,
              maxWidth: '600px' 
            }}>
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="form-control"
                style={{ flex: 1 }}
              />
              
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value as BookStatus | '')}
                className="form-control"
              >
                <option value="">All Status</option>
                <option value="To Read">To Read</option>
                <option value="Reading">Currently Reading</option>
                <option value="Completed">Completed</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="form-control"
              >
                <option value="dateAdded">Date Added</option>
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="status">Status</option>
                <option value="progress">Progress</option>
              </select>
            </div>
          </div>
          
          <div style={{ 
            color: 'var(--color-text-secondary)', 
            fontSize: 'var(--font-size-sm)' 
          }}>
            {books.length === totalBooks 
              ? `Showing all ${totalBooks} books`
              : `Showing ${books.length} of ${totalBooks} books`
            }
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {books.length > 0 ? (
        <div className="dashboard-grid" style={{ 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 'var(--space-20)' 
        }}>
          {books.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={onEditBook}
              onDelete={onDeleteBook}
            />
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="card__body" style={{ 
            textAlign: 'center', 
            padding: 'var(--space-32)' 
          }}>
            <h3 style={{ color: 'var(--color-text-secondary)' }}>No books found</h3>
            <p style={{ 
              color: 'var(--color-text-secondary)', 
              marginBottom: 'var(--space-16)' 
            }}>
              {totalBooks === 0 
                ? 'Start building your library by adding your first book!'
                : 'Try adjusting your search or filters.'
              }
            </p>
            {totalBooks === 0 && (
              <button className="btn btn--primary" onClick={onAddBook}>
                Add Your First Book
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookLibrary;
