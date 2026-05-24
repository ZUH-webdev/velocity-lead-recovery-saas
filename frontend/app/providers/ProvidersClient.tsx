"use client";
import React from 'react';
import { AuthProvider } from '../../src/context/AuthContext';

interface Props {
  children: React.ReactNode;
}

export default function ProvidersClient({ children }: Props) {
  // ProvidersClient is a client component and should only be used on the client.
  // AuthProvider itself guards access to window/localStorage during its bootstrap.
  return <AuthProvider>{children}</AuthProvider>;
}
