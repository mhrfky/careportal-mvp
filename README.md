# CarePortal

CarePortal is a Next.js TypeScript application built as an interview project that demonstrates a simple patient-facility matching system.

## Project Overview

This interview project showcases:
- Next.js with TypeScript implementation
- Multi-step form handling
- Context API for state management
- Integration with Supabase for data storage

## Project Structure

```
careportal/
├── components/         # Reusable UI components
├── contexts/           # React context providers
├── lib/                # External service connections
├── pages/              # Application routes
├── services/           # Business logic
├── styles/             # CSS styles
└── types/              # TypeScript type definitions

## Application Flow

1. **Homepage** (`/`): Introduction screen with navigation
2. **Patient Information** (`/patient-name`): Collects patient name
3. **Care Selection** (`/care-selection`): Collects care type and zip code
4. **Results** (`/results`): Displays matched facility based on inputs

## Data Models

### Facility Model

```typescript
interface Facility {
  facility: string;       // Facility name
  stationary: boolean;    // Offers stationary care
  ambulatory: boolean;    // Offers ambulatory care
  daycare: boolean;       // Offers day care
  zip_code_min: number;   // Lower bound of service area
  zip_code_max: number;   // Upper bound of service area
  zip_code: number;       // Facility location
  capacity: boolean;      // Has capacity for new patients
}
```

### Design Decision: Boolean Fields for Care Types

I used boolean fields (stationary, ambulatory, daycare) instead of an enum or lookup table for several reasons:

1. **Query Performance**: Boolean fields allow for efficient filtering and indexing, especially as data grows
2. **Schema Flexibility**: New care types can be added as columns without breaking existing queries
3. **Multiple Care Types**: A facility can offer multiple care types simultaneously, which is easily represented with boolean flags
4. **Simplified Queries**: Using boolean fields simplifies WHERE clauses (e.g., `WHERE stationary = true`)
5. **Clear Data Model**: The approach makes it immediately clear what service capabilities each facility has

This design is particularly efficient for Supabase/PostgreSQL which can leverage bitmap indexes on boolean columns for fast filtering operations.

## Building and Running the Project

### Prerequisites

- Node.js 14+ and npm
- Supabase account (free tier is sufficient)

### Environment Setup

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

In your Supabase dashboard:

1. Create a `facilities` table with the schema matching the Facility interface above
2. Add test data to the facilities table

### Installation and Development

```bash
# Clone the repository
git clone https://github.com/yourusername/careportal.git
cd careportal

# Install dependencies
npm install

# Start the development server
npm run dev

# Create production build
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to see the application.

## Routes

| Route | Purpose | Access | Description |
|-------|---------|--------|-------------|
| `/` | Homepage | Public | Introduction screen |
| `/patient-name` | Patient Info | Public | Collects patient name |
| `/care-selection` | Care Type | Public, requires patient name | Collects care type and zip code |
| `/results` | Results | Public, requires prior steps | Displays matched facility |
| `/facilities` | Facilities List | Public | Overview of facilities |

## Notes

This is an interview project created for demonstration purposes only.