# Trip Scheduling and Route Optimization Module Rules

## Trip Table
| Column | Type | Required | Notes |
|------|------|---------|------|
| id | uuid | yes | Primary Key |
| vehicle_id | uuid | yes | Foreign Key to vehicles |
| driver_id | uuid | yes | Foreign Key to drivers |
| origin | string | yes | Starting location |
| destination | string | yes | End location |
| planned_departure | timestamp | yes | Scheduled departure time |
| planned_arrival | timestamp | yes | Estimated arrival time |
| actual_departure | timestamp | no | Actual departure time |
| actual_arrival | timestamp | no | Actual arrival time |
| status | enum(planned, in_progress, completed, cancelled) | yes | Current trip status |
| distance_km | decimal | yes | Planned distance |
| estimated_fuel_consumption | decimal | yes | Expected fuel usage |
| route_waypoints | json | no | Optimized route points |
| notes | text | no | Additional trip information |
| created_at | timestamp | yes | Auto-generated |
| updated_at | timestamp | yes | Auto-updated |

## Trip Form
- Vehicle (select, required, from active vehicles)
- Driver (select, required, from available drivers)
- Origin (text/autocomplete, required)
- Destination (text/autocomplete, required)
- Planned Departure (datetime, required)
- Planned Arrival (datetime, required)
- Distance (number, required, km)
- Estimated Fuel Consumption (number, required, liters)
- Route Waypoints (multi-location picker, optional)
- Notes (textarea, optional)

## Actions
- Create Trip (primary, submit)
- Update Trip (primary, submit)
- Start Trip (success, updates status to in_progress, records actual_departure)
- Complete Trip (success, updates status to completed, records actual_arrival)
- Cancel Trip (danger, confirmation required)
- Optimize Route (secondary, recalculates route_waypoints for fuel efficiency)
- View Route Map (secondary, displays visual route)

## Business Rules
- Cannot assign vehicle that is in maintenance or disposed status
- Cannot assign driver who is already assigned to an active trip
- Planned arrival must be after planned departure
- Route optimization considers: distance, traffic patterns, fuel efficiency
- Alert if estimated fuel consumption exceeds vehicle's fuel capacity
- Automatically suggest optimal departure times based on traffic data

## Status Transitions
- planned → in_progress (when trip starts)
- in_progress → completed (when trip ends)
- planned → cancelled (before trip starts)
- in_progress → cancelled (emergency cancellation)
