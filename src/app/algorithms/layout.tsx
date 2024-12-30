"use client";

import { ReactNode } from 'react';
import Layout from '@/components/layout/Layout';

export default function AlgorithmsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
