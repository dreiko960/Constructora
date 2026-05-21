import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { 
  LayoutDashboard, 
  HardHat, 
  FileText, 
  Image as ImageIcon, 
  Users, 
  BarChart3,
  Bell, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Search
} from 'lucide-react';

const RootLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, notifRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/notifications')
        ]);
        setUser(userRes.data);
        setNotifications(notifRes.data);
      } catch (error: any) {
        console.error('Error fetching layout data:', error);
        if (error?.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchData();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Proyectos', path: '/proyectos', icon: HardHat },
    { name: 'Documentos', path: '/documentos', icon: FileText },
    { name: 'Evidencias', path: '/evidencias', icon: ImageIcon },
    { name: 'Reportes', path: '/reportes', icon: BarChart3 },
    { name: 'Usuarios', path: '/usuarios', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col z-20 shadow-xl`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'hidden'}`}>
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center font-bold text-lg">C</div>
            <span className="font-bold text-xl tracking-tight">Grupo Ipurre EIRL</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-slate-800 rounded transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-slate-800 text-white shadow-lg border-l-4 border-amber-500' 
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }
              `}
            >
              <item.icon size={22} className="flex-shrink-0" />
              {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-3 py-3 w-full rounded-xl text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-200"
          >
            <LogOut size={22} className="flex-shrink-0" />
            {isSidebarOpen && <span className="font-medium text-sm">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 shadow-sm">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Buscar proyectos, documentos..." 
                className="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Bell size={22} />
                {notifications.filter(n => !n.leida).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 border-2 border-white rounded-full"></span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <span className="font-black text-gray-900 text-xs uppercase tracking-widest">Notificaciones</span>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      {notifications.filter(n => !n.leida).length} nuevas
                    </span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => markAsRead(n.id)}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!n.leida ? 'bg-amber-50/30' : ''}`}
                        >
                          <p className="text-sm font-bold text-gray-900">{n.titulo}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{n.mensaje}</p>
                          <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">{new Date(n.fecha_creacion).toLocaleDateString()}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-400">
                        <Bell size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-xs font-bold uppercase tracking-widest">Sin notificaciones</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{user?.nombre || 'Cargando...'}</p>
                <p className="text-xs text-gray-500 font-medium">
                  {user?.rol_id === 1 ? 'Administrador' : 'Usuario'}
                </p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold border-2 border-white shadow-sm ring-1 ring-gray-100">
                {user?.nombre ? user.nombre.split(' ').map((n: any) => n[0]).join('') : '...'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
