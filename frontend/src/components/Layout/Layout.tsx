import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useUIStore } from '../../store';
import './Layout.css';

const Layout = () => {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="app-layout">
      <Sidebar />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
