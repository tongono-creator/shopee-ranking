import { Metadata } from 'next';
import RedirectClient from './RedirectClient';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const name = typeof params.name === 'string' ? decodeURIComponent(params.name) : 'สินค้าแนะนำ';
  const img = typeof params.img === 'string' ? decodeURIComponent(params.img) : '';
  const desc = typeof params.desc === 'string' ? decodeURIComponent(params.desc) : 'ช้อปสินค้าคุณภาพราคาพิเศษได้เลยครับ';

  return {
    title: name,
    description: desc,
    openGraph: {
      title: name,
      description: desc,
      images: img ? [{ url: img }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description: desc,
      images: img ? [img] : [],
    },
  };
}

export default async function GoPage({ searchParams }: Props) {
  const params = await searchParams;
  const targetUrl = typeof params.url === 'string' ? decodeURIComponent(params.url) : 'https://shopee.co.th';

  return <RedirectClient url={targetUrl} />;
}
