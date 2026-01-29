# Compliance and Document Management Module Rules

## Document Table
| Column | Type | Required | Notes |
|------|------|---------|------|
| id | uuid | yes | Primary Key |
| document_type | enum(registration, insurance, permit, license, inspection, contract, other) | yes | Document category |
| related_entity_type | enum(vehicle, driver, fleet) | yes | Entity type |
| related_entity_id | uuid | yes | Foreign Key to entity |
| document_name | string | yes | Document title |
| document_number | string | no | Official document number |
| issuing_authority | string | yes | Issuing organization |
| issue_date | date | yes | Date issued |
| expiry_date | date | no | Expiration date |
| file_url | string | yes | Storage path |
| file_type | string | yes | pdf, jpg, png, etc. |
| file_size | number | yes | File size in bytes |
| status | enum(active, expired, expiring_soon, revoked) | yes | Current status |
| reminder_days | number | yes | Days before expiry to alert |
| notes | text | no | Additional information |
| uploaded_by | uuid | yes | Foreign Key to users |
| created_at | timestamp | yes | Auto-generated |
| updated_at | timestamp | yes | Auto-updated |

## Compliance Alert Table
| Column | Type | Required | Notes |
|------|------|---------|------|
| id | uuid | yes | Primary Key |
| document_id | uuid | yes | Foreign Key to documents |
| alert_type | enum(expiring_soon, expired, missing) | yes | Alert category |
| alert_date | date | yes | When alert was triggered |
| days_until_expiry | number | no | Days remaining |
| is_acknowledged | boolean | yes | User acknowledgment |
| acknowledged_by | uuid | no | Foreign Key to users |
| acknowledged_at | timestamp | no | Acknowledgment time |
| resolved_at | timestamp | no | Resolution time |

## Document Categories Configuration
| Document Type | Required For | Renewal Required | Critical |
|--------------|--------------|------------------|----------|
| registration | vehicle | yes | yes |
| insurance | vehicle | yes | yes |
| permit | vehicle | yes | yes |
| license | driver | yes | yes |
| inspection | vehicle | yes | yes |
| contract | vehicle/driver | no | no |

## Document Upload Form
- Document Type (select, required: registration, insurance, permit, license, inspection, contract, other)
- Related To (select, required: vehicle/driver)
- Select Vehicle/Driver (select, required, dynamic based on previous selection)
- Document Name (text, required)
- Document Number (text, optional)
- Issuing Authority (text, required)
- Issue Date (date, required)
- Expiry Date (date, optional but required for certain types)
- File Upload (file, required, pdf/jpg/png, max 25MB)
- Reminder Days Before Expiry (number, default: 30)
- Notes (textarea, optional)

## Actions
- Upload Document (primary, submit)
- Update Document Details (primary, submit)
- Replace Document File (secondary, file upload)
- Delete Document (danger, confirmation required)
- Download Document (secondary, download file)
- Preview Document (secondary, opens viewer)
- Send Reminder (secondary, email notification)
- Acknowledge Alert (success, dismisses alert)
- Mark as Renewed (success, creates new document entry)
- Bulk Upload (secondary, multiple files)
- Export Compliance Report (secondary, PDF/Excel)

## Business Rules
- Critical documents (registration, insurance, license) must always be current
- Vehicle/driver cannot be set to 'active' status if critical documents are expired
- Automatic status updates:
  - 'expiring_soon' when days_until_expiry ≤ reminder_days
  - 'expired' when current_date > expiry_date
- Alerts generated automatically:
  - 30 days before expiry (first reminder)
  - 14 days before expiry (second reminder)
  - 7 days before expiry (urgent reminder)
  - On expiry date (critical alert)
  - Every 7 days after expiry until resolved
- Document number must be unique per document type
- File retention policy: documents retained for 7 years after expiry
- Audit trail for all document uploads and modifications

## Compliance Dashboard Metrics
- Total active documents
- Documents expiring within 30 days
- Expired documents count
- Compliance rate by entity (vehicle/driver)
- Documents by type and status
- Alert acknowledgment rate
- Average resolution time for expired documents

## Automated Reminders
- Email notifications to responsible parties
- Dashboard alerts for expired/expiring documents
- Weekly compliance summary reports
- Monthly compliance audit reports
- Escalation to management for unresolved critical expirations

## Document Renewal Workflow
1. System detects approaching expiry
2. Reminder sent to document owner
3. New document uploaded (marks previous as 'renewed')
4. Verification and approval
5. Old document archived with reference to new
6. Compliance status updated

## Search & Filter Options
- By document type
- By related entity (vehicle/driver)
- By status (active/expired/expiring)
- By issuing authority
- By date range (issue/expiry)
- By alert status
- Full-text search in document names and numbers
