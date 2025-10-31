# Design Guidelines for SimpanAja PWA

## Design Approach

**Selected Approach**: Design System with Modern Logistics Platform References

Drawing inspiration from successful shipping and logistics platforms (ShipStation, Shipper Indonesia) combined with Material Design principles for form-heavy applications. The design prioritizes clarity, trust-building, and mobile-first efficiency given the PWA nature and Indonesian market context.

**Key Design Principles**:
1. **Clarity First**: Every element serves a clear purpose in the shipping workflow
2. **Trust Through Simplicity**: Clean, professional aesthetic builds confidence in financial transactions
3. **Progressive Disclosure**: Complex information revealed contextually, not overwhelming users upfront
4. **Mobile-Native Feel**: Despite being web-based, interaction patterns mirror native mobile apps

---

## Core Design Elements

### A. Typography System

**Font Stack**: 
- Primary: Inter (via Google Fonts CDN) - excellent readability for forms and data
- Fallback: System UI fonts

**Hierarchy**:
- Hero/Page Titles: text-3xl md:text-4xl, font-bold (32-40px)
- Section Headers: text-2xl, font-semibold (24px)
- Card/Component Titles: text-lg, font-semibold (18px)
- Body Text: text-base, font-normal (16px) - optimized for mobile reading
- Secondary/Helper Text: text-sm, font-normal (14px)
- Labels: text-sm, font-medium (14px) - slightly heavier for form clarity
- Price/Important Numbers: text-xl md:text-2xl, font-bold (20-24px)

**Text Treatment**:
- Line height: leading-relaxed for body text (1.625)
- Paragraph spacing: mb-4 for comfortable reading
- Form labels: mb-2 for clear separation from inputs

### B. Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16**

Common Applications:
- Component padding: p-4 md:p-6 (mobile to desktop)
- Section padding: py-12 md:py-16 (generous vertical rhythm)
- Card padding: p-6
- Form field spacing: space-y-6 (between field groups)
- Button padding: px-6 py-3
- Icon-text spacing: gap-2
- Grid gaps: gap-4 md:gap-6

**Container Strategy**:
- Max width: max-w-7xl for main content
- Form containers: max-w-2xl (optimal form width)
- Dashboard layouts: max-w-screen-xl
- Mobile padding: px-4
- Desktop padding: px-6 lg:px-8

**Grid Patterns**:
- Mobile: Always single column (grid-cols-1)
- Tablet: Two columns for feature cards (md:grid-cols-2)
- Desktop: Three columns for service features, courier options (lg:grid-cols-3)
- Admin dashboard: Four columns for stats (lg:grid-cols-4)

---

## C. Component Library

### Navigation (Mobile PWA Bottom Tab)

**Structure**: Fixed bottom navigation bar (since PWA mimics native app)
- Height: h-16
- Items: 4 main tabs (Home, Kirim Paket, Riwayat, Profile)
- Icon + Label pattern
- Active state clearly distinguished with icon fill and font-weight-semibold

### Hero Section (Landing Page)

**Layout**: 
- Compact hero optimized for mobile viewport: min-h-[60vh] md:min-h-[70vh]
- Two-column on desktop: Text (60%) + Illustration/Phone mockup (40%)
- Mobile: Stacked, image secondary

**Content**:
- Main headline highlighting pain point solution
- Sub-headline with key value proposition (24/7 access, no waiting)
- Primary CTA button (large, prominent)
- Trust indicators: "Terintegrasi dengan [courier logos]" badges
- Optional: Simple illustration showing self-service flow

**Image**: Hero includes a phone mockup showing the app interface or abstract shipping illustration (modern, clean, professional)

### Forms (Critical Component)

**Shipping Form Structure**:
- Clear step indicators if multi-step (Step 1/3 with progress bar)
- Grouped sections with headers:
  - "Data Pengirim" section
  - "Data Penerima" section  
  - "Detail Paket" section
  - "Pilih Kurir" section
- Input fields with consistent spacing (space-y-4)
- Labels always visible above inputs
- Helper text below inputs (text-sm)
- Error states with clear messaging

**Input Fields**:
- Height: h-12 (comfortable tap target)
- Rounded corners: rounded-lg
- Border: border-2 with clear focus states
- Padding: px-4
- Font size: text-base (never smaller for inputs)

**Select Dropdowns & Pickers**:
- Same height as inputs (h-12)
- Chevron icon indicating dropdown
- Mobile: Native select elements for better UX
- Desktop: Can use custom dropdowns

### Cards

**Courier Selection Cards** (Critical for user choice):
- Display: grid layout with gap-4
- Card structure: p-6, rounded-xl, border-2
- Content hierarchy:
  - Courier logo (h-8 max)
  - Service name (font-semibold)
  - Estimated delivery time
  - Price (prominent, text-xl font-bold)
  - Checkbox/Radio for selection
