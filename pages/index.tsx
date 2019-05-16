import Link from 'next/link';
import dynamic from 'next/dynamic';

const ProcessTree = dynamic(
  () => import('../components/ProcessTreeState'),
  { ssr: false }
);

const Index = () => (
  <div>
    <Link href="/about">
      <a title="About Page">About Page</a>
    </Link>
    <p>Process Tree</p>
    <ProcessTree />
  </div>
);

export default Index;
