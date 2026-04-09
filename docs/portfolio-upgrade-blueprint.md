# Portfolio Upgrade Blueprint

## Assumptions Used

- Frontend framework: keep the existing React + Vite app instead of forcing a Next.js rewrite.
- Hosting: Vercel, because the repo already includes `vercel.json`.
- Storage provider for private attachments: Supabase Storage private bucket.
- Authentication for owner-only access: Supabase Auth with GitHub OAuth or magic link.
- 3D assets: keep them, but lazy-load and offer downloadable bundles.
- CMS: not required for MVP; current content can stay in `src/constants` and move to Sanity later if needed.

## 1. Architecture Overview

### Frontend

- `React + Vite + Tailwind + React Three Fiber`
- Public sections: hero, about, technical journey, tech stack, projects, contact, resume preview
- Data-driven content:
  - `src/constants/index.js`
  - `src/constants/siteConfig.js`
- Performance pattern:
  - lazy-load non-critical sections
  - render lighter UI on mobile instead of multiple 3D canvases
  - host static assets through Vercel CDN

### Private Attachments

- Public UI should not expose private files directly.
- Recommended stack:
  - Supabase Auth for owner sign-in
  - Supabase Storage private bucket for certificates and verification files
  - Vercel serverless function to mint signed URLs
- Suggested route:
  - `/admin/attachments`
- Access model:
  - only authenticated owner can upload/delete/list files
  - downloads use short-lived signed URLs

### Hosting

- Vercel for frontend hosting and CDN
- Supabase for auth, storage, and optional metadata table
- Optional later:
  - Sanity for CMS-managed project/certificate content
  - Plausible or Vercel Analytics for CV download tracking

## 2. UI Wireframes

### Home Page

1. Sticky navbar
2. Hero with 3D scene, headline, resume CTA, project CTA, 3D download CTA
3. About card with profile image and proof points
4. Download resources grid
5. Technical journey timeline
6. Technologies section
7. Project cards
8. Contact section with social links and form

### Projects Page / Projects Section

- Intro paragraph
- Responsive grid of cards
- Each card includes:
  - image
  - summary
  - tech tags
  - live demo link
  - source code link

### Contact Page / Contact Section

- Intro copy
- icon-based social/contact grid
- direct email CTA
- downloadable CV CTA
- contact form
- optional 3D globe on desktop only

### Admin Attachments Page

- Header: "Private Attachments"
- Auth gate
- File table:
  - name
  - type
  - uploaded at
  - preview
  - secure download
  - delete
- Upload panel:
  - drag/drop or file picker
  - file size/type validation
  - progress state

## 3. Component List

- `Navbar`
- `Hero`
- `About`
- `DownloadGrid`
- `Experience`
- `Tech`
- `Works`
- `Contact`
- `SocialLinks`
- `ComputersCanvas`
- `EarthCanvas`
- `StarsCanvas`
- Future:
  - `AdminAttachmentsPage`
  - `AttachmentManager`
  - `ProtectedRoute`
  - `SignedDownloadButton`

## 4. Code Snippets

### Contact Icons

```jsx
<a
  href="mailto:25afridfoisal00@gmail.com"
  aria-label="Email: Send a direct email"
  className="rounded-2xl border border-white/10 bg-white/5"
>
  <SocialIcon type="email" />
  <span>Email</span>
</a>
```

### Secure Attachment Upload Flow

```ts
// Vercel function example
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // 1. verify owner session
  // 2. upload to private bucket
  // 3. store file metadata in attachments table
  // 4. return secure record only to owner
}
```

### Signed Download URL

```ts
const { data, error } = await supabase.storage
  .from("private-attachments")
  .createSignedUrl(path, 60 * 5);
```

### Lazy Loading Heavy Components

```jsx
const Contact = lazy(() => import("./components/Contact"));

<Suspense fallback={<SectionFallback />}>
  <Contact />
</Suspense>
```

### Responsive 3D Viewer

```jsx
const isMobile = useIsMobile(768);

return isMobile ? <StaticFallback /> : <ComputersCanvas />;
```

## 5. Security Checklist

- Do not store private certificates in `public/`.
- Do not rely on client-side password-only protection for truly private files.
- Use authenticated owner sessions before listing uploads.
- Use signed URLs with short expiry for downloads.
- Keep service-role keys only in server-side environment variables.
- Confirm `X-Content-Type-Options: nosniff` and `Referrer-Policy` are set.
- Sanitize resume metadata before publishing PDF.
- Review all external links for `rel="noreferrer"` when opening new tabs.

## 6. Test Cases

### Mobile Layout

- Test at `320px`, `480px`, `768px`, `1024px`, `1440px`
- Confirm hero buttons wrap cleanly
- Confirm contact cards keep 44px tap targets
- Confirm tech section switches to static icons on mobile

### Keyboard Navigation

- `Tab` from skip link through navbar, hero CTAs, cards, social links, and form
- Confirm visible focus ring on all interactive controls
- Confirm mobile menu closes with `Escape`

### Attachment Security

- unauthenticated visitor cannot list files
- unauthenticated visitor cannot guess download URL
- signed URL expires as expected
- deleted file becomes unavailable immediately

### Performance

- run Lighthouse in mobile mode
- confirm lazy sections do not block first paint
- verify 3D canvases are skipped on small screens where intended
- keep resume PDF below `2 MB`

## 7. Deployment Guide

### GitHub Repository

1. Push current repo to GitHub.
2. Keep `.env` out of version control.
3. Add production environment variables in Vercel.

### Vercel

1. Import the GitHub repository into Vercel.
2. Framework preset: `Vite`.
3. Build command: `npm run build`
4. Output directory: `dist`

### Environment Variables

- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_EMAILJS_TO_EMAIL`
- `VITE_EMAILJS_TO_NAME`

### Supabase Configuration for Private Attachments

1. Create a private bucket: `private-attachments`
2. Enable Auth provider for owner login
3. Create `attachments` table with:
   - `id`
   - `file_name`
   - `storage_path`
   - `mime_type`
   - `size_bytes`
   - `created_at`
4. Add Vercel env vars:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Implement upload/list/delete/download functions in `/api/attachments/*`

## Recommended Next Step

Build the admin attachment flow as a separate feature branch. The public portfolio is already a good static/CDN fit, but owner-only documents need a server-backed signed URL flow to be truly private.
