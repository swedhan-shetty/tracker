# Master Tracker Design Guidelines

## Design Approach: Linear-Inspired Productivity System

This redesign takes inspiration from Linear's minimalist, utility-focused design system, emphasizing clarity, hierarchy, and efficient information display for your comprehensive tracking application.

## Core Design Principles

1. **Information Clarity**: Every element serves data visibility and tracking efficiency
2. **Consistent Hierarchy**: Clear visual weight system across all tracking modules
3. **Refined Minimalism**: Purposeful use of space and restrained visual elements
4. **Dark-First Design**: Optimized dark theme with exceptional contrast ratios

## Color Palette

### Dark Mode (Primary)
- **Background Layers**: 
  - Primary: 220 13% 9% (main app background)
  - Elevated: 220 13% 12% (cards, sidebars)
  - Overlay: 220 13% 15% (modals, dropdowns)
- **Primary Accent**: 217 91% 60% (actions, links, active states)
- **Text Colors**:
  - Primary: 220 9% 98% (headings, important data)
  - Secondary: 220 9% 70% (body text, labels)
  - Tertiary: 220 9% 50% (helper text, placeholders)
- **Success/Data**: 142 76% 45% (positive metrics, completion)
- **Warning/Alert**: 38 92% 50% (alerts, important metrics)
- **Border/Divider**: 220 13% 20% (subtle separators)

### Light Mode (Optional Support)
- Background: 220 13% 98%
- Elevated: 0 0% 100%
- Text Primary: 220 13% 9%

## Typography

### Font Stack
- **Primary**: Inter (via Google Fonts CDN)
- **Mono**: JetBrains Mono (for numerical data, metrics)

### Scale
- **Display**: 2.5rem/600 weight (Dashboard headings)
- **H1**: 2rem/600 (Page titles)
- **H2**: 1.5rem/600 (Section headers)
- **H3**: 1.25rem/500 (Card titles, subsections)
- **Body**: 0.938rem/400 (Default text)
- **Small**: 0.813rem/400 (Labels, captions)
- **Tiny**: 0.75rem/500 (Metadata, timestamps)

## Layout System

### Spacing Primitives
Core spacing units: **2, 4, 6, 8, 12, 16** (Tailwind scale)
- Micro spacing (2, 4): Icon gaps, tight groupings
- Component spacing (6, 8): Card padding, form fields
- Section spacing (12, 16): Between major sections

### Grid Structure
- **Sidebar**: Fixed 280px width on desktop, collapsible on mobile
- **Main Content**: max-w-7xl container with px-6 padding
- **Dashboard Cards**: Grid of 3 columns (lg), 2 (md), 1 (sm)
- **Metrics Display**: 4-column grid for key stats

## Component Library

### Navigation (Sidebar)
- Fixed left sidebar with app logo at top
- Navigation items: text-sm with 12px left padding
- Active state: primary accent left border (3px) + accent text color
- Hover: elevated background color
- Icons: 20px from Heroicons (outline style)

### Dashboard Cards
- Background: elevated color
- Border: 1px solid border color
- Padding: p-6
- Rounded: rounded-lg
- Header: flex justify-between with icon + title
- Metrics: Large display numbers (2rem, 600 weight) in mono font
- Subtext: small size, tertiary color

### Data Tables (Analytics, Workouts, etc.)
- Zebra striping: alternate rows with 5% opacity overlay
- Header: sticky, uppercase text-xs, tertiary color
- Row padding: py-4 px-6
- Borders: bottom only, 1px border color
- Hover: subtle elevated background

### Form Inputs (Daily Entry)
- Height: h-10 for text inputs
- Background: elevated color
- Border: 1px border color, focus: primary accent
- Padding: px-4
- Rounded: rounded-md
- Labels: text-sm, mb-2, secondary color
- Groups: space-y-6 between form sections

### Buttons
- **Primary**: bg-accent, text-white, h-10, px-6, rounded-md, font-medium
- **Secondary**: border-2 border-accent, text-accent, bg-transparent
- **Ghost**: text-secondary, hover:text-primary, no background
- All buttons: transition-colors duration-200

### Charts & Visualizations
- Use Chart.js or Recharts with custom theme
- Grid lines: 10% opacity white
- Data series: Primary accent color with 80% opacity
- Tooltips: elevated background, rounded-lg, shadow-xl
- Axis labels: text-xs, tertiary color

### Task Cards
- Checkbox: 20px, rounded-sm, accent border/fill when checked
- Task text: strikethrough when complete, opacity-50
- Priority indicators: colored left border (4px)
- Due dates: text-xs, warning color if overdue

### Metrics/Stats Display
- Large number: 2.5rem mono font, primary text
- Label below: text-sm uppercase tracking-wide, tertiary
- Change indicator: small badge with success/warning color
- Icon: 24px, accent color, positioned top-right

### Modal/Dialog
- Backdrop: black with 60% opacity
- Container: elevated background, rounded-xl, max-w-2xl
- Padding: p-8
- Header: text-xl, mb-6
- Close button: top-right, ghost style

## Page-Specific Layouts

### Dashboard
- Header: Welcome message + date (text-2xl, mb-8)
- Quick stats: 4-column grid of metric cards
- Activity overview: 2-column split (recent entries + charts)
- Bottom section: Today's tasks + upcoming items

### Daily Entry
- Single column form, max-w-3xl centered
- Section headers: text-lg, mb-4, accent color
- Field groups: bg-elevated, p-6, rounded-lg, space-y-4
- Submit button: fixed bottom on mobile, inline on desktop

### Analytics
- Time range selector: top-right dropdown
- Chart container: elevated bg, p-6, rounded-lg, h-80
- Data table below: full-width with filters
- Export button: top-right ghost button

### Archive Sections (Supplements, Books, etc.)
- Grid layout: 3 columns (lg), 2 (md), 1 (sm)
- Card design: image/icon top, title/details below
- Search bar: sticky top, w-full, h-12

## Interactions & Micro-animations

- Hover states: subtle scale(1.01) or brightness increase
- Loading: simple spinner in accent color, 24px
- Transitions: all duration-200 for colors, duration-300 for transforms
- Page transitions: fade in content with 300ms delay

## Responsive Behavior

- **Mobile (< 768px)**: Hamburger menu, stacked layouts, bottom nav
- **Tablet (768px - 1024px)**: Collapsible sidebar, 2-column grids
- **Desktop (> 1024px)**: Full sidebar, multi-column layouts, hover states

## Accessibility

- Focus rings: 2px accent color, offset-2
- ARIA labels on all interactive elements
- Keyboard navigation: tab order follows visual hierarchy
- Color contrast: WCAG AAA compliance for all text
- Form validation: inline error messages in warning color

This design system creates a polished, professional tracking application that prioritizes data clarity and user efficiency while maintaining visual appeal through restrained minimalism.