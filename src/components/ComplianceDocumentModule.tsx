// Compliance Document Module - Defined per compliance-document-module.md
import { useState, useEffect } from 'react';
import { Document, ComplianceAlert, Vehicle, Driver } from '../types';
import Modal from './Modal';

export default function ComplianceDocumentModule() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingDocument] = useState<Document | undefined>();

  useEffect(() => {
    const handleVehiclesUpdate = ((event: CustomEvent) => setVehicles(event.detail)) as EventListener;
    const handleDriversUpdate = ((event: CustomEvent) => setDrivers(event.detail)) as EventListener;
    window.addEventListener('vehiclesUpdated', handleVehiclesUpdate);
    window.addEventListener('driversUpdated', handleDriversUpdate);
    return () => {
      window.removeEventListener('vehiclesUpdated', handleVehiclesUpdate);
      window.removeEventListener('driversUpdated', handleDriversUpdate);
    };
  }, []);

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
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Document Type <span className="text-red-600">*</span>
            </label>
            <select value={formData.document_type} onChange={(e) => setFormData({...formData, document_type: e.target.value as any})} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500">
              <option value="registration">Registration</option>
              <option value="insurance">Insurance</option>
              <option value="permit">Permit</option>
              <option value="license">License</option>
              <option value="inspection">Inspection</option>
              <option value="contract">Contract</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Related To (select, required: vehicle/driver) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Related To <span className="text-red-600">*</span>
            </label>
            <select value={formData.related_entity_type} onChange={(e) => setFormData({...formData, related_entity_type: e.target.value as any, related_entity_id: ''})} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500">
              <option value="vehicle">Vehicle</option>
              <option value="driver">Driver</option>
              <option value="fleet">Fleet</option>
            </select>
          </div>

          {/* Select Vehicle/Driver (select, required, dynamic based on previous selection) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select {formData.related_entity_type === 'vehicle' ? 'Vehicle' : 'Driver'} <span className="text-red-600">*</span>
            </label>
            <select value={formData.related_entity_id} onChange={(e) => setFormData({...formData, related_entity_id: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500">
              <option value="">Select {formData.related_entity_type}</option>
              {availableEntities.map(entity => (
                <option key={entity.id} value={entity.id}>
                  {'plate_number' in entity ? `${entity.plate_number} - ${entity.make} ${entity.model}` : entity.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Document Name (text, required) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Document Name <span className="text-red-600">*</span>
            </label>
            <input type="text" value={formData.document_name} onChange={(e) => setFormData({...formData, document_name: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Document Number (text, optional) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Document Number</label>
            <input type="text" value={formData.document_number} onChange={(e) => setFormData({...formData, document_number: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Issuing Authority (text, required) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Issuing Authority <span className="text-red-600">*</span>
            </label>
            <input type="text" value={formData.issuing_authority} onChange={(e) => setFormData({...formData, issuing_authority: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Issue Date (date, required) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Issue Date <span className="text-red-600">*</span>
            </label>
            <input type="date" value={formData.issue_date} onChange={(e) => setFormData({...formData, issue_date: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Expiry Date (date, optional but required for certain types) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Expiry Date {['registration', 'insurance', 'permit', 'license', 'inspection'].includes(formData.document_type) && <span className="text-red-600">*</span>}
            </label>
            <input type="date" value={formData.expiry_date} onChange={(e) => setFormData({...formData, expiry_date: e.target.value})} required={['registration', 'insurance', 'permit', 'license', 'inspection'].includes(formData.document_type)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500" />
          </div>

          {/* File Upload (file, required, pdf/jpg/png, max 25MB) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              File Upload <span className="text-red-600">*</span>
            </label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData({...formData, file_url: file.name, file_type: file.type, file_size: file.size});
              }
            }} required={!initialData} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 text-sm" />
            <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG (max 25MB)</p>
          </div>

          {/* Reminder Days Before Expiry (number, default: 30) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Reminder Days Before Expiry <span className="text-red-600">*</span>
            </label>
            <input type="number" value={formData.reminder_days} onChange={(e) => setFormData({...formData, reminder_days: parseInt(e.target.value)})} required min="1" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500" />
          </div>
        </div>

        {/* Notes (textarea, optional) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
          <textarea rows={3} value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500"></textarea>
        </div>

        {/* Actions: Upload Document (primary, submit) / Update Document Details (primary, submit) */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            {initialData ? 'Update Document' : 'Upload Document'}
          </button>
        </div>
      </form>
    );
  };

  // Action: Upload Document (primary, submit) - per markdown
  const handleSaveDocument = (documentData: any) => {
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

    const newDocument: Document = {
      ...documentData,
      id: crypto.randomUUID(),
      status,
      uploaded_by: 'current_user_id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setDocuments([...documents, newDocument]);
    setIsUploadModalOpen(false);
    
    // Create alert if expiring soon or expired per business rules
    if (status === 'expiring_soon' || status === 'expired') {
      const newAlert: ComplianceAlert = {
        id: crypto.randomUUID(),
        document_id: newDocument.id,
        alert_type: status === 'expired' ? 'expired' : 'expiring_soon',
        alert_date: new Date().toISOString(),
        days_until_expiry: documentData.expiry_date ? Math.ceil((new Date(documentData.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : undefined,
        is_acknowledged: false,
      };
      setAlerts([...alerts, newAlert]);
    }
  };

  // Action: Delete Document (danger, confirmation required) - per markdown
  const handleDeleteDocument = (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(d => d.id !== id));
    }
  };

  // Action: Acknowledge Alert (success, dismisses alert) - per markdown
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(alerts.map(a => 
      a.id === alertId 
        ? { ...a, is_acknowledged: true, acknowledged_by: 'current_user_id', acknowledged_at: new Date().toISOString() }
        : a
    ));
  };

  // Calculate Compliance Dashboard Metrics per markdown
  const totalActiveDocuments = documents.filter(d => d.status === 'active').length;
  const expiringWithin30Days = documents.filter(d => {
    if (!d.expiry_date) return false;
    const daysUntil = Math.ceil((new Date(d.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 30;
  }).length;
  const expiredDocuments = documents.filter(d => d.status === 'expired').length;
  const complianceRate = documents.length > 0 ? ((totalActiveDocuments / documents.length) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Stats Cards - Compliance Dashboard Metrics per markdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Active Documents</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{totalActiveDocuments}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Expiring Within 30 Days</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{expiringWithin30Days}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Expired Documents</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{expiredDocuments}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Compliance Rate</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{complianceRate}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
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
                      <span className="text-sm text-slate-700">
                        <strong>{doc?.document_name}</strong> - {alert.alert_type === 'expired' ? 'Expired' : `Expiring in ${alert.days_until_expiry} days`}
                      </span>
                      {/* Action: Acknowledge Alert (success, dismisses alert) */}
                      <button onClick={() => handleAcknowledgeAlert(alert.id)} className="text-xs px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700">
                        Acknowledge
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Compliance Documents</h2>
              <p className="text-sm text-slate-600 mt-1">Manage and track document compliance</p>
            </div>
            <div className="flex gap-2">
              {/* Action: Export Compliance Report (secondary, PDF/Excel) */}
              <button className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Report
              </button>
              {/* Action: Upload Document (primary) */}
              <button onClick={() => setIsUploadModalOpen(true)} className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload Document
              </button>
            </div>
          </div>
        </div>

        {/* Documents Table - per Document Table definition in markdown */}
        <div className="p-6">
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-slate-900 mb-1">No documents uploaded</h3>
              <p className="text-slate-600">Start managing compliance by uploading documents</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Document Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Related To</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Issue Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Expiry Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Issuing Authority</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{doc.document_name}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 capitalize">{doc.document_type}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 capitalize">{doc.related_entity_type}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{new Date(doc.issue_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{doc.expiry_date ? new Date(doc.expiry_date).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">
                        {/* Status enum per markdown: active, expired, expiring_soon, revoked */}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          doc.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                          doc.status === 'expiring_soon' ? 'bg-amber-100 text-amber-800' :
                          doc.status === 'expired' ? 'bg-red-100 text-red-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {doc.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">{doc.issuing_authority}</td>
                      <td className="px-4 py-3 text-right text-sm space-x-2">
                        {/* Actions per markdown */}
                        <button className="text-blue-600 hover:text-blue-900">Download</button>
                        <button className="text-red-600 hover:text-red-900">View</button>
                        <button onClick={() => handleDeleteDocument(doc.id)} className="text-slate-600 hover:text-slate-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Upload Document */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title={editingDocument ? 'Update Document' : 'Upload Document'}>
        <DocumentForm initialData={editingDocument} onSubmit={handleSaveDocument} onClose={() => setIsUploadModalOpen(false)} />
      </Modal>
    </div>
  );
}
