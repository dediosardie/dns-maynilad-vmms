# Incident & Insurance Management and Reporting Module Rules

## Incident Table
| Column | Type | Required | Notes |
|------|------|---------|------|
| id | uuid | yes | Primary Key |
| incident_number | string | yes | Unique, auto-generated |
| vehicle_id | uuid | yes | Foreign Key to vehicles |
| driver_id | uuid | yes | Foreign Key to drivers |
| incident_date | timestamp | yes | Date/time of incident |
| location | string | yes | Incident location |
| incident_type | enum(collision, theft, vandalism, mechanical_failure, other) | yes | Type of incident |
| severity | enum(minor, moderate, severe, critical) | yes | Severity level |
| description | text | yes | Detailed description |
| weather_conditions | string | no | Weather at time of incident |
| road_conditions | string | no | Road condition description |
| police_report_number | string | no | Official police report ref |
| witnesses | json | no | Array of witness information |
| status | enum(reported, under_investigation, resolved, closed) | yes | Current status |
| estimated_cost | decimal | no | Estimated repair/claim cost |
| actual_cost | decimal | no | Final cost |
| assigned_to | uuid | no | Foreign Key to users (investigator) |
| resolution_notes | text | no | Final resolution details |
| reported_by | uuid | yes | Foreign Key to users |
| created_at | timestamp | yes | Auto-generated |
| updated_at | timestamp | yes | Auto-updated |
| resolved_at | timestamp | no | Resolution timestamp |

## Incident Photos Table
| Column | Type | Required | Notes |
|------|------|---------|------|
| id | uuid | yes | Primary Key |
| incident_id | uuid | yes | Foreign Key to incidents |
| photo_url | string | yes | Storage path |
| description | string | no | Photo description |
| uploaded_at | timestamp | yes | Upload timestamp |
| uploaded_by | uuid | yes | Foreign Key to users |

## Insurance Claim Table
| Column | Type | Required | Notes |
|------|------|---------|------|
| id | uuid | yes | Primary Key |
| incident_id | uuid | yes | Foreign Key to incidents |
| claim_number | string | yes | Insurance claim reference |
| insurance_company | string | yes | Insurer name |
| policy_number | string | yes | Policy reference |
| claim_date | date | yes | Date claim was filed |
| claim_amount | decimal | yes | Claimed amount |
| approved_amount | decimal | no | Approved claim amount |
| status | enum(filed, pending, approved, rejected, paid) | yes | Claim status |
| adjuster_name | string | no | Insurance adjuster |
| adjuster_contact | string | no | Contact information |
| notes | text | no | Claim notes |

## Incident Report Form
- Incident Date (datetime, required)
- Vehicle (select, required, from active vehicles)
- Driver (select, required, from active drivers)
- Location (text, required)
- Incident Type (select, required: collision, theft, vandalism, mechanical_failure, other)
- Severity (select, required: minor, moderate, severe, critical)
- Description (textarea, required, min 50 characters)
- Weather Conditions (text, optional)
- Road Conditions (text, optional)
- Police Report Number (text, optional)
- Witnesses (repeatable fields: name, contact, statement)
- Photos (multi-file upload, jpg/png, max 10MB each)
- Estimated Cost (number, optional, decimal)

## Insurance Claim Form
- Incident (select, required, from incidents)
- Claim Number (text, required)
- Insurance Company (text, required)
- Policy Number (text, required)
- Claim Date (date, required, default: today)
- Claim Amount (number, required, decimal)
- Adjuster Name (text, optional)
- Adjuster Contact (text, optional)
- Supporting Documents (multi-file upload)
- Notes (textarea, optional)

## Actions
- Report Incident (primary, submit)
- Update Incident (primary, submit)
- Upload Photos (secondary, multi-file)
- Assign Investigator (secondary, user select)
- Update Status (secondary, status select)
- Resolve Incident (success, requires resolution notes)
- Close Incident (success, final action)
- File Insurance Claim (primary, opens claim form)
- Update Claim Status (secondary)
- Generate Report (secondary, PDF export)
- Print Incident Report (secondary)

## Business Rules
- Incident number format: INC-YYYY-NNNNNN (auto-generated)
- Severe and critical incidents must be assigned to investigator within 24 hours
- Photos required for collision and vandalism incidents
- Police report required for theft and severe collisions
- Insurance claim can only be filed for incidents with estimated cost > $1000
- Vehicle status automatically set to 'maintenance' for severe/critical incidents
- Automated notifications to management for critical incidents
- Cannot close incident if insurance claim is still pending

## Status Workflows
### Incident Status
- reported → under_investigation (when investigator assigned)
- under_investigation → resolved (when investigation complete)
- resolved → closed (final approval)

### Claim Status
- filed → pending (awaiting adjuster review)
- pending → approved/rejected (adjuster decision)
- approved → paid (payment received)

## Notifications & Alerts
- Immediate alert for critical incidents
- Daily summary of open incidents
- Reminder for incidents under investigation > 7 days
- Alert when claim is approved/rejected
- Notification when resolution notes are added
