# Fuel Tracking and Efficiency Monitoring Module Rules

## Fuel Transaction Table
| Column | Type | Required | Notes |
|------|------|---------|------|
| id | uuid | yes | Primary Key |
| vehicle_id | uuid | yes | Foreign Key to vehicles |
| driver_id | uuid | yes | Foreign Key to drivers |
| transaction_date | timestamp | yes | Date/time of refueling |
| odometer_reading | number | yes | Current odometer reading |
| liters | decimal | yes | Fuel quantity |
| cost | decimal | yes | Total cost |
| cost_per_liter | decimal | yes | Unit price |
| fuel_type | enum(diesel, petrol, electric, hybrid) | yes | Type of fuel |
| station_name | string | no | Fuel station name |
| station_location | string | no | Fuel station location |
| receipt_image_url | string | no | Receipt photo storage path |
| is_full_tank | boolean | yes | Full tank indicator |
| created_at | timestamp | yes | Auto-generated |

## Fuel Efficiency Metrics Table
| Column | Type | Required | Notes |
|------|------|---------|------|
| id | uuid | yes | Primary Key |
| vehicle_id | uuid | yes | Foreign Key to vehicles |
| period_start | date | yes | Reporting period start |
| period_end | date | yes | Reporting period end |
| total_liters | decimal | yes | Total fuel consumed |
| total_distance | decimal | yes | Total distance traveled (km) |
| average_consumption | decimal | yes | Liters per 100km |
| total_cost | decimal | yes | Total fuel cost |
| efficiency_rating | enum(excellent, good, average, poor) | yes | Performance rating |
| baseline_consumption | decimal | yes | Expected consumption rate |
| variance_percentage | decimal | yes | Deviation from baseline |

## Fuel Transaction Form
- Vehicle (select, required, from active vehicles)
- Driver (select, required, from active drivers)
- Transaction Date (datetime, required, default: now)
- Odometer Reading (number, required, km)
- Liters (number, required, decimal)
- Cost (number, required, decimal)
- Cost Per Liter (number, required, auto-calculated)
- Fuel Type (select, required: diesel, petrol, electric, hybrid)
- Station Name (text, optional)
- Station Location (text, optional)
- Receipt Image (file upload, optional, jpg/png)
- Full Tank (checkbox, default: true)

## Actions
- Record Fuel Transaction (primary, submit)
- Update Transaction (primary, submit)
- Delete Transaction (danger, confirmation required)
- Upload Receipt (secondary, file upload)
- View Efficiency Report (secondary, opens analytics view)
- Export Data (secondary, CSV/PDF export)
- Flag Anomaly (warning, marks transaction for review)

## Business Rules
- Odometer reading must be greater than previous reading for same vehicle
- Alert if fuel consumption exceeds vehicle's expected threshold by 20%
- Alert if cost per liter is significantly higher than market average
- Calculate efficiency automatically: (liters / distance) * 100
- Efficiency rating thresholds:
  - Excellent: ≤ 10% above baseline
  - Good: 10-20% above baseline
  - Average: 20-30% above baseline
  - Poor: > 30% above baseline
- Generate monthly efficiency reports automatically
- Send alerts for vehicles with declining efficiency trends

## Monitoring & Alerts
- Real-time consumption vs. baseline comparison
- Anomaly detection for unusual fuel usage patterns
- Predictive alerts for fuel budget overruns
- Driver efficiency rankings and feedback
- Cost trend analysis and forecasting
