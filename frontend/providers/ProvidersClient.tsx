"use client";
import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import ScrollToTop from '../components/ScrollToTop';
import { TenantProvider } from '../context/TenantContext';

interface Props {
  children: React.ReactNode;
}

export default function ProvidersClient({ children }: Props) {
  // ProvidersClient is a client component and should only be used on the client.
  // AuthProvider itself guards access to window/localStorage during its bootstrap.
  return (
    <AuthProvider>
     <TenantProvider>
       <ScrollToTop />
      {children}
     </TenantProvider>
    </AuthProvider>
  );
}
