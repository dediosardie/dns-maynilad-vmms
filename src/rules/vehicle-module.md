# Vehicle Module Rules

## Vehicle Table
| Column | Type | Required | Notes |
|------|------|---------|------|
| id | uuid | yes | Primary Key |
| plate_number | string | yes | Unique |
| make | string | yes | |
| model | string | yes | |
| year | number | yes | |
| vin | string | yes | Unique |
| ownership_type | enum(owned, leased) | yes | |
| status | enum(active, maintenance, disposed) | yes | |
| insurance_expiry | date | yes | |
| registration_expiry | date | yes | |

## Vehicle Form
- Plate Number (text, required)
- Make (text, required)
- Model (text, required)
- Year (number, required)
- VIN (text, required)
- Ownership Type (select: owned, leased)
- Status (select: active, maintenance, disposed)
- Insurance Expiry (date)
- Registration Expiry (date)

## Actions
- Save Vehicle (primary, submit)
- Update Vehicle (primary, submit)
- Dispose Vehicle (danger, confirmation required)
