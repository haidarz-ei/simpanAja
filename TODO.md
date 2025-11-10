# Animation Implementation Plan

## Overview
Apply framer-motion animations to all pages similar to Admin dashboard style, including slide-ins, fade-ins with delays, and hover effects.

## Pages to Update
- [ ] Home (HeroSection, FeatureSection, HowItWorks)
- [ ] Packages (ShipmentCard components)
- [ ] Kirim (ShippingForm)
- [ ] Pembayaran (payment form)
- [ ] Riwayat (history page)

## Animation Patterns to Apply
1. **Slide-in effects**: Elements slide in from left/right/top/bottom
2. **Fade-in with opacity**: Elements fade in gradually
3. **Staggered animations**: Multiple elements animate with delays
4. **Hover effects**: Elements scale/transform on hover
5. **Container animations**: Page sections animate as a whole

## Implementation Steps
1. Update HeroSection.tsx - Add slide-in animations for hero content, floating packages, and buttons
2. Update FeatureSection.tsx - Add staggered card animations
3. Update HowItWorks.tsx - Add step-by-step animations with delays
4. Update Packages.tsx - Add animations to shipment cards and floating button
5. Update ShippingForm.tsx - Add form step animations and transitions
6. Update Pembayaran.tsx - Add payment form animations
7. Update Riwayat.tsx - Add history list animations
8. Update ShipmentCard.tsx - Add card hover and entry animations

## Animation Types
- `motion.div` for containers
- `motion.aside` for sidebars
- `motion.button` for interactive elements
- `motion.card` for card components
- Stagger children animations
- Hover scale effects
