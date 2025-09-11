import React from 'react';
import { Book } from '../types/book';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'var(--color-success)';
      case 'Reading':
        return 'var(--color-warning)';
      case 'To Read':
        return 'var(--color-info)';
      default:
        return 'var(--color-text-secondary)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return '✅';
      case 'Reading':
        return '📖';
      case 'To Read':
        return '📚';
      default:
        return '📄';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="card book-card">
      <div className="card__body">
        {/* Header with title and status */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: 'var(--space-12)' 
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: 'var(--font-size-lg)',
            lineHeight: 'var(--line-height-tight)',
            flex: 1
          }}>
            {book.title}
          </h3>
          <span style={{ 
            fontSize: 'var(--font-size-lg)', 
            marginLeft: 'var(--space-8)' 
          }}>
            {getStatusIcon(book.status)}
          </span>
        </div>

        {/* Author and Genre */}
        <div style={{ marginBottom: 'var(--space-12)' }}>
          <p style={{ 
            margin: 0, 
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-sm)'
          }}>
            by <strong>{book.author}</strong>
          </p>
          <p style={{ 
            margin: '2px 0 0 0', 
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-xs)'
          }}>
            {book.genre} {book.pages && `• ${book.pages} pages`}
          </p>
        </div>

        {/* Status and Progress */}
        <div style={{ marginBottom: 'var(--space-16)' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--space-8)' 
          }}>
            <span style={{ 
              color: getStatusColor(book.status), 
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)'
            }}>
              {book.status}
            </span>
            <span style={{ 
              fontSize: 'var(--font-size-sm)', 
              color: 'var(--color-text-secondary)' 
            }}>
              {book.progress}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: 'var(--color-secondary)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${book.progress}%`,
              height: '100%',
              backgroundColor: getStatusColor(book.status),
              transition: 'width var(--duration-normal) var(--ease-standard)'
            }} />
          </div>
        </div>

        {/* Dates */}
        <div style={{ 
          marginBottom: 'var(--space-16)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-secondary)'
        }}>
          <div>Added: {formatDate(book.dateAdded)}</div>
          {book.dateStarted && (
            <div>Started: {formatDate(book.dateStarted)}</div>
          )}
          {book.dateCompleted && (
            <div>Completed: {formatDate(book.dateCompleted)}</div>
          )}
        </div>

        {/* Notes Preview */}
        {book.notes && (
          <div style={{ 
            marginBottom: 'var(--space-16)',
            padding: 'var(--space-8)',
            backgroundColor: 'var(--color-bg-1)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--font-size-sm)'
          }}>
            {book.notes.length > 100 
              ? `${book.notes.substring(0, 100)}...` 
              : book.notes
            }
          </div>
        )}

        {/* Rating */}
        {book.rating && (
          <div style={{ 
            marginBottom: 'var(--space-16)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)'
          }}>
            <span style={{ fontSize: 'var(--font-size-sm)' }}>Rating:</span>
            <div>
              {Array.from({ length: 5 }, (_, i) => (
                <span 
                  key={i}
                  style={{ 
                    color: i < book.rating! ? '#ffd700' : 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)' 
                  }}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ 
          display: 'flex', 
          gap: 'var(--space-8)',
          marginTop: 'auto'
        }}>
          <button 
            className="btn btn--secondary btn--sm"
            onClick={() => onEdit(book)}
            style={{ flex: 1 }}
          >
            ✏️ Edit
          </button>
          <button 
            className="btn btn--outline btn--sm"
            onClick={() => onDelete(book.id)}
            style={{ 
              color: 'var(--color-error)',
              borderColor: 'var(--color-error)'
            }}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
