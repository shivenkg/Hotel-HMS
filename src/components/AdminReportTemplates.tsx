import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Eye, 
  Copy, 
  Trash2, 
  Check, 
  X, 
  RotateCcw, 
  Search, 
  Filter, 
  Lock, 
  ShieldCheck, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Sparkles,
  Sliders,
  Building2,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ReportTemplate, 
  ReportTemplateSection, 
  loadReportTemplates, 
  saveReportTemplates, 
  resetReportTemplatesToDefaults 
} from '../data/reportTemplatesData';

interface AdminReportTemplatesProps {
  isAdmin?: boolean;
}

export const AdminReportTemplates: React.FC<AdminReportTemplatesProps> = ({ isAdmin = true }) => {
  const [templates, setTemplates] = useState<ReportTemplate[]>(() => loadReportTemplates());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modals
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<ReportTemplate | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync with localStorage
  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setTemplates(e.detail);
      }
    };
    window.addEventListener('hms_report_templates_updated', handleUpdate);
    return () => window.removeEventListener('hms_report_templates_updated', handleUpdate);
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 3200);
  };

  const categories = useMemo(() => {
    const cats = new Set(templates.map(t => t.category));
    return ['All', ...Array.from(cats)];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(tpl => {
      if (selectedCategory !== 'All' && tpl.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = tpl.title.toLowerCase().includes(q);
        const matchCode = tpl.code.toLowerCase().includes(q);
        const matchDesc = tpl.description.toLowerCase().includes(q);
        const matchCat = tpl.category.toLowerCase().includes(q);
        return matchTitle || matchCode || matchDesc || matchCat;
      }
      return true;
    });
  }, [templates, selectedCategory, searchQuery]);

  // Save template edit (Admin only)
  const handleSaveEdit = (updated: ReportTemplate) => {
    if (!isAdmin) {
      showToast('Action Denied: Only Admin can edit preformatted report templates', 'error');
      return;
    }
    const next = templates.map(t => t.id === updated.id ? {
      ...updated,
      lastModifiedBy: 'Administrator',
      lastModifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    } : t);
    setTemplates(next);
    saveReportTemplates(next);
    setEditingTemplate(null);
    showToast(`Template "${updated.code}" saved successfully.`);
  };

  // Create new template
  const handleCreateTemplate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Action Denied: Only Admin can create report templates', 'error');
      return;
    }
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newTpl: ReportTemplate = {
      id: `tpl-${Date.now()}`,
      code: (formData.get('code') as string).toUpperCase().trim(),
      title: formData.get('title') as string,
      category: formData.get('category') as any,
      description: formData.get('description') as string,
      frequency: formData.get('frequency') as any,
      orientation: formData.get('orientation') as any,
      authorRole: 'Admin',
      lastModifiedBy: 'Administrator',
      lastModifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      headerTitle: formData.get('headerTitle') as string || (formData.get('title') as string).toUpperCase(),
      headerSubtitle: formData.get('headerSubtitle') as string || 'The Grand Azure Hotel & Suites',
      includeHotelLogo: true,
      includeGstinSac: formData.get('includeGstinSac') === 'on',
      disclaimerText: formData.get('disclaimerText') as string || 'Standard official report format approved by Hotel Administration.',
      footerNote: formData.get('footerNote') as string || 'CONFIDENTIAL • Internal hotel use only.',
      signOffRoles: ['Prepared By', 'Department Head', 'General Manager'],
      isActive: true,
      sections: [
        { id: 'sec-1', title: 'Summary Key Performance Indicators', description: 'Consolidated department metrics.', enabled: true, isRequired: true },
        { id: 'sec-2', title: 'Detailed Transactions / Folio Ledger', description: 'Itemized operational records.', enabled: true },
        { id: 'sec-3', title: 'Department Sign-off & Audit Seal', description: 'Physical / digital verification signatures.', enabled: true, isRequired: true }
      ]
    };

    const next = [newTpl, ...templates];
    setTemplates(next);
    saveReportTemplates(next);
    setIsCreateModalOpen(false);
    showToast(`New template "${newTpl.code}" created under Admin management.`);
  };

  // Duplicate template
  const handleDuplicate = (tpl: ReportTemplate) => {
    if (!isAdmin) return;
    const copy: ReportTemplate = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      code: `${tpl.code}-COPY`,
      title: `${tpl.title} (Custom Copy)`,
      lastModifiedBy: 'Administrator',
      lastModifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    const next = [copy, ...templates];
    setTemplates(next);
    saveReportTemplates(next);
    showToast(`Created duplicate template: ${copy.code}`);
  };

  // Reset all templates
  const handleResetDefaults = () => {
    if (!isAdmin) return;
    if (window.confirm('Reset all preformatted report templates to default hospitality standards? Custom modifications will be restored.')) {
      const defs = resetReportTemplatesToDefaults();
      setTemplates(defs);
      showToast('All report templates restored to default standards.');
    }
  };

  return (
    <div className="lodgify-card animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 20px',
          borderRadius: '12px',
          backgroundColor: feedbackMsg.type === 'success' ? '#0F172A' : '#EF4444',
          color: '#FFFFFF',
          fontSize: '13px',
          fontWeight: '700',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
          animation: 'slideInRight 0.2s ease-out'
        }}>
          {feedbackMsg.type === 'success' ? <CheckCircle2 size={16} color="#4ADE80" /> : <AlertTriangle size={16} />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#D4F05B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(212, 240, 91, 0.4)'
            }}>
              <FileText size={20} color="#0F172A" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Preformatted Report Templates Master
                </h2>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: '1px solid #FDE68A'
                }}>
                  <ShieldCheck size={12} /> Admin Controlled
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>
                Configure, edit, and standardize official reports (Night Audit, Tax Folio, Manager's Flash, FRRO Police C-Form).
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleResetDefaults}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-main)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            title="Restore standard hospitality report templates"
          >
            <RotateCcw size={13} />
            <span>Reset Standards</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: '700'
            }}
          >
            <Plus size={14} />
            <span>Add Custom Template</span>
          </button>
        </div>
      </div>

      {/* Admin Governance Notice */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '12px',
        backgroundColor: 'rgba(14, 148, 168, 0.08)',
        border: '1px solid rgba(14, 148, 168, 0.25)',
        fontSize: '12px',
        color: 'var(--text-main)'
      }}>
        <ShieldCheck size={20} color="#0E94A8" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <strong style={{ color: '#0E94A8' }}>Statutory & Operational Security Rule:</strong> All preformatted report templates that have the <strong>edit option</strong> are strictly managed under <strong>Admin Center</strong>. Staff in Front Desk, Housekeeping, or Kitchen can generate and print reports using these templates, but layout modifications, SAC/tax mappings, and required audit sections can only be altered by an Administrator.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'All' ? templates.length : templates.filter(t => t.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: isSelected ? '700' : '600',
                  backgroundColor: isSelected ? '#0F172A' : 'var(--bg-subtle)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                  border: isSelected ? '1px solid #0F172A' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{cat}</span>
                <span style={{
                  fontSize: '10px',
                  padding: '1px 5px',
                  borderRadius: '9999px',
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--bg-card)'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search report templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-clean"
            style={{ width: '100%', paddingLeft: '32px', paddingRight: '12px', fontSize: '12px', height: '34px', borderRadius: '8px' }}
          />
        </div>
      </div>

      {/* Grid of Report Templates */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
        {filteredTemplates.map((tpl) => {
          const enabledSectionsCount = tpl.sections.filter(s => s.enabled).length;

          return (
            <div
              key={tpl.id}
              style={{
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-card)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
              }}
            >
              {/* Top Row: Code, Category, Frequency */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#0E94A8',
                    backgroundColor: 'rgba(14, 148, 168, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    letterSpacing: '0.5px'
                  }}>
                    {tpl.code}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--text-muted)',
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '2px 7px',
                    borderRadius: '6px'
                  }}>
                    {tpl.frequency}
                  </span>
                </div>

                <span style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: tpl.isActive ? '#DCFCE7' : '#FEE2E2',
                  color: tpl.isActive ? '#15803D' : '#B91C1C',
                  border: tpl.isActive ? '1px solid #BBF7D0' : '1px solid #FECDD3'
                }}>
                  {tpl.isActive ? 'Active' : 'Archived'}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                  {tpl.title}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {tpl.description}
                </p>
              </div>

              {/* Badges / Meta row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                padding: '8px 10px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-subtle)',
                fontSize: '11px',
                color: 'var(--text-muted)'
              }}>
                <span><strong>{enabledSectionsCount}</strong> of {tpl.sections.length} sections active</span>
                <span>•</span>
                <span>Layout: <strong>{tpl.orientation}</strong></span>
                {tpl.includeGstinSac && (
                  <>
                    <span>•</span>
                    <span style={{ color: '#0E94A8', fontWeight: '700' }}>GST SAC 996311</span>
                  </>
                )}
              </div>

              {/* Action Buttons: Edit Template & Preview Template */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(tpl)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <Eye size={12} />
                    <span>Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicate(tpl)}
                    title="Duplicate template"
                    style={{
                      padding: '6px 8px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    <Copy size={12} />
                  </button>
                </div>

                {/* Edit Template Button (Admin Exclusive) */}
                <button
                  type="button"
                  id={`btn-edit-template-${tpl.code.toLowerCase()}`}
                  onClick={() => setEditingTemplate(tpl)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#D4F05B',
                    color: '#0F172A',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(212, 240, 91, 0.3)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <Edit3 size={13} color="#0F172A" />
                  <span>Edit Template</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: EDIT REPORT TEMPLATE (ADMIN EXCLUSIVE)                        */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {editingTemplate && (
          <motion.div
            key="edit-template-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingTemplate(null);
            }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px',
              backdropFilter: 'blur(4px)'
            }}
          >
            <motion.div
              key="edit-template-modal-container"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="lodgify-card"
              style={{
                width: '100%',
                maxWidth: '780px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '28px',
                borderRadius: '20px',
                backgroundColor: 'var(--bg-card)',
                position: 'relative'
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#D4F05B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Edit3 size={18} color="#0F172A" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                        Edit Preformatted Template
                      </h3>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        color: '#0E94A8',
                        backgroundColor: 'rgba(14, 148, 168, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        {editingTemplate.code}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Admin Master Data • Changes apply to all future generated reports
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Template Editor Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEdit(editingTemplate);
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
              >
                {/* Row 1: Title & Code */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                  <div className="form-field">
                    <label className="form-label">Template Title</label>
                    <input
                      type="text"
                      required
                      value={editingTemplate.title}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                      className="input-clean"
                      style={{ fontSize: '13px', fontWeight: '600' }}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Template Code (Immutable)</label>
                    <input
                      type="text"
                      readOnly
                      value={editingTemplate.code}
                      className="input-clean"
                      style={{ fontSize: '13px', backgroundColor: 'var(--bg-subtle)', cursor: 'not-allowed' }}
                    />
                  </div>
                </div>

                {/* Row 2: Category, Frequency, Orientation, Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                  <div className="form-field">
                    <label className="form-label">Category</label>
                    <select
                      value={editingTemplate.category}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value as any })}
                      className="input-clean"
                      style={{ fontSize: '12px' }}
                    >
                      <option value="Night Audit & Finance">Night Audit & Finance</option>
                      <option value="Front Office & KYC">Front Office & KYC</option>
                      <option value="Executive & Management">Executive & Management</option>
                      <option value="Statutory & Tax">Statutory & Tax</option>
                      <option value="Housekeeping & Operations">Housekeeping & Operations</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Frequency</label>
                    <select
                      value={editingTemplate.frequency}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, frequency: e.target.value as any })}
                      className="input-clean"
                      style={{ fontSize: '12px' }}
                    >
                      <option value="Per Shift">Per Shift</option>
                      <option value="Daily">Daily</option>
                      <option value="Nightly">Nightly</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="On-Demand">On-Demand</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Page Orientation</label>
                    <select
                      value={editingTemplate.orientation}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, orientation: e.target.value as any })}
                      className="input-clean"
                      style={{ fontSize: '12px' }}
                    >
                      <option value="Portrait">Portrait</option>
                      <option value="Landscape">Landscape</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Template Status</label>
                    <select
                      value={editingTemplate.isActive ? 'Active' : 'Inactive'}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, isActive: e.target.value === 'Active' })}
                      className="input-clean"
                      style={{ fontSize: '12px' }}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="form-field">
                  <label className="form-label">Operational Description & Regulatory Mandate</label>
                  <textarea
                    rows={2}
                    value={editingTemplate.description}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                    className="input-clean"
                    style={{ fontSize: '12px' }}
                  />
                </div>

                {/* Header & Print Customization */}
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>
                    Print Header & Statutory Branding
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-field">
                      <label className="form-label">Header Print Title</label>
                      <input
                        type="text"
                        value={editingTemplate.headerTitle}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, headerTitle: e.target.value })}
                        className="input-clean"
                        style={{ fontSize: '12px' }}
                      />
                    </div>

                    <div className="form-field">
                      <label className="form-label">Header Subtitle</label>
                      <input
                        type="text"
                        value={editingTemplate.headerSubtitle}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, headerSubtitle: e.target.value })}
                        className="input-clean"
                        style={{ fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={editingTemplate.includeHotelLogo}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, includeHotelLogo: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: '#0E94A8' }}
                      />
                      <span>Include Official Hotel Logo in Header</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={editingTemplate.includeGstinSac}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, includeGstinSac: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: '#0E94A8' }}
                      />
                      <span>Include GSTIN / SAC 996311/996331 Tax Block</span>
                    </label>
                  </div>
                </div>

                {/* Preformatted Sections Configurator */}
                <div className="form-field">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label className="form-label" style={{ margin: 0 }}>
                      Preformatted Content Sections ({editingTemplate.sections.length})
                    </label>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Toggle sections to include/exclude from the preformatted output
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {editingTemplate.sections.map((sec, idx) => (
                      <div
                        key={sec.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: sec.enabled ? '1px solid var(--border-subtle)' : '1px dashed var(--border-subtle)',
                          backgroundColor: sec.enabled ? 'var(--bg-card)' : 'var(--bg-subtle)',
                          opacity: sec.enabled ? 1 : 0.6
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                          <input
                            type="checkbox"
                            checked={sec.enabled}
                            disabled={sec.isRequired}
                            onChange={(e) => {
                              const nextSections = editingTemplate.sections.map((s, i) => i === idx ? { ...s, enabled: e.target.checked } : s);
                              setEditingTemplate({ ...editingTemplate, sections: nextSections });
                            }}
                            style={{ width: '16px', height: '16px', accentColor: '#0E94A8' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>{sec.title}</strong>
                              {sec.isRequired && (
                                <span style={{ fontSize: '10px', backgroundColor: '#FEE2E2', color: '#991B1B', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>
                                  Required
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sec.description}</div>
                          </div>
                        </div>

                        {sec.columns && (
                          <div style={{ fontSize: '11px', color: '#0E94A8', fontWeight: '600' }}>
                            {sec.columns.length} columns
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimers & Sign-off Roles */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-field">
                    <label className="form-label">Statutory Disclaimer Text</label>
                    <textarea
                      rows={2}
                      value={editingTemplate.disclaimerText}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, disclaimerText: e.target.value })}
                      className="input-clean"
                      style={{ fontSize: '11px' }}
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Footer Confidentiality Note</label>
                    <textarea
                      rows={2}
                      value={editingTemplate.footerNote}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, footerNote: e.target.value })}
                      className="input-clean"
                      style={{ fontSize: '11px' }}
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(editingTemplate)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-main)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <Eye size={13} />
                    <span>Live Sample Preview</span>
                  </button>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setEditingTemplate(null)}
                      className="btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ padding: '8px 20px', fontSize: '12px', fontWeight: '800' }}
                    >
                      Save Template Changes
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: PREVIEW PREFORMATTED REPORT (CLEAN PRINT PREVIEW)            */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            key="preview-template-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setPreviewTemplate(null);
            }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px',
              backdropFilter: 'blur(5px)'
            }}
          >
            <motion.div
              key="preview-template-modal-container"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="lodgify-card"
              style={{
                width: '100%',
                maxWidth: '820px',
                maxHeight: '92vh',
                overflowY: 'auto',
                padding: '36px',
                borderRadius: '20px',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)'
              }}
            >
              {/* Header Action Bar (Not part of print) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ backgroundColor: '#D4F05B', color: '#0F172A', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
                    PREFORMATTED TEMPLATE
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>
                    Code: {previewTemplate.code} • Orientation: {previewTemplate.orientation}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Printer size={13} />
                    <span>Print Report</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(null)}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* REPORT DOCUMENT PAPER (WYSIWYG) */}
              <div style={{
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '32px',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                {/* Document Letterhead */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '2px solid #0F172A', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>
                      THE GRAND AZURE HOTEL & SUITES
                    </h1>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                      Marine Drive Promenade, Mumbai 400021 • Phone: +91 22 2840 9000
                    </div>
                    {previewTemplate.includeGstinSac && (
                      <div style={{ fontSize: '11px', color: '#0369A1', fontWeight: '700', marginTop: '2px' }}>
                        GSTIN: 27AAAAA0000A1Z5 • State Code: 27 (Maharashtra) • SAC: 996311 / 996331
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                      {previewTemplate.headerTitle}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      {previewTemplate.headerSubtitle}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px' }}>
                      Generated: {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Sample Key Metrics */}
                {previewTemplate.sampleSummaryMetrics && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${previewTemplate.sampleSummaryMetrics.length}, 1fr)`,
                    gap: '12px',
                    marginBottom: '24px'
                  }}>
                    {previewTemplate.sampleSummaryMetrics.map((m, idx) => (
                      <div key={idx} style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>{m.label}</div>
                        <div style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>{m.value}</div>
                        {m.delta && <div style={{ fontSize: '10px', color: '#16A34A', fontWeight: '700', marginTop: '2px' }}>{m.delta}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Active Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {previewTemplate.sections.filter(s => s.enabled).map((sec, idx) => (
                    <div key={sec.id} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: '#F1F5F9', padding: '8px 12px', fontSize: '12px', fontWeight: '800', color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>
                        SECTION {idx + 1}: {sec.title.toUpperCase()}
                      </div>
                      <div style={{ padding: '12px', fontSize: '11px', color: '#475569' }}>
                        <p style={{ margin: '0 0 8px 0', fontStyle: 'italic' }}>{sec.description}</p>
                        {sec.columns ? (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', backgroundColor: '#FFFFFF', padding: '6px 10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                            <span style={{ fontWeight: '700', color: '#0F172A' }}>Columns:</span>
                            {sec.columns.map(c => (
                              <span key={c} style={{ backgroundColor: '#F8FAFC', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                                {c}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div style={{ padding: '8px', backgroundColor: '#F8FAFC', borderRadius: '6px', border: '1px dashed #CBD5E1', textAlign: 'center', color: '#94A3B8' }}>
                            [Preformatted tabular data records will be populated automatically during report generation]
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sign-off Seal Block */}
                <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '16px' }}>
                    <strong>Statutory Certification:</strong> {previewTemplate.disclaimerText}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${previewTemplate.signOffRoles.length}, 1fr)`, gap: '20px' }}>
                    {previewTemplate.signOffRoles.map((role, idx) => (
                      <div key={idx} style={{ textAlign: 'center' }}>
                        <div style={{ height: '40px', borderBottom: '1px dashed #94A3B8', marginBottom: '6px' }} />
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#0F172A' }}>{role}</div>
                        <div style={{ fontSize: '10px', color: '#94A3B8' }}>Signature & Date</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '10px', color: '#94A3B8' }}>
                  {previewTemplate.footerNote}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: CREATE CUSTOM TEMPLATE (ADMIN EXCLUSIVE)                    */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            key="create-template-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsCreateModalOpen(false);
            }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px',
              backdropFilter: 'blur(4px)'
            }}
          >
            <motion.div
              key="create-template-modal-container"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="lodgify-card"
              style={{
                width: '100%',
                maxWidth: '640px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '28px',
                borderRadius: '20px',
                backgroundColor: 'var(--bg-card)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#D4F05B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Plus size={18} color="#0F172A" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                      Add Preformatted Report Template
                    </h3>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Author a new preformatted report standard under Admin
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateTemplate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                  <div className="form-field">
                    <label className="form-label">Template Code *</label>
                    <input
                      name="code"
                      type="text"
                      required
                      placeholder="e.g. REP-VIP-SUMMARY"
                      className="input-clean"
                      style={{ fontSize: '12px' }}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Template Title *</label>
                    <input
                      name="title"
                      type="text"
                      required
                      placeholder="e.g. VIP Protocol & Butler Service Summary"
                      className="input-clean"
                      style={{ fontSize: '12px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div className="form-field">
                    <label className="form-label">Category</label>
                    <select name="category" className="input-clean" style={{ fontSize: '12px' }}>
                      <option value="Night Audit & Finance">Night Audit & Finance</option>
                      <option value="Front Office & KYC">Front Office & KYC</option>
                      <option value="Executive & Management">Executive & Management</option>
                      <option value="Statutory & Tax">Statutory & Tax</option>
                      <option value="Housekeeping & Operations">Housekeeping & Operations</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Frequency</label>
                    <select name="frequency" className="input-clean" style={{ fontSize: '12px' }}>
                      <option value="Daily">Daily</option>
                      <option value="Per Shift">Per Shift</option>
                      <option value="Nightly">Nightly</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="On-Demand">On-Demand</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Orientation</label>
                    <select name="orientation" className="input-clean" style={{ fontSize: '12px' }}>
                      <option value="Portrait">Portrait</option>
                      <option value="Landscape">Landscape</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">Operational Purpose & Description</label>
                  <textarea
                    name="description"
                    rows={2}
                    required
                    placeholder="Describe the operational, accounting, or statutory objective of this report..."
                    className="input-clean"
                    style={{ fontSize: '12px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-field">
                    <label className="form-label">Header Title</label>
                    <input
                      name="headerTitle"
                      type="text"
                      placeholder="e.g. VIP BUTLER SERVICE REPORT"
                      className="input-clean"
                      style={{ fontSize: '12px' }}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Header Subtitle</label>
                    <input
                      name="headerSubtitle"
                      type="text"
                      placeholder="e.g. The Grand Azure Luxury Suites"
                      className="input-clean"
                      style={{ fontSize: '12px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      name="includeGstinSac"
                      type="checkbox"
                      defaultChecked
                      style={{ width: '16px', height: '16px', accentColor: '#0E94A8' }}
                    />
                    <span>Include GSTIN / SAC Tax Header</span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '8px 20px', fontSize: '12px', fontWeight: '800' }}
                  >
                    Create Template
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
