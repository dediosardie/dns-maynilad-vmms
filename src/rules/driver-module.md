# Driver Module Rules

## Driver Table
| Column | Type | Required |
|------|------|---------|
| id | uuid | yes |
| full_name | string | yes |
| license_number | string | yes |
| license_expiry | date | yes |
| status | enum(active, suspended) | yes |

## Driver Form
- Full Name (text, required)
- License Number (text, required)
- License Expiry (date, required)
- Status (select: active, suspended)

## Actions
- Save Driver (primary)
- Suspend Driver (danger)
