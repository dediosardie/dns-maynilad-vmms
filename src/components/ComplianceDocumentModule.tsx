// Compliance Document Module - Defined per compliance-document-module.md
import { useState, useEffect } from 'react';
import { Document, ComplianceAlert, Vehicle, Driver } from '../types';
import Modal from './Modal';
import { Input, Select, Textarea, Button, Badge, Card } from './ui';
import { documentService, complianceService, vehicleService, driverService } from '../services/supabaseService';

export default function ComplianceDocumentModule() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [docsData, alertsData, vehiclesData, driversData] = await Promise.all([
        documentService.getAll(),
        complianceService.getAlerts(),
        vehicleService.getAll(),
        driverService.getAll()
      ]);
      setDocuments(docsData);
      setAlerts(alertsData);
      setVehicles(vehiclesData);
      setDrivers(driversData);
    } catch (error: any) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Document Upload Form - per markdown Document Upload Form section
  const DocumentForm = ({ initialData, onSubmit, onClose }: any) => {
    const [formData, setFormData] = useState({
      document_type: initialData?.document_type || 'registration',
      related_entity_type: initialData?.related_entity_type || 'vehicle',
      related_entity_id: initialData?.related_entity_id || '',
      document_name: initialData?.document_name || '',
      document_number: initialData?.document_number || '',
      issuing_authority: initialData?.issuing_authority || '',
      issue_date: initialData?.issue_date || '',
      expiry_date: initialData?.expiry_date || '',
      file_url: initialData?.file_url || '',
      file_type: initialData?.file_type || 'pdf',
      file_size: initialData?.file_size || 0,
      reminder_days: initialData?.reminder_days || 30,
      notes: initialData?.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    // Get available entities based on related_entity_type
    const availableEntities = formData.related_entity_type === 'vehicle' ? vehicles : drivers;

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Document Type (select, required) */}
          <div>
            <Select
              label={<>Document Type <span className="text-red-600">*</span></>}
              name="document_type"
              value={formData.document_type}
              onChange={(e) => setFormData({...formData, document_type: e.target.value as any})}
              required
            >
              <option value="registration">Registration</option>
              <option value="insurance">Insurance</option>
              <option value="permit">Permit</option>
              <option value="license">License</option>
              <option value="inspection">Inspection</option>
              <option value="contract">Contract</option>
              <option value="other">Other</option>
            </Select>
          </div>

          {/* Related To (select, required: vehicle/driver) */}
          <div>
            <Select
              label={<>Related To <span className="text-red-600">*</span></>}
              name="related_entity_type"
              value={formData.related_entity_type}
              onChange={(e) => setFormData({...formData, related_entity_type: e.target.value as any, related_entity_id: ''})}
              required
            >
              <option value="vehicle">Vehicle</option>
              <option value="driver">Driver</option>
              <option value="fleet">Fleet</option>
            </Select>
          </div>

          {/* Select Vehicle/Driver (select, required, dynamic based on previous selection) */}
          <div>
            <Select
              label={<>Select {formData.related_entity_type === 'vehicle' ? 'Vehicle' : 'Driver'} <span className="text-red-600">*</span></>}
              name="related_entity_id"
              value={formData.related_entity_id}
              onChange={(e) => setFormData({...formData, related_entity_id: e.target.value})}
              required
            >
              <option value="">Select {formData.related_entity_type}</option>
              {availableEntities.map(entity => (
                <option key={entity.id} value={entity.id}>
                  {'plate_number' in entity 
                    ? `${entity.plate_number}${entity.conduction_number ? ` (${entity.conduction_number})` : ''} - ${entity.make} ${entity.model}` 
                    : entity.full_name}
                </option>
              ))}
            </Select>
          </div>

          {/* Document Name (text, required) */}
          <div>
            <Input
              label={<>Document Name <span className="text-red-600">*</span></>}
              name="document_name"
              type="text"
              value={formData.document_name}
              onChange={(e) => setFormData({...formData, document_name: e.target.value})}
              required
            />
          </div>

          {/* Document Number (text, optional) */}
          <div>
            <Input
              label="Document Number"
              name="document_number"
              type="text"
              value={formData.document_number}
              onChange={(e) => setFormData({...formData, document_number: e.target.value})}
            />
          </div>

          {/* Issuing Authority (text, required) */}
          <div>
            <Input
              label={<>Issuing Authority <span className="text-red-600">*</span></>}
              name="issuing_authority"
              type="text"
              value={formData.issuing_authority}
              onChange={(e) => setFormData({...formData, issuing_authority: e.target.value})}
              required
            />
          </div>

          {/* Issue Date (date, required) */}
          <div>
            <Input
              label={<>Issue Date <span className="text-red-600">*</span></>}
              name="issue_date"
              type="date"
              value={formData.issue_date}
              onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
              required
            />
          </div>

          {/* Expiry Date (date, optional but required for certain types) */}
          <div>
            <Input
              label={<>Expiry Date {['registration', 'insurance', 'permit', 'license', 'inspection'].includes(formData.document_type) && <span className="text-red-600">*</span>}</>}
              name="expiry_date"
              type="date"
              value={formData.expiry_date}
              onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
              required={['registration', 'insurance', 'permit', 'license', 'inspection'].includes(formData.document_type)}
            />
          </div>

          {/* File Upload (file, required, pdf/jpg/png, max 25MB) */}
          <div>
            <Input
              label={<>File Upload <span className="text-red-600">*</span></>}
              name="file_upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData({...formData, file_url: file.name, file_type: file.type, file_size: file.size});
                }
              }}
              required={!initialData}
            />
            <p className="text-xs text-text-muted mt-1">PDF, JPG, PNG (max 25MB)</p>
          </div>

          {/* Reminder Days Before Expiry (number, default: 30) */}
          <div>
            <Input
              label={<>Reminder Days Before Expiry <span className="text-red-600">*</span></>}
              name="reminder_days"
              type="number"
              value={formData.reminder_days}
              onChange={(e) => setFormData({...formData, reminder_days: parseInt(e.target.value)})}
              required
              min="1"
            />
          </div>
        </div>

        {/* Notes (textarea, optional) */}
        <div>
          <Textarea
            label="Notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        {/* Actions: Upload Document (primary, submit) / Update Document Details (primary, submit) */}
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Update Document' : 'Upload Document'}
          </Button>
        </div>
      </form>
    );
  };

  // Action: Upload Document (primary, submit) - per markdown
  const handleSaveDocument = async (documentData: any) => {
    try {
      // Calculate status based on expiry date per business rules
      let status: 'active' | 'expired' | 'expiring_soon' | 'revoked' = 'active';
      if (documentData.expiry_date) {
        const today = new Date();
        const expiryDate = new Date(documentData.expiry_date);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry < 0) {
          status = 'expired';
        } else if (daysUntilExpiry <= documentData.reminder_days) {
          status = 'expiring_soon';
        }
      }

      const newDocument = await documentService.create({
        ...documentData,
        status,
        uploaded_by: 'current_user_id' // TODO: Get from auth context
      });
      
      setDocuments([newDocument, ...documents]);
      setIsUploadModalOpen(false);
      await loadData(); // Reload to get fresh alerts
    } catch (error: any) {
      console.error('Failed to save document:', error);
      alert(error.message || 'Failed to save document. Please try again.');
    }
  };

  // Action: Update Document Details (primary, submit)
  const handleUpdateDocument = async (documentData: any) => {
    if (!editingDocument) return;
    
    try {
      const updated = await documentService.update(editingDocument.id, documentData);
      setDocuments(documents.map(d => d.id === updated.id ? updated : d));
      setIsUploadModalOpen(false);
      setEditingDocument(undefined);
    } catch (error: any) {
      console.error('Failed to update document:', error);
      alert(error.message || 'Failed to update document. Please try again.');
    }
  };

  // Action: Delete Document (danger, confirmation required)
  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }
    
    try {
      await documentService.delete(id);
      setDocuments(documents.filter(d => d.id !== id));
    } catch (error: any) {
      console.error('Failed to delete document:', error);
      alert(error.message || 'Failed to delete document. Please try again.');
    }
  };

  // Action: Acknowledge Alert (success, dismisses alert)
  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await complianceService.acknowledgeAlert(alertId, 'current_user_id');
      setAlerts(alerts.map(a => a.id === alertId ? {...a, is_acknowledged: true} : a));
    } catch (error: any) {
      console.error('Failed to acknowledge alert:', error);
      alert(error.message || 'Failed to acknowledge alert. Please try again.');
    }
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    setIsUploadModalOpen(true);
  };

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    if (filterType !== 'all' && doc.document_type !== filterType) return false;
    if (filterStatus !== 'all' && doc.status !== filterStatus) return false;
    return true;
  });

  // Calculate Compliance Dashboard Metrics per markdown
  const totalActiveDocuments = documents.filter(d => d.status === 'active').length;
  const expiringWithin30Days = documents.filter(d => {
    if (!d.expiry_date) return false;
    const daysUntil = Math.ceil((new Date(d.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 30;
  }).length;
  const expiredDocuments = documents.filter(d => d.status === 'expired').length;
  const complianceRate = documents.length > 0 ? ((totalActiveDocuments / documents.length) * 100).toFixed(1) : '0';

  const handleAddDocument = () => {
    setEditingDocument(undefined);
    setIsUploadModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards - Compliance Dashboard Metrics per markdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Total Active Documents</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{totalActiveDocuments}</p>
            </div>
            <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Expiring Within 30 Days</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{expiringWithin30Days}</p>
            </div>
            <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Expired Documents</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{expiredDocuments}</p>
            </div>
            <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Compliance Rate</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{complianceRate}%</p>
            </div>
            <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Compliance Alerts Section */}
      {alerts.filter(a => !a.is_acknowledged).length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-2">Compliance Alerts</h3>
              <div className="space-y-2">
                {alerts.filter(a => !a.is_acknowledged).map(alert => {
                  const doc = documents.find(d => d.id === alert.document_id);
                  return (
                    <div key={alert.id} className="flex items-center justify-between bg-white rounded p-2">
                      <span className="text-sm text-text-secondary">
                        <strong>{doc?.document_name}</strong> - {alert.alert_type === 'expired' ? 'Expired' : `Expiring in ${alert.days_until_expiry} days`}
                      </span>
                      {/* Action: Acknowledge Alert (success, dismisses alert) */}
                      <Button size="sm" variant="primary" onClick={() => handleAcknowledgeAlert(alert.id)}>
                        Acknowledge
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <Card>
        <div className="p-6 border-b border-border-muted">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Compliance Documents</h2>
              <p className="text-sm text-text-secondary mt-1">Manage and track document compliance</p>
            </div>
            <div className="flex gap-2">
              {/* Action: Export Compliance Report (secondary, PDF/Excel) */}
              <Button 
                variant="secondary"                 
                size="md"
                className="inline-flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Report
              </Button>
              {/* Action: Upload Document (primary) */}
              <Button onClick={handleAddDocument}                
                variant="primary"                 
                size="md"
                className="inline-flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload Document
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-text-primary mb-1">Document Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-border-muted rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="registration">Registration</option>
                <option value="insurance">Insurance</option>
                <option value="permit">Permit</option>
                <option value="license">License</option>
                <option value="inspection">Inspection</option>
                <option value="contract">Contract</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-text-primary mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-border-muted rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="expiring_soon">Expiring Soon</option>
                <option value="expired">Expired</option>
                <option value="revoked">Revoked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              <p className="text-text-secondary mt-4">Loading documents...</p>
            </div>
          </div>
        ) : (
          /* Documents Table - per Document Table definition in markdown */
          <div className="p-6">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-text-primary mb-1">No documents found</h3>
              <p className="text-text-secondary">Try adjusting your filters or upload new documents</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border-muted">
                <thead className="bg-bg-elevated">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Document Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Related To</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Issue Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Expiry Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Issuing Authority</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-bg-secondary divide-y divide-border-muted">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-bg-elevated">
                      <td className="px-4 py-3 text-sm font-medium text-text-primary">{doc.document_name}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary capitalize">{doc.document_type}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary capitalize">{doc.related_entity_type}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{new Date(doc.issue_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{doc.expiry_date ? new Date(doc.expiry_date).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">
                        {/* Status enum per markdown: active, expired, expiring_soon, revoked */}
                        <Badge variant={
                          doc.status === 'active' ? 'success' :
                          doc.status === 'expiring_soon' ? 'warning' :
                          doc.status === 'expired' ? 'danger' :
                          'default'
                        }>
                          {doc.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{doc.issuing_authority}</td>
                      <td className="px-4 py-3 text-right text-sm space-x-2">
                        {/* Actions per markdown */}
                        <Button size="sm" variant="ghost">Download</Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEditDocument(doc)}>Edit</Button>
                        <Button size="sm" variant="danger" onClick={() => handleDeleteDocument(doc.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}
      </Card>

      {/* Modal for Upload Document */}
      <Modal isOpen={isUploadModalOpen} onClose={() => { setIsUploadModalOpen(false); setEditingDocument(undefined); }} title={editingDocument ? 'Update Document' : 'Upload Document'}>
        <DocumentForm 
          initialData={editingDocument} 
          onSubmit={editingDocument ? handleUpdateDocument : handleSaveDocument} 
          onClose={() => { setIsUploadModalOpen(false); setEditingDocument(undefined); }} 
        />
      </Modal>
    </div>
  );
}
