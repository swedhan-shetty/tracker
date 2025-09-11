import React, { useState, useEffect } from 'react';
import { Book, BookStatus, AddBookFormData } from '../types/book';

interface AddBookModalProps {
  book?: Book | null;
  onSave: (bookData: AddBookFormData) => void;
  onClose: () => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ book, onSave, onClose }) => {
  const [formData, setFormData] = useState<AddBookFormData>({
    title: '',
    author: '',
    genre: '',
    pages: null,
    status: 'To Read',
    progress: 0,
    notes: ''
  });

  // Populate form if editing
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        pages: book.pages,
        status: book.status,
        progress: book.progress,
        notes: book.notes
      });
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.author.trim() || !formData.genre.trim()) {
      alert('Please fill in all required fields (Title, Author, Genre)');
      return;
    }

    onSave(formData);
  };

  const handleInputChange = (field: keyof AddBookFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Close modal on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--space-16)'
      }}
    >
      <div 
        className="modal-content card"
        style={{
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div className="card__body">
          {/* Modal Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--space-24)' 
          }}>
            <h2 style={{ margin: 0 }}>
              {book ? 'Edit Book' : 'Add New Book'}
            </h2>
            <button 
              className="btn btn--secondary btn--sm"
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label">
                Title *
              </label>
              <input
                type="text"
                className="form-control"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter book title"
                required
              />
            </div>

            {/* Author */}
            <div className="form-group">
              <label className="form-label">
                Author *
              </label>
              <input
                type="text"
                className="form-control"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>

            {/* Genre */}
            <div className="form-group">
              <label className="form-label">
                Genre *
              </label>
              <input
                type="text"
                className="form-control"
                value={formData.genre}
                onChange={(e) => handleInputChange('genre', e.target.value)}
                placeholder="e.g. Fiction, Self-Help, Science"
                required
              />
            </div>

            {/* Pages */}
            <div className="form-group">
              <label className="form-label">
                Pages
              </label>
              <input
                type="number"
                className="form-control"
                value={formData.pages || ''}
                onChange={(e) => handleInputChange('pages', e.target.value ? parseInt(e.target.value) : null)}
                placeholder="e.g. 300"
                min="1"
              />
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label">
                Status
              </label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as BookStatus)}
              >
                <option value="To Read">To Read</option>
                <option value="Reading">Currently Reading</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Progress */}
            <div className="form-group">
              <label className="form-label">
                Progress ({formData.progress}%)
              </label>
              <input
                type="range"
                className="slider"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => handleInputChange('progress', parseInt(e.target.value))}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--space-4)'
              }}>
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">
                Notes
              </label>
              <textarea
                className="notes-textarea"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Your thoughts, quotes, or reviews about this book..."
                rows={4}
              />
              <small style={{ 
                fontSize: 'var(--font-size-xs)', 
                color: 'var(--color-text-secondary)' 
              }}>
                Share your thoughts about this book
              </small>
            </div>

            {/* Actions */}
            <div style={{ 
              display: 'flex', 
              gap: 'var(--space-12)',
              justifyContent: 'flex-end',
              marginTop: 'var(--space-24)' 
            }}>
              <button 
                type="button"
                className="btn btn--secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn btn--primary"
              >
                {book ? 'Update Book' : 'Save Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookModal;
