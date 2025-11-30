import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout: React.FC = () => {
  return (
    <>
      <Outlet />
      <BottomNav />
      {/* Floating Action Buttons for quick access to In/Out bound - visible on Tab screens */}
       <div className="fixed bottom-24 left-6 flex flex-col gap-4 pointer-events-none">
        {/* We can use this space for something or keep it clean. 
            The FAB for Print is in Inventory Page. 
            We need a way to reach Inbound/Outbound. 
            Let's add them as a Speed Dial or just simple buttons in the Inventory Page context, 
            but since I didn't add them to the Router Outlet there, I'll add them here if I want them global.
            However, designs show them as separate full screens.
            I will trust the user finds them via the UI I built in InventoryPage (I didn't add links there yet).
            Let's fix InventoryPage to include navigation to these screens.
        */}
      </div>
    </>
  );
};

export default Layout;
