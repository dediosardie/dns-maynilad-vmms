# LTO Vehicle Registration Renewal Calculator

## Overview
The Vehicle Form now includes automatic calculation of registration expiry dates based on Philippine Land Transportation Office (LTO) rules.

## How It Works

### LTO Registration Rules

The registration renewal schedule is determined by the **last digit of the plate number**:

| Last Digit | Renewal Month |
|------------|---------------|
| 1 | January |
| 2 | February |
| 3 | March |
| 4 | April |
| 5 | May |
| 6 | June |
| 7 | July |
| 8 | August |
| 9 | September |
| 0 | October |

### Vehicle Age Calculation

The expiry **year** is calculated based on vehicle age:

**For vehicles MORE than 3 years old:**
- Expiry Year = **Current Year**
- Expiry Date = Last day of renewal month in current year

**For vehicles 3 years old or LESS:**
- Expiry Year = **Model Year + 3**
- Expiry Date = Last day of renewal month in (model year + 3)

### Examples

#### Example 1: Old Vehicle
- **Plate Number**: ABC-123**7**
- **Model Year**: 2018
- **Current Year**: 2026
- **Vehicle Age**: 2026 - 2018 = 8 years (> 3 years)

**Calculation:**
- Last digit: **7** → July
- Age > 3 years → Use current year (2026)
- **Registration Expiry: July 31, 2026**

#### Example 2: New Vehicle
- **Plate Number**: XYZ-890**1**
- **Model Year**: 2024
- **Current Year**: 2026
- **Vehicle Age**: 2026 - 2024 = 2 years (≤ 3 years)

**Calculation:**
- Last digit: **1** → January
- Age ≤ 3 years → Use model year + 3 (2024 + 3 = 2027)
- **Registration Expiry: January 31, 2027**

#### Example 3: Plate with No Trailing Digit
- **Plate Number**: ABC-**5**DE
- **Last Found Digit**: **5**

**Calculation:**
- Last digit found: **5** → May
- Continues with age-based year calculation

## Implementation

### Automatic Calculation

The registration expiry is **automatically calculated** when you:
1. Enter or change the **Plate Number**
2. Enter or change the **Model Year**

### UI Indicators

- **Label**: Shows "(Auto-calculated by LTO rules)"
- **Success Message**: Green checkmark with confirmation when calculated
- **Background**: Light gray background indicates auto-filled field
- **Editable**: You can still manually override if needed

### Code Location

The calculation logic is in `src/components/VehicleForm.tsx`:

```typescript
const calculateRegistrationExpiry = (plateNumber: string, modelYear: number): string => {
  // Extract last digit from plate number
  const digits = plateNumber.match(/\d/g);
  const lastDigit = parseInt(digits[digits.length - 1]);
  
  // Month mapping (0-indexed)
  const monthMap = { 1: 0, 2: 1, 3: 2, ..., 0: 9 };
  
  // Calculate vehicle age
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - modelYear;
  
  // Determine expiry year
  const expiryYear = vehicleAge > 3 ? currentYear : modelYear + 3;
  
  // Get last day of target month
  const lastDayOfMonth = new Date(expiryYear, month + 1, 0).getDate();
  const expiryDate = new Date(expiryYear, month, lastDayOfMonth);
  
  return expiryDate.toISOString().split('T')[0];
}
```

## Edge Cases Handled

### No Digits in Plate Number
- If plate has no digits, calculation is skipped
- Field remains blank for manual entry

### Multiple Digits
- Always uses the **last digit** found in the plate
- Example: "ABC1D23E4" → Last digit is **4** → April

### Missing Data
- Requires both plate number AND model year
- Calculation only runs when both fields have values

### Manual Override
- Users can still manually change the calculated date
- Useful for special cases or corrections

## Testing

### Test Case 1: Brand New Vehicle
```
Plate: ABC-1234
Year: 2026
Age: 0 years
Expected: April 30, 2029 (2026 + 3)
```

### Test Case 2: 3-Year Old Vehicle (Boundary)
```
Plate: XYZ-5678
Year: 2023
Age: 3 years
Expected: August 31, 2026 (2023 + 3)
```

### Test Case 3: Old Vehicle
```
Plate: DEF-9012
Year: 2015
Age: 11 years
Expected: February 28/29, 2026 (current year)
```

### Test Case 4: October Renewal
```
Plate: GHI-7890
Year: 2020
Age: 6 years
Expected: October 31, 2026 (current year)
```

## Benefits

1. **Accuracy**: Eliminates manual calculation errors
2. **Compliance**: Ensures proper LTO renewal dates
3. **Efficiency**: Saves time during vehicle entry
4. **Transparency**: Shows calculation basis to users
5. **Flexibility**: Allows manual override when needed

## Future Enhancements

Potential improvements:
- **Week Calculation**: Use second-to-last digit for specific week within month
- **Reminder System**: Alert when expiry is approaching
- **Bulk Update**: Recalculate for all existing vehicles
- **Regional Rules**: Support different regions if rules vary
- **Validation**: Warn if manual date doesn't match LTO rules

## Notes

- The calculation uses the **last numeric digit** found in the plate number
- Months are calculated using JavaScript's Date object (0-indexed)
- The **last day of the month** is automatically determined (handles 28/29/30/31)
- February leap years are handled automatically
- The field has a light background to indicate it's auto-calculated

## Troubleshooting

### Expiry Date Not Calculating
- Ensure plate number contains at least one digit
- Verify model year is a valid 4-digit number
- Check browser console for errors

### Wrong Month Calculated
- Verify the last digit in the plate number
- Check the month mapping table above

### Wrong Year Calculated
- Confirm model year is correct
- Verify current system date is accurate
- Check if vehicle age is correctly calculated

## References

- Philippine LTO Registration Renewal Guidelines
- LTO Memorandum Circular on Staggered Registration
- Vehicle Registration Expiry Schedule by Plate Ending
