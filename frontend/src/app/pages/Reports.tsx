import React, { useState, useEffect } from 'react';
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
  Line,
  Legend
} from 'recharts';
import { 
  FileDown, 
  Calendar, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  Loader2
} from 'lucide-react';

const Reports: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/reports/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ['#1E3A8A', '#22C55E', '#F97316'];

  const recentReports = [
    { id: 1, name: 'Reporte Mensual - Marzo 2026', type: 'PDF', date: '24 Mar 2026', user: 'Admin' },
    { id: 2, name: 'Estado de Avance - Edificio Mirador', type: 'Excel', date: '22 Mar 2026', user: 'Juan A.' },
    { id: 3, name: 'Cierre Presupuestario Q1', type: 'PDF', date: '20 Mar 2026', user: 'Maria L.' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="animate-spin text-blue-900" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Módulo de Reportes</h1>
          <p className="text-gray-500 mt-1">Análisis detallado de avance, costos y eficiencia del sistema.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition shadow-sm font-bold">
            <FileSpreadsheet size={20} className="text-green-600" />
            Excel
          </button>
          <button className="flex items-center justify-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-xl hover:bg-blue-800 transition shadow-lg hover:shadow-blue-900/20 font-bold">
            <FileText size={20} />
            Generar PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Proyectos</p>
          <h3 className="text-2xl font-black text-gray-900">{stats?.summary.total_proyectos}</h3>
          <div className="mt-2 flex items-center text-[10px] font-bold text-green-600">
            <TrendingUp size={12} className="mr-1" />
            <span>{stats?.summary.proyectos_activos} Activos</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Presupuesto Total</p>
          <h3 className="text-2xl font-black text-gray-900">${(stats?.summary.presupuesto_total / 1000000).toFixed(1)}M</h3>
          <p className="mt-2 text-[10px] font-bold text-gray-400">Inversión global</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Gasto Estimado</p>
          <h3 className="text-2xl font-black text-gray-900">${(stats?.summary.gasto_estimado / 1000000).toFixed(1)}M</h3>
          <p className="mt-2 text-[10px] font-bold text-blue-600">{(stats?.summary.gasto_estimado / stats?.summary.presupuesto_total * 100).toFixed(1)}% Ejecutado</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Avance Promedio</p>
          <h3 className="text-2xl font-black text-gray-900">{stats?.summary.avance_promedio.toFixed(1)}%</h3>
          <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-900" style={{ width: `${stats?.summary.avance_promedio}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Financial Performance */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-50 text-blue-900 rounded-lg">
                  <DollarSign size={20} />
               </div>
               <h2 className="text-lg font-bold text-gray-900 tracking-tight">Presupuesto vs Gasto Real</h2>
            </div>
          </div>
          <div className="h-[350px] w-full relative">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stats?.financials} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="presupuesto" fill="#1E3A8A" radius={[4, 4, 0, 0]} barSize={20} name="Presupuesto" />
                <Bar dataKey="gasto" fill="#F97316" radius={[4, 4, 0, 0]} barSize={20} name="Gasto Real" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Distribution */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-8 tracking-tight">Distribución por Tipo</h2>
          <div className="flex-1 flex flex-col justify-center">
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                   <Pie
                     data={stats?.distribution}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={8}
                     dataKey="value"
                   >
                     {stats?.distribution?.map((entry: any, index: number) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="space-y-4 mt-8">
               {stats?.distribution?.map((item: any, index: number) => (
                 <div key={item.name} className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                     <span className="text-gray-500 font-bold tracking-tight">{item.name}</span>
                   </div>
                   <span className="font-black text-gray-900">{item.value}%</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Generated Reports Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Historial de Reportes Generados</h2>
          <button className="p-2 text-gray-400 hover:text-blue-900 transition-colors">
            <Calendar size={20} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Nombre del Reporte</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Fecha</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Generado por</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${report.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {report.type === 'PDF' ? <FileText size={18} /> : <FileSpreadsheet size={18} />}
                      </div>
                      <span className="font-bold text-gray-900 text-sm">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-500">{report.date}</td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-600">{report.user}</td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2.5 bg-gray-50 text-blue-900 rounded-xl hover:bg-blue-900 hover:text-white transition-all shadow-sm">
                      <FileDown size={18} />
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

export default Reports;
