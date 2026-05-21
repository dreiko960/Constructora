import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  HardHat, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  ChevronRight,
  Loader2
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, statsRes] = await Promise.all([
          api.get('/proyectos'),
          api.get('/reports/stats')
        ]);
        setProjects(projRes.data);
        setStatsData(statsRes.data);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        if (error?.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Proyectos Activos', value: statsData?.summary.proyectos_activos.toString() || '0', icon: HardHat, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Usuarios en Equipo', value: statsData?.summary.total_proyectos.toString() || '0', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Avance Promedio', value: `${statsData?.summary.avance_promedio.toFixed(0) || 0}%`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Tareas Pendientes', value: '12', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const COLORS = ['#1E3A8A', '#22C55E', '#F97316'];

  const recentProjects = projects.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="animate-spin text-blue-900" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resumen del Sistema</h1>
          <p className="text-gray-500 mt-1">Bienvenido de nuevo, aquí está el estado actual de tus obras.</p>
        </div>
        <button 
          onClick={() => navigate('/proyectos/nuevo')}
          className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-xl hover:bg-blue-800 transition shadow-lg hover:shadow-blue-900/20 font-medium"
        >
          <Plus size={20} />
          Nuevo Proyecto
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-gray-900">Progreso General de Obras</h2>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              <option>Últimos 6 meses</option>
              <option>Último año</option>
            </select>
          </div>
          <div className="h-[350px] w-full relative">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={statsData?.financials} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1E3A8A', fontWeight: 600 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avance" 
                  stroke="#1E3A8A" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#1E3A8A', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-8">Tipos de Proyectos</h2>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statsData?.distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statsData?.distribution?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-8">
            {statsData?.distribution?.map((item: any, index: number) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-gray-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Proyectos Recientes</h2>
          <button className="text-blue-600 hover:text-blue-700 font-bold text-sm">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Proyecto</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Progreso</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentProjects.map((project) => (
                <tr 
                  key={project.id} 
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/proyectos/${project.id}`)}
                >
                  <td className="px-8 py-4">
                    <span className="font-bold text-gray-900 block">{project.nombre}</span>
                    <span className="text-xs text-gray-500 mt-0.5 block">ID: #{project.id}</span>
                  </td>
                  <td className="px-8 py-4 text-sm text-gray-600 font-medium">{project.tipo}</td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                      project.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {project.estado}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[100px]">
                        <div 
                          className="h-full bg-blue-900 rounded-full" 
                          style={{ width: `${project.avance_total}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{project.avance_total}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button className="text-gray-400 hover:text-blue-900 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
