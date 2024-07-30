import React from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { Book,AlignJustify,Zap,Users,Gavel,Umbrella } from 'lucide-react';


interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
}

export const Sidebar: React.FC<SidebarProps> = ({ className}) => {
  const navigate = useNavigate();

  const listOfUsers = () => {
    navigate(`/users`);
  };

  return (
    <div className={`sidebar ${className} h-full lg:h-screen space-y-4 py-4`} style={{ width: '16rem' }}> 
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-10 px-5 text-xl font-semibold tracking-tight">
            Tabato
          </h2>
          <div className="space-y-1 mt-6">
            <Button variant="secondary" className="w-full justify-start">
              <Book   
               fill="none" className="mr-2 h-6 w-6" >
              </Book>
              Bookings
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <AlignJustify
                className="mr-2 h-6 w-6">
              </AlignJustify>
              Event types
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Umbrella
                className="mr-2 h-6 w-6" >
              </Umbrella>
              Availability
            </Button>
            <Button onClick={listOfUsers} variant="ghost" className="w-full justify-start">
              <Users
                className="mr-2 h-6 w-6" >
              </Users>
              Teams
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Gavel 
              className="mr-2 h-6 w-6" >
              </Gavel>
              Integrations
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Zap 
               className="mr-2 h-6 w-6" >
              </Zap>
              Workflows
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
