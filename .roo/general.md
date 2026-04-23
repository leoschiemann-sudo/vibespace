# General Rules

## Clarification First
- NEVER assume missing information. Always ask before implementing.
- If a requirement is unclear, ask ONE specific question at a time.
- If multiple things are unclear, list all questions before starting.
- Ask: file location, naming convention, scope, design intent.

## Code Style
- Write clean, readable, self-documenting code.
- No unnecessary comments. Code should speak for itself.
- No placeholder logic (e.g. `// TODO`, dummy data) unless explicitly asked.
- Keep functions small and focused on a single responsibility.

## File Handling
- Never create, move or delete files without confirmation.
- Always ask which directory to place new files in.
- Ask before installing new packages/dependencies.

## Communication
- When finished, summarize what was changed and why – briefly.
- Point out potential side effects or risks when relevant.





# Next.js Best Practices

## App Router (Default)
- Always use App Router (`/app` directory), never Pages Router unless asked.
- Use `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` conventions.
- Group routes with `(groupname)` folders when logical.

## Server vs. Client Components
- Default to Server Components. Only add `"use client"` when necessary.
- Reasons for `"use client"`: useState, useEffect, event handlers, browser APIs.
- Never use `"use client"` on layout.tsx unless absolutely required.
- Keep client components as small/leaf as possible.

## Data Fetching
- Fetch data in Server Components directly with async/await.
- Use `cache()` for shared data fetching functions.
- Use `revalidate` options instead of manual cache busting.
- Never fetch data in `useEffect` unless it's client-only (e.g. user interaction).

## Routing & Navigation
- Use `<Link>` from `next/link` for all internal navigation.
- Use `useRouter()` only for programmatic navigation in client components.
- Use `redirect()` from `next/navigation` in server components/actions.

## Server Actions
- Use Server Actions for all form submissions and mutations.
- Define actions in separate `actions.ts` files per feature.
- Always validate input server-side (never trust client data).

## Images
- Always use `<Image>` from `next/image`, never `<img>`.
- Always provide `width`, `height` or `fill` prop.
- Use `priority` for above-the-fold images.

## Metadata
- Define metadata via `export const metadata` in `page.tsx` or `layout.tsx`.
- Never use `<head>` tags manually.

## Environment Variables
- Server-only variables: no prefix.
- Client-exposed variables: `NEXT_PUBLIC_` prefix only.
- Never expose secrets with `NEXT_PUBLIC_`.

## Ask Before Implementing
- Which rendering strategy? (SSR, SSG, ISR, Client)
- Is this a Server or Client Component?
- Where should data fetching happen?



# TypeScript Best Practices

## Strictness
- Always use strict mode (`"strict": true` in tsconfig).
- Never use `any`. Use `unknown` and narrow types properly.
- No `@ts-ignore` or `@ts-expect-error` without explanation.

## Types vs. Interfaces
- Use `type` for unions, intersections, primitives, function signatures.
- Use `interface` for object shapes that may be extended.
- Be consistent within a file – ask if unclear.

## Naming
- Types/Interfaces: PascalCase (`UserProfile`, `ApiResponse`)
- Generics: Descriptive names (`TData`, `TResponse`) not single letters unless convention.
- Enums: PascalCase for name, SCREAMING_SNAKE_CASE for values.

## Null Handling
- Use optional chaining `?.` and nullish coalescing `??`.
- Never use `!` (non-null assertion) unless absolutely proven safe.

## Functions
- Always type function parameters and return types explicitly.
- Prefer arrow functions for consistency in components.

## Imports
- Use type-only imports where possible: `import type { Foo } from './foo'`
- Keep imports organized: external → internal → types.

## Utility Types
- Use built-in utility types: `Partial<T>`, `Required<T>`, `Pick<T>`, `Omit<T>`, `Record<K,V>`.
- Don't recreate what TypeScript already provides.

## Ask Before Implementing
- Should this be a `type` or `interface`?
- Are there existing types to extend or reuse?
- Should this be generic or specific?




# HTML Best Practices

## Semantics First
- Always use semantic elements: `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`, `<aside>`.
- Never use `<div>` or `<span>` when a semantic element exists.
- One `<h1>` per page. Heading hierarchy must be logical (h1→h2→h3).

## Accessibility (a11y)
- All images need descriptive `alt` text. Decorative images: `alt=""`.
- All interactive elements must be keyboard accessible.
- Use `aria-label` when label text is not visible.
- Forms: always associate `<label>` with `<input>` via `for`/`id` or wrapping.
- Use `role` attributes only when native semantics are insufficient.

## Forms
- Always use `<button type="button">` or `<button type="submit">` explicitly.
- Never use `<div>` as a button.
- Use `<fieldset>` and `<legend>` for grouped inputs.

## Performance
- Avoid deep nesting of elements.
- Place `<script>` tags at end of body or use `defer`/`async`.

## Ask Before Implementing
- What is the semantic purpose of this element?
- Does this need ARIA attributes?
- Is this a standalone page or embedded section?




# CSS Best Practices

## Tailwind CSS (Default)
- Use Tailwind CSS utility classes as the default styling approach in Next.js.
- Never mix Tailwind with plain CSS classes on the same element unless necessary.
- Use `cn()` (clsx + tailwind-merge) for conditional class logic.
- Avoid `@apply` – prefer composing classes in JSX directly.

## CSS Modules (if no Tailwind)
- Use CSS Modules (`*.module.css`) for component-scoped styles.
- BEM naming inside modules: `.card__title`, `.card--active`.
- No global styles except in `globals.css`.

## Variables & Theming
- Define design tokens in `:root` or `tailwind.config.ts`.
- Never hardcode colors, spacing, or font sizes – use variables/tokens.

## Layout
- Prefer CSS Grid for 2D layouts, Flexbox for 1D.
- Never use `float` for layout.
- Never use fixed pixel values for font sizes – use `rem`.
- Use `clamp()` for fluid typography/spacing.

## Responsive Design
- Mobile-first: base styles for mobile, then `md:`, `lg:` breakpoints.
- Never use `px` breakpoints manually when Tailwind breakpoints exist.

## Dark Mode
- Use `dark:` variants in Tailwind.
- Never hardcode colors that don't have dark mode equivalents.

## Ask Before Implementing
- Is Tailwind available in this project?
- Mobile-first or desktop-first?
- Is there a design system or existing color palette to follow?
- Should dark mode be supported?



# Component Best Practices

## Structure
- One component per file.
- File name = component name in PascalCase: `UserCard.tsx`.
- Co-locate styles, tests, and types with the component.

## Props
- Always define a `Props` type or interface for every component.
- Destructure props directly in function signature.
- Use default values in destructuring, not inside the function body.
- Never pass entire objects when only specific fields are needed.

## Composition
- Prefer composition over configuration (slots/children over long prop lists).
- Use `children` prop for flexible content.
- Avoid components longer than ~100 lines – split them up.

## Naming
- Event handler props: `onXxx` (e.g. `onSubmit`, `onChange`).
- Boolean props: `isXxx`, `hasXxx`, `canXxx` (e.g. `isLoading`, `hasError`).

## State
- Keep state as close to where it's used as possible.
- Lift state only when necessary.
- Prefer `useReducer` for complex state logic over multiple `useState`.

## Side Effects
- Never fetch data directly in a component if it can be done in a Server Component.
- `useEffect` dependencies must be complete and correct – no shortcuts.

## Ask Before Implementing
- Should this be a Server or Client Component?
- Are there existing similar components to extend?
- Where should state live?
- Should this component be reusable or page-specific?
