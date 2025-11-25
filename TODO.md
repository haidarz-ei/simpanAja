# TODO: Fix Kartu Lengkap Issue

## Current Issue
After completing form and getting package code, the complete card doesn't appear. The flow immediately finalizes and navigates to history.

## Plan
Add step 4 to show complete package card before finalizing.

## Tasks
- [ ] Modify ShippingForm.tsx to add step 4: Complete Package Card
- [ ] Update step indicators from 3 to 4 steps
- [ ] Create Step4CompleteCard.tsx component using ShipmentCard
- [ ] Modify handleNext logic: step 3 -> step 4, step 4 -> finalize
- [ ] Update button text and navigation logic
- [ ] Test the complete flow

## Files to Modify
- client/src/components/ShippingForm.tsx
- Create client/src/components/Step4CompleteCard.tsx

## Followup
- Test that complete card appears after getting code
- Verify finalization works correctly
- Check navigation to riwayat page
