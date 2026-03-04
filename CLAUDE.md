// CLAUDE.md güncellendi - Hicri Takvim Sistemi

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Benamelapp** is a React Native mobile application for tracking Islamic deeds (amel) and spiritual activities. It uses **HIJRI CALENDAR SYSTEM** with Expo file-based routing and includes Islamic prayer time calculations, daily deed tracking, and progress analytics.

## Development Commands

```bash
# Start Expo development server
npm start
# or
expo start

# Run on specific platforms
npm run android
npm run ios
npm run web

# Database migrations (Drizzle)
npx drizzle-kit generate  # Generate migrations from schema
npx drizzle-kit push      # Push schema changes to database
```

## Architecture

### Core Systems

#### 1. Islamic Time Engine (`hooks/useTimeEngine.ts`)

The **Time Engine** is the heart of the application. It calculates Islamic prayer times using the `adhan` library and provides time references for deed scheduling.

**Key Concepts:**

- **Post-Maghrib Logic**: Islamic day starts at Maghrib (sunset), not midnight. After Maghrib, the engine shifts to "hybrid mode" - showing today's Maghrib/Isha but tomorrow's Fajr/Sunrise/Dhuhr/Asr.
- **Time References**: Prayer times (FAJR, SUNRISE, DHUHR, ASR, MAGHRIB, ISHA) plus Islamic times (MIDNIGHT, LAST_THIRD, ISHRAK, ISTIVA, ISFIRAR).
- **Hijri Dates**: Returns `actualDateHijri` and `effectiveDateHijri` (after Maghrib, effective date is tomorrow in Hijri).
- **Context Provider**: `TimeEngineProvider` wraps the app and provides full `IslamicTimeState` globally.

**Usage:**

```typescript
const engine = useTimeEngine(coords); // Returns IslamicTimeState
// engine.actualDateHijri = "1446-08-22"
// engine.effectiveDateHijri = "1446-08-23" (if post-Maghrib)
const status = getAmelStatus(engine, "FAJR", "SUNRISE");
```

#### 2. Hijri Calendar System 🌙

**CRITICAL: The entire app runs on HIJRI DATES, not Gregorian!**

**Storage Format**: `"YYYY-MM-DD"` (ISO-like Hijri) - Example: `"1446-08-22"` (22 Şaban 1446)

**Dual-Date Architecture**:

- Primary: Hijri dates (all UI, user selection, filtering)
- Backup: Gregorian dates (stored for safety, can be used if needed)

**Helper Functions** (`helpers/hijriUtils.ts`):

```typescript
getCurrentHijriDate(); // "1446-08-22"
addHijriDays(hijri, days); // Date arithmetic
compareHijriDates(h1, h2); // -1, 0, 1
formatHijriDate(hijri); // "22 Şaban 1446"
hijriToGregorianString(hijri); // "2025-02-15"
```

#### 3. Database Architecture (Drizzle ORM + Expo SQLite)

**Schema Location**: `db/schema.ts`
**Client**: `db/client.ts` - Exports `db` instance and `flushDatabase()`

**Core Tables (Hijri-based)**:

- `deeds`: Master deed definitions (title, description, points, time_mask)
- `deed_periods`: Period types (DAILY, WEEKLY_FRI, RAMADAN, etc.)
- `deed_categories`, `deed_statuses`: Organizational tables
- `user_deeds`: User's active deed list
  - **`addedAtHijri`**: "1446-08-22" (primary)
  - **`addedAtGregorian`**: "2025-02-15" (backup)
  - **`removedAtHijri`**, **`removedAtGregorian`**: Nullable
- `daily_logs`: Daily completion records
  - **`dateHijri`**: "1446-08-22" (primary, indexed)
  - **`dateGregorian`**: "2025-02-15" (backup, indexed)
  - `isIntended`, `isCompleted`, `earnedPoints`
- `resources` + `deed_resources`: Quran/Hadith references

**Query Pattern**: All database operations in `db/repos/allRequest.ts`:

```typescript
// ALWAYS use Hijri dates:
getUserDeeds(hijriDate: string) // "1446-08-22"
getDailyLogs(hijriDate: string, deedIds)
getEarliestActivityDate() // Returns earliest Hijri date
```

**Critical Period Logic**: The `getUserDeeds(hijriDate)` function uses `getDateAttributes(hijriDate)` to determine which periods apply. Periods are calculated by:

1. Parsing Hijri date
2. Converting to Gregorian to check day of week (for WEEKLY_FRI, etc.)
3. Checking Hijri month/day for special days (Ramadan, Kandils, etc.)

#### 4. State Management (Zustand)

**Stores Location**: `store/`

**Key Store (`useAppStore`)**:

```typescript
selectedHijriDate: string; // "1446-08-22" - ALWAYS Hijri!
setSelectedHijriDate(hijri: string);
goToToday(); // Sets to getCurrentHijriDate()
```

**Other Stores**:

- `useLocationStore`: GPS coordinates for prayer times

**Pattern**: Stores are minimal. Most data fetching uses TanStack React Query.

#### 5. Deed Logic (`hooks/useDeedLogic.ts`)

Combines Time Engine + database state to determine:

- Deed status (active/future/expired)
- UI colors and styles
- Button enable/disable state
- Progress percentage

**Flow:**

1. Reads `item.startRef` and `item.endRef` from database (e.g., "FAJR", "SUNRISE")
2. Calls `getAmelStatus(engine, startRef, endRef)`
3. Compares `selectedHijriDate` with current Hijri date
4. Returns UI-ready properties (themeColor, statusText, percent, containerStyle)

### File Structure Patterns

- `components/layout/pages/index/*` - Home screen components (deed-list, header, calendar, left-sheet)
- `components/layout/modals/*` - Modal screens (library, deed-details, stats)
- `components/ui/*` - Reusable UI primitives (button, card, badge, chart components)
- `components/charts/*` - Chart-specific components (Hijri-based charts)
- `hooks/*` - Business logic hooks (useTimeEngine, useDeedLogic, useDateInfo, useDateTags)
- `helpers/*` - Utility functions (hijriUtils.ts, dateUtils.ts)
- `theme/*` - Theme system (colors, useColor, useColors, theme-provider)

### Routing (Expo Router)

File-based routing in `app/` directory:

- `index.tsx` - Home screen (main deed list)
- `library.tsx` - Deed library/discovery (transparentModal)
- `stats.tsx` - Statistics screen (transparentModal)
- `deed/[id].tsx` - Deed detail screen (transparentModal)
- `_layout.tsx` - Root layout with providers + Hijri migration runner

### Data Flow

1. **App Initialization** (`app/_layout.tsx`):
   - Run Drizzle migrations
   - Run Hijri Calendar migration (`migrateToHijriCalendar()`)
   - Initialize QueryClient
   - Wrap app with TimeEngineProvider
   - Check location permissions

2. **Home Screen** (`app/index.tsx`):
   - TimeEngine provides prayer times + Hijri dates
   - `selectedHijriDate` from useAppStore
   - Fetch `getUserDeeds(selectedHijriDate)` via React Query
   - Each deed card calls `useDeedLogic(item, engine)` to determine display

3. **User Actions (Hijri-based)**:
   - Mutations in `db/repos/allMutations.ts`
   - All mutations accept **Hijri dates** and auto-convert to Gregorian for backup
   - Example: `toggleDeedCompletion(deedId, hijriDate, isCompleted, points)`
   - React Query hooks in `db/hooks/useAllMutations.ts`
   - Optimistic updates + cache invalidation

### Critical Helpers

- `helpers/hijriUtils.ts`: **ALL Hijri conversion and arithmetic functions**
  - `getCurrentHijriDate()`: Returns "1446-08-22"
  - `addHijriDays(hijri, days)`: Add/subtract days
  - `compareHijriDates(h1, h2)`: Compare two Hijri dates
  - `getHijriMonthLength(year, month)`: Returns 29 or 30
  - `formatHijriDate(hijri)`: "22 Şaban 1446"
  - `hijriToGregorianString(hijri)`: Convert to "2025-02-15"
  - `gregorianStringToHijri(gregorian)`: Convert to "1446-08-22"

- `helpers/dateUtils.ts`: `getDateAttributes(hijriDate)` - Returns period tags for a Hijri date
  - Example: `"1446-09-27"` → `["DAILY", "YEARLY_RAMADAN", "SPECIAL_QADR"]`
  - Checks both Hijri (for Ramadan, Kandils) and Gregorian day-of-week (for Friday)

- `helpers/dateUtils.ts`: `isValidForPeriod(hijriDate, periodCode)` - Check if a Hijri date matches a period

### Theme System

Dynamic dark/light mode using Zustand + React Navigation themes:

- `theme/colors.ts` - Color definitions
- `hooks/useModeToggle.ts` - Theme toggle hook
- `theme/useColor.ts` - Get single color by key
- `theme/useColors.ts` - Get all theme colors

Colors are reactive; changing mode re-renders all `useColor()` calls.

### Points System

- **Intention Points**: Earned by setting intention (niyyah)
- **Deed Points**: Earned by marking deed as completed
- **Daily Logs**: Store points per deed per Hijri day
- **Calculations**: Sum of `earnedPoints` in `daily_logs` table

### Important Notes

- **🌙 ALL DATES ARE HIJRI**: Never use Gregorian dates for user-facing features. Gregorian columns are backup only.
- **Date Format**: Hijri dates are stored as `"YYYY-MM-DD"` strings (e.g., `"1446-08-22"`). This allows string comparison and SQL sorting.
- **SQLite Boolean Handling**: SQLite stores booleans as 1/0. Always convert to `Boolean()` when reading.
- **Prayer Time Coordinates**: App requires GPS location for accurate prayer times (Turkey calculation method).
- **Migrations**: Run automatically on app start. Hijri migration converts existing Gregorian data to Hijri.
- **Horizontal Calendar**: Shows Hijri days (e.g., "22 Şab"). Month name is abbreviated.
- **Header Display**: Primary = Hijri date (large), Secondary = Miladi hint (small).
- **Analytics**: All charts and stats use Hijri dates (X-axis shows Hijri month names).

### Migration System

**On first run after update**: `migrateToHijriCalendar()` automatically converts:

- All `daily_logs.date` (Gregorian) → `daily_logs.dateHijri` + `daily_logs.dateGregorian`
- All `user_deeds.addedAt` → `user_deeds.addedAtHijri` + `user_deeds.addedAtGregorian`
- All `user_deeds.removedAt` → `user_deeds.removedAtHijri` + `user_deeds.removedAtGregorian`

**Location**: `db/migrations/migrateToHijri.ts`

### Development Guidelines

1. **Always use Hijri dates** for any user-facing feature
2. **Use helper functions** from `hijriUtils.ts` for date operations
3. **Never** manually calculate Hijri dates - use the helpers
4. **Dual-date writes**: When inserting to `daily_logs` or `user_deeds`, always write both Hijri and Gregorian
5. **Queries**: Primary index is Hijri, use `dateHijri` for all WHERE clauses
6. **UI Components**: Accept Hijri date strings, display using `formatHijriDate()` or `formatHijriDateShort()`
7.
