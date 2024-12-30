"use client";

import { ReactNode } from 'react';
import Layout from '@/components/layout/Layout';

export default function DataStructuresLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
