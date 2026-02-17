# Project Patterns
<!-- CC10X MEMORY CONTRACT: Do not rename headings. Used as Edit anchors. -->

## Architecture Patterns
[None identified yet]

## Code Conventions
[None identified yet]

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

## API Patterns
[None identified yet]

## Error Handling
[None identified yet]

## Dependencies
[None identified yet]
