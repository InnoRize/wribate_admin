import { generateMetadata as generatePageMetadata } from '../../utils/metadata';
import ProposeWribateContent from './ProposeWribateContent';

export const metadata = generatePageMetadata({
  title: 'Discover Wribates',
  description: 'Explore and participate in engaging debates on various topics. Join our community of critical thinkers and share your perspective.',
  type: 'website',
  url: 'https://wribate.com/propose-wribate',
  keywords: [
    'debates',
    'discussions',
    'critical thinking',
    'wribate',
    'community',
    'topics',
    'perspectives',
    'propose debate',
    'start discussion'
  ]
});

export default function ProposeWribatePage() {
  return <ProposeWribateContent />;
} 