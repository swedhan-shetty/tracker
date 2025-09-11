import React, { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import { Book, BookStatus, AddBookFormData } from '../types/book';
import BookLibrary from './BookLibrary';
import BookStats from './BookStats';
import AddBookModal from './AddBookModal';

type BookView = 'library' | 'stats';

const BookTracker: React.FC = () => {
  const {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    getBookStats,
    getFilteredBooks
  } = useBooks();

  const [currentView, setCurrentView] = useState<BookView>('library');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookStatus | ''>('');
  const [sortBy, setSortBy] = useState('dateAdded');

  const handleAddBook = (bookData: AddBookFormData) => {
    if (editingBook) {
      updateBook(editingBook.id, bookData);
      setEditingBook(null);
    } else {
      addBook(bookData);
    }
    setIsAddModalOpen(false);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setIsAddModalOpen(true);
  };

  const handleDeleteBook = (bookId: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook(bookId);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingBook(null);
  };

  const filteredBooks = getFilteredBooks(searchTerm, statusFilter, sortBy);
  const stats = getBookStats();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <div style={{ color: 'var(--color-text-secondary)' }}>Loading books...</div>
      </div>
    );
  }

  return (
    <div className="book-tracker">
      {/* Navigation */}
      <div className="section-header" style={{ marginBottom: 'var(--space-24)' }}>
        <div>
          <h1>📚 Book Library</h1>
          <p style={{ 
            margin: '0.5rem 0 0 0', 
            color: 'var(--color-text-secondary)', 
            fontSize: 'var(--font-size-sm)' 
          }}>
            Track your reading journey
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
          <button
            className={`btn ${currentView === 'library' ? 'btn--primary' : 'btn--secondary'}`}
            onClick={() => setCurrentView('library')}
          >
            📖 Library
          </button>
          <button
            className={`btn ${currentView === 'stats' ? 'btn--primary' : 'btn--secondary'}`}
            onClick={() => setCurrentView('stats')}
          >
            📊 Statistics
          </button>
        </div>
      </div>

      {/* Library View */}
      {currentView === 'library' && (
        <BookLibrary
          books={filteredBooks}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          sortBy={sortBy}
          totalBooks={books.length}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
          onSortChange={setSortBy}
          onAddBook={() => setIsAddModalOpen(true)}
          onEditBook={handleEditBook}
          onDeleteBook={handleDeleteBook}
        />
      )}

      {/* Statistics View */}
      {currentView === 'stats' && (
        <BookStats stats={stats} />
      )}

      {/* Add/Edit Book Modal */}
      {isAddModalOpen && (
        <AddBookModal
          book={editingBook}
          onSave={handleAddBook}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default BookTracker;
