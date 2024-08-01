import React from 'react';
import { Sidebar } from './sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar className="flex-shrink-0 bg-background w-full md:w-64 lg:w-72 xl:w-80" />
      <div className="flex-1 p-4 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;