- Hover/selected state clearly distinguished

**Shipping History Cards**:
- Timeline-style layout
- Each card includes: tracking number, status badge, date, destination, courier
- Status badges with distinct visual treatment
- Tap to expand for full details

**Feature Cards** (Landing page):
- Icon at top (from Heroicons, w-12 h-12)
- Title (text-lg font-semibold)
- Description (2-3 lines, text-sm)
- Minimal padding: p-6
- Subtle border or shadow for depth

### Buttons

**Primary CTA**:
- Size: px-6 py-3 (md:px-8 py-4 for hero)
- Rounded: rounded-lg
- Font: text-base font-semibold
- Width: Full-width on mobile for important actions (w-full), auto on desktop

**Secondary Buttons**:
- Same size as primary
- Border variant with transparent background
- Font: text-base font-medium

**Icon Buttons**:
- Size: w-10 h-10 (comfortable tap target)
- Rounded: rounded-full
- Center-aligned icon

### Dashboard (Admin)

**Stats Cards** (Top row):
- Grid: grid-cols-2 md:grid-cols-4
- Content: Icon, label, large number, trend indicator
- Padding: p-6
- Quick visual scanning optimized

**Data Tables**:
- Mobile: Card-based layout (no tables)
- Desktop: Traditional table with sticky header
- Columns: Tracking #, Sender, Status, Date, Actions
- Row actions: Icon buttons (view, edit, delete)
- Pagination at bottom

**Filters & Search**:
- Sticky top bar below header
- Search input prominent (w-full md:w-96)
- Filter chips for quick filtering (date range, status, courier)

### Status Badges

- Pill-shaped: px-3 py-1, rounded-full
- Text: text-xs font-semibold uppercase tracking-wide
- States: Pending, Dikemas, Dikirim, Selesai, Dibatalkan
- Each with appropriate semantic treatment

### Modals/Overlays

**Payment Modal**:
- Max-width: max-w-lg
- Padding: p-6
- Clear close button (top-right)
- Content: Summary, payment method selection, confirm button

**Confirmation Dialogs**:
- Centered, max-w-md
- Clear Yes/No actions
- Warning icon for destructive actions

### Interactive Guides/Tooltips

**First-Time User Onboarding**:
- Spotlight effect on key UI elements
- Popover with arrow pointing to element
- Simple text explaining feature
- "Next" and "Skip" options
- Progress dots showing step count

---

## D. Page-Specific Layouts

### Landing Page

**Sections** (in order):
1. **Hero**: Value proposition + CTA + trust badges
2. **Problem-Solution**: Two-column layout explaining pain points vs. SimpanAja benefits
3. **How It Works**: 3-step process with icons (Isi Form → Pilih Kurir → Bayar)
4. **Features**: 3-column grid of key features (24/7 Access, Auto Tarif, Banyak Kurir, Admin Dashboard)
5. **Testimonials**: 2-column quotes from users/admin
6. **CTA Section**: Final conversion push with prominent button
7. **Footer**: Links, contact, social, payment logos

Each section: py-16 md:py-20 spacing

### Shipping Form Page

- Sticky header with progress indicator
- Form in centered container (max-w-2xl)
- Live price calculation sidebar on desktop (sticky)
- Mobile: Price summary at bottom (sticky)
- Clear "Lanjutkan" button at form bottom

### Admin Dashboard

- Sidebar navigation on desktop (w-64)
- Mobile: Hidden sidebar, hamburger menu
- Main content area: Stats → Filters → Table
- Floating action button for "Tambah Pengiriman Manual" (if needed)

---

## E. Animations

**Minimal & Purposeful**:
- Page transitions: Simple fade (200ms)
- Button interactions: Scale on press (95% scale, 100ms) - handled by Button component
- Card hovers: Subtle shadow increase (200ms)
- Form validation: Shake animation on error (300ms)
- Success confirmations: Checkmark with scale animation (400ms)
- Loading states: Spinner or skeleton screens, no elaborate animations

**Avoid**: Page scroll animations, parallax, complex transitions

---

## Images

**Hero Image**: 
- Phone mockup showing app interface or modern 3D illustration of shipping/delivery
- Placement: Right side on desktop, below text on mobile
- Style: Clean, modern, professional

**Feature Section Icons**: 
- Use Heroicons for consistency (outline style)
- Size: w-10 h-10 or w-12 h-12

**Courier Logos**:
- Standard sizes: h-8 for cards, h-6 for badges
- Maintain aspect ratio

**Payment Method Icons**:
- Standardized display in footer and payment modal

No large background images or decorative elements that slow load time on mobile networks.