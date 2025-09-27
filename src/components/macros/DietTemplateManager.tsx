import React, { useState } from 'react';
import { useDietTemplates, macroPresets, calculateMacrosFromPreset } from '../../hooks/useDietTemplates';
import { DietTemplate, MacroPreset, NutritionInfo } from '../../types/nutrition';

interface DietTemplateManagerProps {
  className?: string;
  onTemplateSelected?: (template: DietTemplate | null) => void;
  compact?: boolean;
}

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Omit<DietTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingTemplate?: DietTemplate | null;
}

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#333',
          color: 'white',
          padding: '8px 12px',
          borderRadius: 6,
          fontSize: 12,
          whiteSpace: 'nowrap',
          zIndex: 1000,
          marginBottom: 5,
        }}>
          {text}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid #333',
          }} />
        </div>
      )}
    </div>
  );
};

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingTemplate 
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    macroTargets: NutritionInfo;
    color: string;
    tags: string;
    usePreset: boolean;
    selectedPreset: string;
    bodyWeight: number;
    totalCalories: number;
  }>(() => ({
    name: editingTemplate?.name || '',
    description: editingTemplate?.description || '',
    startDate: editingTemplate?.period.startDate || new Date().toISOString().split('T')[0],
    endDate: editingTemplate?.period.endDate || '',
    macroTargets: editingTemplate?.macroTargets || { calories: 2000, protein: 150, carbs: 200, fat: 70, fiber: 25 },
    color: editingTemplate?.color || '#3498db',
    tags: editingTemplate?.tags?.join(', ') || '',
    usePreset: false,
    selectedPreset: 'balanced',
    bodyWeight: 70,
    totalCalories: 2000,
  }));

  const handlePresetChange = (presetId: string) => {
    const preset = macroPresets.find(p => p.id === presetId);
    if (preset && formData.usePreset) {
      const calculatedMacros = calculateMacrosFromPreset(preset, formData.totalCalories, formData.bodyWeight);
      setFormData(prev => ({
        ...prev,
        selectedPreset: presetId,
        macroTargets: calculatedMacros,
        color: getColorByCategory(preset.category),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const template: Omit<DietTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name,
      description: formData.description || undefined,
      period: {
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
      },
      macroTargets: formData.macroTargets,
      color: formData.color,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isActive: false,
    };

    onSave(template);
    onClose();
  };

  const getColorByCategory = (category: string) => {
    const colorMap: Record<string, string> = {
      cut: '#e74c3c',
      bulk: '#2ecc71',
      maintain: '#3498db',
      athletic: '#f39c12',
      custom: '#9b59b6',
    };
    return colorMap[category] || colorMap.custom;
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#1a1a1a',
        padding: 24,
        borderRadius: 12,
        width: '90%',
        maxWidth: 600,
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        <h2 style={{ margin: '0 0 20px 0' }}>
          {editingTemplate ? 'Edit Template' : 'Create New Diet Template'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600 }}>
                Template Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., September Cut, Winter Bulk"
                required
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #333', background: '#333', color: 'white' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600 }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description of goals or notes"
                rows={2}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #333', background: '#333', color: 'white' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600 }}>
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #333', background: '#333', color: 'white' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600 }}>
                  End Date (optional)
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #333', background: '#333', color: 'white' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <input
                  type="checkbox"
                  checked={formData.usePreset}
                  onChange={e => setFormData(prev => ({ ...prev, usePreset: e.target.checked }))}
                />
                <span style={{ fontSize: 14, fontWeight: 600 }}>Use Macro Preset</span>
                <Tooltip text="Calculate macros automatically based on common splits">
                  <span style={{ cursor: 'help' }}>ℹ️</span>
                </Tooltip>
              </label>

              {formData.usePreset && (
                <div style={{ display: 'grid', gap: 12, padding: 16, background: '#222', borderRadius: 8, marginBottom: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600 }}>
                        Body Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={formData.bodyWeight}
                        onChange={e => setFormData(prev => ({ ...prev, bodyWeight: Number(e.target.value) }))}
                        min="30"
                        max="200"
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #444', background: '#444', color: 'white' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600 }}>
                        Total Calories
                      </label>
                      <input
                        type="number"
                        value={formData.totalCalories}
                        onChange={e => setFormData(prev => ({ ...prev, totalCalories: Number(e.target.value) }))}
                        min="1000"
                        max="5000"
                        step="50"
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #444', background: '#444', color: 'white' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600 }}>
                        Macro Split
                      </label>
                      <select
                        value={formData.selectedPreset}
                        onChange={e => handlePresetChange(e.target.value)}
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #444', background: '#444', color: 'white' }}
                      >
                        {macroPresets.map(preset => (
                          <option key={preset.id} value={preset.id}>
                            {preset.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePresetChange(formData.selectedPreset)}
                    style={{ padding: '8px 16px', background: '#4caf50', border: 'none', borderRadius: 4, color: 'white', cursor: 'pointer' }}
                  >
                    Calculate Macros from Preset
                  </button>
                </div>
              )}
            </div>

            <div>
              <h4 style={{ margin: '0 0 12px 0' }}>Macro Targets</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Calories</label>
                  <input
                    type="number"
                    value={formData.macroTargets.calories}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      macroTargets: { ...prev.macroTargets, calories: Number(e.target.value) }
                    }))}
                    min="0"
                    style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #333', background: '#333', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Protein (g)</label>
                  <input
                    type="number"
                    value={formData.macroTargets.protein}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      macroTargets: { ...prev.macroTargets, protein: Number(e.target.value) }
                    }))}
                    min="0"
                    step="0.1"
                    style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #333', background: '#333', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Carbs (g)</label>
                  <input
                    type="number"
                    value={formData.macroTargets.carbs}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      macroTargets: { ...prev.macroTargets, carbs: Number(e.target.value) }
                    }))}
                    min="0"
                    step="0.1"
                    style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #333', background: '#333', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Fat (g)</label>
                  <input
                    type="number"
                    value={formData.macroTargets.fat}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      macroTargets: { ...prev.macroTargets, fat: Number(e.target.value) }
                    }))}
                    min="0"
                    step="0.1"
                    style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #333', background: '#333', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Fiber (g)</label>
                  <input
                    type="number"
                    value={formData.macroTargets.fiber || 0}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      macroTargets: { ...prev.macroTargets, fiber: Number(e.target.value) }
                    }))}
                    min="0"
                    step="0.1"
                    style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #333', background: '#333', color: 'white' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600 }}>
                  Color Theme
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  style={{ width: '100%', height: 40, borderRadius: 4, border: '1px solid #333', background: '#333' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600 }}>
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., cut, high-protein"
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #333', background: '#333', color: 'white' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '10px 20px', background: '#666', border: 'none', borderRadius: 4, color: 'white', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '10px 20px', background: '#4caf50', border: 'none', borderRadius: 4, color: 'white', cursor: 'pointer' }}
            >
              {editingTemplate ? 'Update Template' : 'Create Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DietTemplateManager: React.FC<DietTemplateManagerProps> = ({ 
  className = '', 
  onTemplateSelected,
  compact = false 
}) => {
  const { 
    templates, 
    activeTemplate, 
    addTemplate, 
    updateTemplate, 
    deleteTemplate, 
    duplicateTemplate, 
    setActiveTemplate 
  } = useDietTemplates();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DietTemplate | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleCreateTemplate = (templateData: Omit<DietTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate = addTemplate(templateData);
    onTemplateSelected?.(newTemplate);
  };

  const handleEditTemplate = (template: DietTemplate) => {
    setEditingTemplate(template);
    setShowCreateModal(true);
  };

  const handleUpdateTemplate = (templateData: Omit<DietTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTemplate) {
      updateTemplate(editingTemplate.id, templateData);
      setEditingTemplate(null);
      onTemplateSelected?.(null); // Trigger refresh
    }
  };

  const handleSelectTemplate = (template: DietTemplate | null) => {
    setActiveTemplate(template?.id || null);
    onTemplateSelected?.(template);
  };

  if (compact) {
    return (
      <div className={className}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>Diet Templates</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ 
              padding: '4px 8px', 
              background: '#4caf50', 
              border: 'none', 
              borderRadius: 4, 
              color: 'white', 
              cursor: 'pointer',
              fontSize: 12
            }}
          >
            + New
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <select
            value={activeTemplate?.id || ''}
            onChange={e => {
              const selected = templates.find(t => t.id === e.target.value) || null;
              handleSelectTemplate(selected);
            }}
            style={{ 
              width: '100%', 
              padding: 8, 
              borderRadius: 4, 
              border: '1px solid #333', 
              background: '#333', 
              color: 'white' 
            }}
          >
            <option value="">No active template</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name} ({new Date(template.period.startDate).toLocaleDateString()})
              </option>
            ))}
          </select>

          {activeTemplate && (
            <div style={{ 
              padding: 12, 
              background: '#1a1a1a', 
              borderRadius: 6,
              border: `2px solid ${activeTemplate.color || '#3498db'}`,
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                {activeTemplate.name}
              </div>
              <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
                {activeTemplate.description || 'No description'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, fontSize: 10 }}>
                <div>Cal: {activeTemplate.macroTargets.calories}</div>
                <div>P: {activeTemplate.macroTargets.protein}g</div>
                <div>C: {activeTemplate.macroTargets.carbs}g</div>
                <div>F: {activeTemplate.macroTargets.fat}g</div>
              </div>
            </div>
          )}
        </div>

        <CreateTemplateModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setEditingTemplate(null);
          }}
          onSave={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
          editingTemplate={editingTemplate}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 16 
      }}>
        <h2 style={{ margin: 0 }}>Diet Templates</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#333', borderRadius: 4, padding: 2 }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '4px 8px',
                background: viewMode === 'grid' ? '#4caf50' : 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                borderRadius: 2,
                fontSize: 12,
              }}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '4px 8px',
                background: viewMode === 'list' ? '#4caf50' : 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                borderRadius: 2,
                fontSize: 12,
              }}
            >
              List
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ 
              padding: '8px 16px', 
              background: '#4caf50', 
              border: 'none', 
              borderRadius: 4, 
              color: 'white', 
              cursor: 'pointer' 
            }}
          >
            Create New Template
          </button>
        </div>
      </div>

      {templates.length === 0 ? (
        <div style={{ 
          padding: 40, 
          textAlign: 'center', 
          background: '#1a1a1a', 
          borderRadius: 8,
          border: '2px dashed #333'
        }}>
          <h3>No Templates Yet</h3>
          <p style={{ opacity: 0.7, marginBottom: 16 }}>
            Create your first diet template to track macro goals for different periods
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ 
              padding: '12px 24px', 
              background: '#4caf50', 
              border: 'none', 
              borderRadius: 4, 
              color: 'white', 
              cursor: 'pointer',
              fontSize: 16
            }}
          >
            Create Your First Template
          </button>
        </div>
      ) : (
        <div style={{ 
          display: viewMode === 'grid' ? 'grid' : 'flex',
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : undefined,
          flexDirection: viewMode === 'list' ? 'column' : undefined,
          gap: 16 
        }}>
          {templates.map(template => (
            <div
              key={template.id}
              style={{
                padding: 16,
                background: '#1a1a1a',
                borderRadius: 8,
                border: template.isActive ? `2px solid ${template.color || '#4caf50'}` : '1px solid #333',
                transition: 'border-color 0.3s ease',
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                marginBottom: 12 
              }}>
                <div>
                  <h4 style={{ 
                    margin: '0 0 4px 0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8 
                  }}>
                    <div 
                      style={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        background: template.color || '#3498db' 
                      }} 
                    />
                    {template.name}
                    {template.isActive && <span style={{ fontSize: 12 }}>✓</span>}
                  </h4>
                  <p style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: 12, 
                    opacity: 0.7 
                  }}>
                    {template.description || 'No description'}
                  </p>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    {new Date(template.period.startDate).toLocaleDateString()} - {
                      template.period.endDate 
                        ? new Date(template.period.endDate).toLocaleDateString()
                        : 'Ongoing'
                    }
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    onClick={() => handleEditTemplate(template)}
                    style={{ 
                      padding: '4px 8px', 
                      background: '#666', 
                      border: 'none', 
                      borderRadius: 3, 
                      color: 'white', 
                      cursor: 'pointer',
                      fontSize: 11
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => duplicateTemplate(template.id)}
                    style={{ 
                      padding: '4px 8px', 
                      background: '#2196f3', 
                      border: 'none', 
                      borderRadius: 3, 
                      color: 'white', 
                      cursor: 'pointer',
                      fontSize: 11
                    }}
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    style={{ 
                      padding: '4px 8px', 
                      background: '#e74c3c', 
                      border: 'none', 
                      borderRadius: 3, 
                      color: 'white', 
                      cursor: 'pointer',
                      fontSize: 11
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(5, 1fr)', 
                gap: 8, 
                marginBottom: 12,
                fontSize: 12 
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 600 }}>{template.macroTargets.calories}</div>
                  <div style={{ opacity: 0.7 }}>kcal</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 600 }}>{template.macroTargets.protein}g</div>
                  <div style={{ opacity: 0.7 }}>protein</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 600 }}>{template.macroTargets.carbs}g</div>
                  <div style={{ opacity: 0.7 }}>carbs</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 600 }}>{template.macroTargets.fat}g</div>
                  <div style={{ opacity: 0.7 }}>fat</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 600 }}>{template.macroTargets.fiber || 0}g</div>
                  <div style={{ opacity: 0.7 }}>fiber</div>
                </div>
              </div>

              {template.tags && template.tags.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  {template.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        display: 'inline-block',
                        padding: '2px 6px',
                        background: '#333',
                        borderRadius: 3,
                        fontSize: 10,
                        marginRight: 4,
                        marginBottom: 4,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => handleSelectTemplate(template.isActive ? null : template)}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  background: template.isActive ? '#e74c3c' : '#4caf50',
                  border: 'none', 
                  borderRadius: 4, 
                  color: 'white', 
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {template.isActive ? 'Deactivate' : 'Activate Template'}
              </button>
            </div>
          ))}
        </div>
      )}

      <CreateTemplateModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingTemplate(null);
        }}
        onSave={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
        editingTemplate={editingTemplate}
      />
    </div>
  );
};

export default DietTemplateManager;
