This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## OpenGraph Image Generation

QuickKey uses dynamic OpenGraph image generation for enhanced social media sharing. The OG images are generated on-the-fly using Next.js' Edge Runtime and the ImageResponse API.

### Customizing OG Images

The OG image generator accepts the following URL parameters:

- `title`: The main title displayed on the image (default: "QuickKey")
- `description`: The subtitle or description text (default: "Improve your typing speed and accuracy")
- `mode`: Color scheme - "light" or "dark" (default: "light")
- `theme`: Color theme - "default", "green", or "red" (default: "default")

Examples:
- Basic OG image: `/api/og`
- Custom title: `/api/og?title=Practice%20Typing`
- Dark mode with green theme: `/api/og?mode=dark&theme=green`

### Implementation

To customize OpenGraph images for a specific page, implement the `generateMetadata` function in your page component:

```tsx
export async function generateMetadata(): Promise<Metadata> {
  const title = "Your Page Title";
  const description = "Your page description";
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&theme=default`;
  
  return {
    title,
    description,
    openGraph: {
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImageUrl],
    },
  };
}
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
