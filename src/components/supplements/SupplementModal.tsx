import React, { useState, useEffect } from 'react';
import { Supplement, SupplementCategory } from '../../types/supplements';

interface SupplementModalProps {
  supplement?: Supplement | null;
  onSave: (data: Partial<Supplement>) => void;
  onClose: () => void;
}

const SupplementModal: React.FC<SupplementModalProps> = ({ supplement, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Uncertain/Trial' as SupplementCategory,
    dosage: '',
    timing: '',
    costPerMonth: '',
    costRange: '',
    purpose: '',
    roi: '',
    currentDosage: '',
    notes: '',
    inCurrentStack: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (supplement) {
      setFormData({
        name: supplement.name || '',
        category: supplement.category || 'Uncertain/Trial',
        dosage: supplement.dosage || '',
        timing: supplement.timing || '',
        costPerMonth: supplement.costPerMonth?.toString() || '',
        costRange: supplement.costRange || '',
        purpose: supplement.purpose || '',
        roi: supplement.roi || '',
        currentDosage: supplement.currentDosage || '',
        notes: supplement.notes || '',
        inCurrentStack: supplement.inCurrentStack || false,
      });
    }
  }, [supplement]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.costPerMonth && isNaN(Number(formData.costPerMonth))) {
      newErrors.costPerMonth = 'Cost per month must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const supplementData: Partial<Supplement> = {
      name: formData.name.trim(),
      category: formData.category,
      dosage: formData.dosage.trim() || undefined,
      timing: formData.timing.trim() || undefined,
      costPerMonth: formData.costPerMonth ? Number(formData.costPerMonth) : undefined,
      costRange: formData.costRange.trim() || undefined,
      purpose: formData.purpose.trim() || undefined,
      roi: formData.roi.trim() || undefined,
      currentDosage: formData.currentDosage.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      inCurrentStack: formData.inCurrentStack,
    };

    onSave(supplementData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const categoryOptions: SupplementCategory[] = [
    'Essential Lifelong',
    'Goal-Specific',
    'Uncertain/Trial',
    'Wishlist',
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          background: '#2d2d2d',
          borderRadius: 12,
          padding: 24,
          width: '100%',
          maxWidth: 600,
          maxHeight: '90vh',
          overflow: 'auto',
          border: '1px solid #333',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 20, color: 'white' }}>
            {supplement ? 'Edit Supplement' : 'Add New Supplement'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ccc',
              cursor: 'pointer',
              fontSize: 20,
              padding: 4,
              borderRadius: 4,
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Name */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'white',
                  marginBottom: 6,
                }}
              >
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 6,
                  border: errors.name ? '1px solid #ff5459' : '1px solid #333',
                  background: '#333',
                  color: 'white',
                  fontSize: 14,
                }}
                placeholder="e.g., Vitamin D3"
              />
              {errors.name && (
                <div style={{ color: '#ff5459', fontSize: 12, marginTop: 4 }}>
                  {errors.name}
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'white',
                  marginBottom: 6,
                }}
              >
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 6,
                  border: errors.category ? '1px solid #ff5459' : '1px solid #333',
                  background: '#333',
                  color: 'white',
                  fontSize: 14,
                }}
              >
                {categoryOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div style={{ color: '#ff5459', fontSize: 12, marginTop: 4 }}>
                  {errors.category}
                </div>
              )}
            </div>

            {/* Two-column layout for dosage and timing */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'white',
                    marginBottom: 6,
                  }}
                >
                  Recommended Dosage
                </label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => handleChange('dosage', e.target.value)}
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 6,
                    border: '1px solid #333',
                    background: '#333',
                    color: 'white',
                    fontSize: 14,
                  }}
                  placeholder="e.g., 2000 IU daily"
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'white',
                    marginBottom: 6,
                  }}
                >
                  Timing
                </label>
                <input
                  type="text"
                  value={formData.timing}
                  onChange={(e) => handleChange('timing', e.target.value)}
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 6,
                    border: '1px solid #333',
                    background: '#333',
                    color: 'white',
                    fontSize: 14,
                  }}
                  placeholder="e.g., With breakfast"
                />
              </div>
            </div>

            {/* Cost information */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'white',
                    marginBottom: 6,
                  }}
                >
                  Cost per Month (₹)
                </label>
                <input
                  type="number"
                  value={formData.costPerMonth}
                  onChange={(e) => handleChange('costPerMonth', e.target.value)}
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 6,
                    border: errors.costPerMonth ? '1px solid #ff5459' : '1px solid #333',
                    background: '#333',
                    color: 'white',
                    fontSize: 14,
                  }}
                  placeholder="500"
                />
                {errors.costPerMonth && (
                  <div style={{ color: '#ff5459', fontSize: 12, marginTop: 4 }}>
                    {errors.costPerMonth}
                  </div>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'white',
                    marginBottom: 6,
                  }}
                >
                  Cost Range (if uncertain)
                </label>
                <input
                  type="text"
                  value={formData.costRange}
                  onChange={(e) => handleChange('costRange', e.target.value)}
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 6,
                    border: '1px solid #333',
                    background: '#333',
                    color: 'white',
                    fontSize: 14,
                  }}
                  placeholder="₹300-600"
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'white',
                  marginBottom: 6,
                }}
              >
                Purpose
              </label>
              <textarea
                value={formData.purpose}
                onChange={(e) => handleChange('purpose', e.target.value)}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid #333',
                  background: '#333',
                  color: 'white',
                  fontSize: 14,
                  minHeight: 60,
                  resize: 'vertical',
                }}
                placeholder="What is this supplement for? e.g., Bone health, immune system support"
              />
            </div>

            {/* ROI */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'white',
                  marginBottom: 6,
                }}
              >
                ROI (Return on Investment)
              </label>
              <textarea
                value={formData.roi}
                onChange={(e) => handleChange('roi', e.target.value)}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid #333',
                  background: '#333',
                  color: 'white',
                  fontSize: 14,
                  minHeight: 60,
                  resize: 'vertical',
                }}
                placeholder="Expected benefits and improvements"
              />
            </div>

            {/* Current Dosage */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'white',
                  marginBottom: 6,
                }}
              >
                Current Dosage (if different from recommended)
              </label>
              <input
                type="text"
                value={formData.currentDosage}
                onChange={(e) => handleChange('currentDosage', e.target.value)}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid #333',
                  background: '#333',
                  color: 'white',
                  fontSize: 14,
                }}
                placeholder="e.g., 1000 IU daily"
              />
            </div>

            {/* Notes */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'white',
                  marginBottom: 6,
                }}
              >
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid #333',
                  background: '#333',
                  color: 'white',
                  fontSize: 14,
                  minHeight: 60,
                  resize: 'vertical',
                }}
                placeholder="Additional notes, side effects, observations, etc."
              />
            </div>

            {/* In Current Stack */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.inCurrentStack}
                  onChange={(e) => handleChange('inCurrentStack', e.target.checked)}
                  style={{
                    width: 16,
                    height: 16,
                  }}
                />
                <span style={{ fontSize: 14, color: 'white' }}>
                  Add to current stack
                </span>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 12,
              marginTop: 24,
              borderTop: '1px solid #333',
              paddingTop: 24,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: 6,
                border: '1px solid #333',
                background: 'transparent',
                color: 'white',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                borderRadius: 6,
                border: 'none',
                background: '#4caf50',
                color: 'white',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {supplement ? 'Update Supplement' : 'Add Supplement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplementModal;