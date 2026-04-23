# VibeSpace - Link-in-Bio Application Plan

## Overview
Build a "Link-in-Bio" web application for teenagers called "VibeSpace" using Next.js, Tailwind CSS, lz-string for URL compression, and lucide-react for icons. No backend - using "URL as a Database" concept.

## Tech Stack
- Next.js (App Router)
- Tailwind CSS
- lz-string (data compression)
- lucide-react (icons)

## Data Architecture

### Profile Data Structure
```typescript
interface ProfileData {
  name: string;
  bio: string;
  avatarUrl: string;
  mood: {
    emoji: string;
    text: string;
  };
  spotifyUrl: string;
  links: Array<{
    title: string;
    url: string;
  }>;
}
```

### Compression Strategy
- Compress using `lz-string compressToEncodedURIComponent`
- Decompress using `lz-string decompressFromEncodedURIComponent`
- URL format: `domain.com/v/[compressed-string]`
- LocalStorage for auto-saving editor progress

## Pages Architecture

### Route 1: `/` - Editor/Dashboard
**Layout:**
- Desktop: Split-screen (left: editor form, right: live preview in phone frame)
- Mobile: Stacked (preview top, editor bottom)

**Features:**
- Form inputs for all profile fields
- Dynamic link list (add/remove links)
- "Share Link kopieren" button → compress data → copy to clipboard
- Auto-save to localStorage

### Route 2: `/v/[id]` - Public Profile
**Features:**
- Read compressed string from URL
- Decompress and render profile
- Fallback UI for invalid data

## UI Components

### 1. ProfileHeader
- Circular avatar with gradient border (Instagram Story style)
- Name (bold) below avatar
- Bio (gray, subtle)

### 2. MoodWidget
- Story-highlight style design
- Emoji + text

### 3. LinkItem
- iOS/Instagram list style
- Full width, rounded corners
- Thin dividers between links
- Chevron icon (lucide-react) on right

### 4. SpotifyEmbed
- iframe embed player

## Design System (Instagram-Style)

### Colors (Light Mode)
- Background: Clean white/light gray
- Text: Rich black
- Accent: Instagram gradient (pink/purple/blue/orange)

### Mobile-First
- Clean, minimal design
- Rounded corners
- Subtle shadows

### Dark Mode Ready
- CSS variables for easy inversion

## File Structure
```
app/
├── layout.tsx          # Root layout with fonts
├── globals.css         # Global styles + CSS variables
├── page.tsx           # Editor page (/)
├── v/
│   └── [id]/
│       └── page.tsx   # Public profile page
components/
├── ProfileHeader.tsx
├── MoodWidget.tsx
├── LinkItem.tsx
├── SpotifyEmbed.tsx
├── ProfilePreview.tsx  # Phone frame preview
├── EditorForm.tsx      # Main editor form
├── LinkList.tsx       # Dynamic link management
└── ShareButton.tsx
lib/
├── types.ts            # TypeScript interfaces
├── compression.ts      # lz-string utilities
└── storage.ts         # localStorage utilities
```

## Implementation Phases

### Phase 1: Foundation
- [ ] Install dependencies (lz-string, lucide-react)
- [ ] Create TypeScript types
- [ ] Create compression/decompression utilities
- [ ] Create localStorage utilities

### Phase 2: Components
- [ ] ProfileHeader component
- [ ] MoodWidget component
- [ ] LinkItem component
- [ ] SpotifyEmbed component
- [ ] ProfilePreview (phone frame)
- [ ] EditorForm with link management
- [ ] ShareButton

### Phase 3: Pages
- [ ] Editor page (/) with responsive layout
- [ ] Public profile page (/v/[id])
- [ ] Error fallback for invalid profiles

### Phase 4: Polish
- [x] Dark mode with CSS variables (prefers-color-scheme media query)
- [ ] Animations/transitions
- [ ] Test compression/decompression flow

## Commit Strategy
- Maximum 3 files per commit
- Pause between commits for review