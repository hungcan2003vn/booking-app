// components/Layout.tsx
import React from 'react';
import { Sidebar } from './sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="border-t flex min-h-screen">
        <Sidebar  className="flex-shrink-0 bg-background "  />  
        <div className="flex-1 p-4 overflow-auto">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
