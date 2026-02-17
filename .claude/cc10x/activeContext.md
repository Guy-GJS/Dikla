# Active Context
<!-- CC10X: Do not rename headings. Used as Edit anchors. -->

## Current Focus
Fixed category page 404 bug - URL encoding/decoding mismatch between CategoryCard links and category page route handler

## Recent Changes
- **Root Cause Identified**: Next.js App Router does not automatically decode dynamic route parameters
  - CategoryCard creates links with `encodeURIComponent(category.slug)` → `/category/Baby%20%26%20Kids%20Gear`
  - Next.js passes encoded slug to params: `params.slug = "Baby%20%26%20Kids%20Gear"`
  - Database contains decoded slugs: `"Baby & Kids Gear"`
  - Query fails because encoded slug doesn't match database value
- **Fix Applied**: Decode `params.slug` with `decodeURIComponent()` before database query
- **Static Generation**: Updated `generateStaticParams()` to return encoded slugs matching CategoryCard URLs

## Next Steps
1. [To be determined]

## Decisions
[None yet]

## Learnings
- **Next.js 14 App Router Behavior**: Dynamic route parameters in `[slug]` folders are NOT automatically URL-decoded
  - This differs from some frameworks that auto-decode URL parameters
  - Always decode URL parameters explicitly when they may contain special characters
- **URL Encoding Consistency**: When encoding slugs in links, must decode them in route handlers
  - CategoryCard: `encodeURIComponent(slug)` for links
  - Category Page: `decodeURIComponent(params.slug)` before DB query
- **Static Generation with Encoded Params**: `generateStaticParams()` should return encoded slugs when links use encoding

## References
- Plan: N/A
- Design: N/A
- Research: N/A

## Blockers
- [None]

## Last Updated
2026-02-17
