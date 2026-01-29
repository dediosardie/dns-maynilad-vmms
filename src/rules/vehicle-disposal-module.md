# Vehicle Disposal Management Module Rules

## Disposal Request Table
| Column | Type | Required | Notes |
|------|------|---------|------|
| id | uuid | yes | Primary Key |
| disposal_number | string | yes | Unique, auto-generated |
| vehicle_id | uuid | yes | Foreign Key to vehicles |
| disposal_reason | enum(end_of_life, excessive_maintenance, accident_damage, upgrade, policy_change) | yes | Reason for disposal |
| recommended_method | enum(auction, best_offer, trade_in, scrap, donation) | yes | Disposal method |
| condition_rating | enum(excellent, good, fair, poor, salvage) | yes | Vehicle condition |
| current_mileage | number | yes | Odometer reading |
| estimated_value | decimal | yes | Valuation amount |
| requested_by | uuid | yes | Foreign Key to users |
| request_date | date | yes | Request submission date |
| approval_status | enum(pending, approved, rejected) | yes | Approval state |
| approved_by | uuid | no | Foreign Key to users |
| approval_date | date | no | Approval timestamp |
| rejection_reason | text | no | If rejected |
| status | enum(pending_approval, listed, bidding_open, sold, transferred, cancelled) | yes | Current status |
| created_at | timestamp | yes | Auto-generated |
| updated_at | timestamp | yes | Auto-updated |

## Disposal Auction Table
| Column | Type | Required | Notes |
|------|------|---------|------|
| id | uuid | yes | Primary Key |
| disposal_id | uuid | yes | Foreign Key to disposal_requests |
| auction_type | enum(public, sealed_bid, online) | yes | Auction method |
| start_date | timestamp | yes | Auction start |
| end_date | timestamp | yes | Auction end |
| starting_price | decimal | yes | Minimum bid |
| reserve_price | decimal | no | Minimum acceptable price |
| current_highest_bid | decimal | no | Current high bid |
| total_bids | number | yes | Bid count, default: 0 |
| winner_id | uuid | no | Winning bidder |
| winning_bid | decimal | no | Final sale price |
| auction_status | enum(scheduled, active, closed, awarded, cancelled) | yes | Status |

## Bid Table
| Column | Type | Required | Notes |
|------|------|---------|------|
| id | uuid | yes | Primary Key |
| auction_id | uuid | yes | Foreign Key to disposal_auctions |
| bidder_name | string | yes | Bidder identification |
| bidder_contact | string | yes | Email/phone |
| bid_amount | decimal | yes | Bid value |
| bid_date | timestamp | yes | Submission timestamp |
| is_valid | boolean | yes | Validation status |
| notes | text | no | Bidder notes/comments |

## Disposal Transfer Table
| Column | Type | Required | Notes |
|------|------|---------|------|
| id | uuid | yes | Primary Key |
| disposal_id | uuid | yes | Foreign Key to disposal_requests |
| buyer_name | string | yes | New owner name |
| buyer_contact | string | yes | Contact information |
| buyer_id_number | string | yes | ID/Registration number |
| buyer_address | text | yes | Physical address |
| sale_price | decimal | yes | Final transaction amount |
| payment_method | enum(cash, check, bank_transfer, finance) | yes | Payment type |
| payment_status | enum(pending, partial, completed) | yes | Payment state |
| payment_date | date | no | When payment received |
| transfer_date | date | yes | Ownership transfer date |
| transfer_document_url | string | no | Transfer documentation |
| deregistration_date | date | no | DMV deregistration |
| deregistration_proof_url | string | no | Deregistration proof |
| final_odometer | number | yes | Final reading |
| transfer_status | enum(pending_payment, pending_documents, completed) | yes | Transfer stage |
| notes | text | no | Additional information |

## Disposal Request Form
- Vehicle (select, required, exclude already disposed)
- Disposal Reason (select, required: end_of_life, excessive_maintenance, accident_damage, upgrade, policy_change)
- Recommended Method (select, required: auction, best_offer, trade_in, scrap, donation)
- Condition Rating (select, required: excellent, good, fair, poor, salvage)
- Current Mileage (number, required)
- Estimated Value (number, required, decimal)
- Detailed Justification (textarea, required, min 100 characters)
- Supporting Documents (file upload, optional, maintenance records, appraisal)
- Proposed Timeline (date, required)

