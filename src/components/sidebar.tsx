import React, { useState } from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { Book, AlignJustify, Zap, Users, Gavel, Umbrella, Menu } from 'lucide-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);
  const listOfUsers = () => navigate(`/users`);
  const Dashboard = () => navigate(`/dashboard`);

  return (
    <>
      <Button
        className="lg:hidden p-2 fixed top-3 left-4 z-50 bg-gray-300 text-white rounded-md"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </Button>
      <div
        className={`sidebar lg:block ${className} h-full lg:h-screen space-y-4 py-4 mt-6 fixed lg:static sm:bg-gray sm:z-40 transition-transform ${
          isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        style={{ width: '16rem' }}
      >
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-10 px-5 text-xl font-semibold tracking-tight">Tabato</h2>
            <div className="space-y-1 mt-6">
              <Button onClick={Dashboard} variant="secondary" className="w-full justify-start">
                <Book fill="none" className="mr-2 h-6 w-6" />
                Bookings
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <AlignJustify className="mr-2 h-6 w-6" />
                Event types
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Umbrella className="mr-2 h-6 w-6" />
                Availability
              </Button>
              <Button onClick={listOfUsers} variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-6 w-6" />
                Teams
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Gavel className="mr-2 h-6 w-6" />
                Integrations
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Zap className="mr-2 h-6 w-6" />
                Workflows
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
