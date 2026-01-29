# Maintenance Module Rules

## Maintenance Table
| Column | Type | Required |
|------|------|---------|
| id | uuid | yes |
| vehicle_id | uuid | yes |
| maintenance_type | enum(preventive, repair) | yes |
| scheduled_date | date | yes |
| status | enum(pending, completed) | yes |
| cost | number | no |

## Maintenance Form
- Vehicle (select, required)
- Maintenance Type (select)
- Scheduled Date (date)
- Cost (number)

## Actions
- Schedule Maintenance (primary)
- Mark Completed (success)
