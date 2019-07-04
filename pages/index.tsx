// Hey Emacs, this is -*- coding: utf-8 -*-

import React from 'react';
import Link from 'next/link';

import ProcessTree from '../components/ProcessTree';

// import dynamic from 'next/dynamic';
//
// type ProcessTreeModule = typeof import('../components/ProcessTree');
//
// const ProcessTree = dynamic(
//   (): Promise<ProcessTreeModule> => (
//     import('../components/ProcessTree')
//   ),
//   { ssr: false },
// );

const Index = (): JSX.Element => (
  <div>
    <Link href="/about">
      <a href="/about" title="About Page">About Page</a>
    </Link>
    <p>Process Tree</p>
    <ProcessTree />
  </div>
);

export default Index;
