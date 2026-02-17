# Project Patterns
<!-- CC10X MEMORY CONTRACT: Do not rename headings. Used as Edit anchors. -->

## Architecture Patterns
[None identified yet]

## Code Conventions
- **Search Input Styling Pattern**: Consistent styling across desktop and mobile
  - Use same Tailwind classes for both versions to maintain visual consistency
  - Structure: `relative` container with `absolute` positioned button inside input
  - Example: `bg-teal-50/80 border-2 border-teal-400 rounded-xl shadow-md` applied to both desktop and mobile inputs
- **Client/Server Component Split Pattern**: Separate data fetching from UI state management
  - **Server Component**: Fetch data using async/await (e.g., getCategories in page.tsx)
  - **Client Component Wrapper**: Handle interactive state (e.g., CategoriesClient for view toggle)
  - Pass server data as props to client wrapper: `<CategoriesClient categories={categories} />`
  - Benefits: Optimal performance (server data fetching) + interactivity (client state)

## File Structure
[None identified yet]

## Testing Patterns
[None identified yet]

## Common Gotchas
- **Next.js App Router URL Parameter Encoding**: Dynamic route parameters (`[slug]`) are NOT automatically decoded
  - **Bug Pattern**: Link uses `encodeURIComponent(slug)`, route handler uses raw `params.slug` → database query fails
  - **Fix Pattern**: Always `decodeURIComponent(params.slug)` before using in queries
  - **Example**: `/category/Baby%20%26%20Kids%20Gear` → params.slug is still `"Baby%20%26%20Kids%20Gear"` (encoded)
  - **Files affected**: Dynamic route pages like `app/[param]/page.tsx` where params may contain special characters
- **Dialog Provider Must Wrap App**: DialogProvider must be in app layout to work in all pages
  - **Bug Pattern**: Calling useDialog() from a page not wrapped by DialogProvider → "must be used within DialogProvider" error
  - **Fix Pattern**: Add DialogProvider in app/layout.tsx wrapping all children
  - **Example**: `<AuthProvider><DialogProvider>{children}</DialogProvider></AuthProvider>`
- **LocalStorage Hydration Mismatch**: Reading localStorage during SSR/initial render causes hydration errors
  - **Bug Pattern**: `useState(localStorage.getItem('key'))` → crashes during SSR (localStorage undefined)
  - **Fix Pattern**: Use two-step hydration: (1) default state on mount, (2) load from localStorage in useEffect
  - **Example**: `const [isClient, setIsClient] = useState(false); useEffect(() => setIsClient(true), []); const value = isClient ? storedValue : defaultValue`
  - **Why**: Server render and client initial render must match; localStorage only available client-side

## API Patterns
[None identified yet]

## Error Handling
- **LocalStorage Error Handling Pattern**: Always wrap localStorage operations in try/catch
  - **Why**: localStorage.getItem/setItem throw exceptions in Safari Private Mode, storage-disabled browsers, quota exceeded, cross-origin contexts
  - **Pattern**: Wrap in try/catch with console.error and graceful fallback
  - **Example**:
    ```typescript
    try {
      const savedView = localStorage.getItem('categoryViewMode')
      if (savedView === 'cards' || savedView === 'list') {
        setViewMode(savedView)
      }
    } catch (error) {
      console.error('[ComponentName] Failed to load preference:', error)
      // Falls back to default value
    }
    ```
  - **Project Convention**: Use component prefix in error messages (e.g., `[CategoriesClient]`) for easier debugging
  - **Graceful Degradation**: Feature should still work with reduced functionality (e.g., toggle works but preference doesn't persist)

## Dependencies
[None identified yet]
