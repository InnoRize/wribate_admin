import { Metadata } from 'next'

interface MetadataProps {
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'article' | 'profile'
  url?: string
  author?: string
  publishedTime?: string
  keywords?: string[]
}

export function generateMetadata({ 
  title,
  description,
  image,
  type = 'website',
  url,
  author,
  publishedTime,
  keywords = []
}: MetadataProps): Metadata {
  const baseTitle = 'Wribate';
  const baseDescription = 'Where Ideas Meet Words.';
  const defaultImage = 'https://your-default-image-url.jpg'; // Replace with your default image

  const fullTitle = title ? `${title} - ${baseTitle}` : baseTitle;
  const finalDescription = description || baseDescription;
  const finalImage = image || defaultImage;

  return {
    title: fullTitle,
    description: finalDescription,
    openGraph: {
      title: fullTitle,
      description: finalDescription,
      type,
      ...(url && { url }),
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: title || baseTitle,
        },
      ],
      ...(author && { authors: [author] }),
      ...(publishedTime && { publishedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: finalDescription,
      images: [finalImage],
    },
    ...(url && {
      alternates: {
        canonical: url
      }
    }),
    ...(keywords.length > 0 && { keywords }),
  };
} 