## Auction Setup Form
- Disposal Request (select, required, approved only)
- Auction Type (select, required: public, sealed_bid, online)
- Start Date (datetime, required)
- End Date (datetime, required)
- Starting Price (number, required, decimal)
- Reserve Price (number, optional, decimal)
- Auction Terms (textarea, required)
- Vehicle Photos (multi-file upload, required)
- Inspection Allowed (checkbox, default: true)

## Bid Submission Form (Public Portal)
- Bidder Name (text, required)
- Contact Email (email, required)
- Contact Phone (tel, required)
- Bid Amount (number, required, must exceed current highest bid)
- Terms Acceptance (checkbox, required)
- Bidder Comments (textarea, optional)

## Transfer of Ownership Form
- Disposal Request (select, required, from awarded auctions)
- Buyer Name (text, required)
- Buyer Contact (email/phone, required)
- Buyer ID Number (text, required)
- Buyer Address (textarea, required)
- Sale Price (number, required, decimal)
- Payment Method (select, required: cash, check, bank_transfer, finance)
- Payment Status (select, required: pending, partial, completed)
- Payment Date (date, required if status is completed)
- Transfer Date (date, required)
- Transfer Documents (file upload, required, PDF)
- Deregistration Date (date, optional)
- Deregistration Proof (file upload, optional)
- Final Odometer Reading (number, required)
- Additional Notes (textarea, optional)

## Actions
- Submit Disposal Request (primary, submit)
- Approve/Reject Request (primary, requires approval authority)
- Create Auction (primary, opens auction form)
- Update Auction (primary, submit)
- Cancel Auction (danger, confirmation required)
- Submit Bid (success, public portal)
- Award Auction (success, select winning bid)
- Record Transfer (primary, ownership transfer form)
- Upload Transfer Documents (secondary, file upload)
- Complete Disposal (success, final action, updates vehicle status)
- Generate Disposal Report (secondary, PDF)
- View Bid History (secondary, displays all bids)
- Send Notifications (secondary, email bidders)

## Business Rules
- Disposal request requires management approval for vehicles valued > $10,000
- Vehicle must be in 'maintenance' or 'disposed' status to create disposal request
- Auction end date must be at least 7 days after start date
- Minimum bid increment: 5% of current highest bid
- Reserve price must be ≥ starting price
- Cannot accept bids after auction end date
- Winning bid must meet reserve price (if set)
- Payment must be completed before ownership transfer
- Vehicle automatically set to 'disposed' status after transfer completion
- All outstanding maintenance records and documents must be cleared before disposal

## Disposal Process Workflow
1. **Request Phase**
   - User submits disposal request
   - Management reviews and approves/rejects
   
2. **Listing Phase**
   - Approved request listed for disposal
   - Method selected (auction/best offer/trade-in)
   
3. **Bidding Phase** (if auction)
   - Auction created and published
   - Bids collected
   - Highest bidder determined
   
4. **Award Phase**
   - Winner notified
   - Payment processed
   
5. **Transfer Phase**
   - Ownership transfer documentation
   - Deregistration from fleet
   - Final records archived
   
6. **Completion**
   - Vehicle status set to 'disposed'
   - Final disposal report generated

## Notifications & Alerts
- Disposal request submitted (to approvers)
- Request approved/rejected (to requester)
- Auction going live (to potential bidders)
- New bid received (to previous highest bidder)
- Auction ending soon (24 hours before close)
- Auction closed (to all participants)
- Winning bid notification (to winner)
- Payment reminder (if payment pending)
- Transfer completion (to all stakeholders)

## Reporting & Analytics
- Total vehicles disposed per period
- Average disposal value vs. book value
- Disposal method distribution
- Time from request to completion
- Revenue from disposals
- Best performing auction types
- Disposal reasons analysis
