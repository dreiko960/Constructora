import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText, 
  Activity, 
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Download,
  Edit2,
  MoreVertical,
  ChevronRight,
  Trash2,
  XCircle,
  Loader2
} from 'lucide-react';
import api from '../../lib/api';

interface Project {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  cliente: string;
  fecha_inicio: string;
  fecha_fin: string;
  presupuesto: number;
  avance_total: number;
  estado: string;
  tipo: string;
}

interface Plano {
  id: number;
  nombre: string;
  tipo: string;
  numero_plano: string;
  descripcion: string;
  estado: string;
  fecha_creacion: string;
}

interface Actividad {
  id: number;
  nombre: string;
  descripcion: string;
  responsable_id: number;
  fecha_inicio: string;
  fecha_fin_plan: string;
  avance_plan: number;
  avance_real: number;
  estado: string;
  prioridad: string;
}

interface Evidencia {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  archivo_url: string;
  fecha_captura: string;
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);
  const [activeTab, setActiveTab] = useState('resumen');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'plano' | 'actividad' | 'editar-actividad' | 'evidencia' | 'editar-proyecto' | null>(null);
  const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    setIsLoading(true);
    try {
      const [projRes, planosRes, activitiesRes, evidencesRes] = await Promise.all([
        api.get(`/proyectos/${id}`),
        api.get(`/proyectos/${id}/planos`),
        api.get(`/proyectos/${id}/actividades`),
        api.get(`/proyectos/${id}/evidencias`)
      ]);
      
      setProject(projRes.data);
      setPlanos(planosRes.data);
      setActividades(activitiesRes.data);
      setEvidencias(evidencesRes.data);
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleCreateItem = async (type: 'plano' | 'actividad' | 'editar-actividad' | 'evidencia' | 'editar-proyecto', data: any, file?: File) => {
    try {
      setIsUploading(true);
      let finalData = { ...data };
      
      if (file) {
        const url = await handleFileUpload(file);
        finalData.archivo_url = url;
      }

      if (type === 'editar-proyecto') {
        const updateData = {
          ...finalData,
          presupuesto: parseInt(finalData.presupuesto) || 0,
          avance_total: parseInt(finalData.avance_total) || 0,
        };
        await api.put(`/proyectos/${id}`, updateData);
      } else if (type === 'editar-actividad') {
        const updateData = {
          ...finalData,
          avance_real: parseInt(finalData.avance_real) || 0,
        };
        await api.put(`/actividades/${selectedActividad?.id}`, updateData);
      } else {
        const endpoint = type === 'plano' ? `/proyectos/${id}/planos` : 
                         type === 'actividad' ? `/proyectos/${id}/actividades` : 
                         `/proyectos/${id}/evidencias`;
        
        const creationData = {
          ...finalData,
          proyecto_id: parseInt(id!),
          responsable_id: finalData.responsable_id ? parseInt(finalData.responsable_id) : 1,
          creado_por: finalData.creado_por ? parseInt(finalData.creado_por) : 1,
          subido_por: finalData.subido_por ? parseInt(finalData.subido_por) : 1,
          actividad_id: finalData.actividad_id ? parseInt(finalData.actividad_id) : undefined,
          presupuesto: finalData.presupuesto ? parseInt(finalData.presupuesto) : undefined,
          avance_plan: finalData.avance_plan ? parseInt(finalData.avance_plan) : 0,
          avance_real: finalData.avance_real ? parseInt(finalData.avance_real) : 0,
        };
        
        await api.post(endpoint, creationData);
      }
      setIsModalOpen(false);
      fetchProjectData();
    } catch (error) {
      console.error(`Error updating/creating ${type}:`, error);
      alert('Error al procesar la solicitud');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteItem = async (type: 'plano' | 'actividad' | 'evidencia', itemId: number) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar esta ${type === 'plano' ? 'plano' : type === 'actividad' ? 'actividad' : 'evidencia'}?`)) {
      try {
        const endpoint = type === 'plano' ? `/planos/${itemId}` : 
                         type === 'actividad' ? `/actividades/${itemId}` : 
                         `/evidencias/${itemId}`;
        await api.delete(endpoint);
        fetchProjectData();
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        alert('Error al eliminar el elemento');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Proyecto no encontrado</h2>
        <button 
          onClick={() => navigate('/proyectos')}
          className="mt-4 text-blue-900 hover:text-blue-800 font-bold"
        >
          Volver a Proyectos
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
    { id: 'planos', label: 'Planos', icon: FileText },
    { id: 'avance', label: 'Avance/Actividades', icon: Activity },
    { id: 'evidencias', label: 'Evidencias', icon: ImageIcon },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header with Navigation */}
      <div className="flex flex-col gap-6">
        <button 
          onClick={() => navigate('/proyectos')}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-900 font-bold transition-colors w-fit group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          Volver a Proyectos
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm ${
                project.estado === 'Activo' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
              }`}>
                {project.estado}
              </span>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{project.tipo}</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{project.nombre}</h1>
            <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-1.5">
                <MapPin size={16} />
                {project.ubicacion}
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={16} />
                {project.cliente}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setModalType('editar-proyecto'); setIsModalOpen(true); }}
              className="p-3 bg-white border border-gray-200 rounded-xl text-blue-900 hover:bg-blue-50 transition shadow-sm font-bold flex items-center gap-2"
            >
              <Edit2 size={20} />
              Editar
            </button>
            <button className="flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-xl hover:bg-blue-800 transition shadow-lg hover:shadow-blue-900/20 font-bold">
              <Plus size={20} />
              Agregar Item
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 font-bold text-sm whitespace-nowrap
              ${activeTab === tab.id 
                ? 'bg-blue-900 text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <tab.icon size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'resumen' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Descripción del Proyecto</h2>
                <p className="text-gray-600 leading-relaxed font-medium">{project.descripcion}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha Inicio</span>
                    <p className="font-bold text-gray-900">{project.fecha_inicio}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha Fin</span>
                    <p className="font-bold text-gray-900">{project.fecha_fin}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Presupuesto</span>
                    <p className="font-bold text-gray-900">${project.presupuesto.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Progress Card */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Estado de Avance General</h2>
                  <span className="text-3xl font-black text-blue-900">{project.avance_total}%</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-blue-900 rounded-full transition-all duration-1000" 
                    style={{ width: `${project.avance_total}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-4 bg-gray-50 rounded-2xl">
                    <span className="block text-2xl font-bold text-gray-900">24</span>
                    <span className="text-xs font-bold text-gray-400 uppercase">Actividades</span>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-2xl">
                    <span className="block text-2xl font-bold text-gray-900 text-green-600">18</span>
                    <span className="text-xs font-bold text-gray-400 uppercase">Completadas</span>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-2xl">
                    <span className="block text-2xl font-bold text-gray-900 text-orange-600">6</span>
                    <span className="text-xs font-bold text-gray-400 uppercase">En Proceso</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Team Members Card */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Equipo Asignado</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-900">
                        {i === 1 ? 'JA' : i === 2 ? 'ML' : 'RB'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {i === 1 ? 'Juan Alberto' : i === 2 ? 'Maria Lopez' : 'Ricardo Beltrán'}
                        </p>
                        <p className="text-xs font-medium text-gray-500">
                          {i === 1 ? 'Residente' : i === 2 ? 'Ing. Civil' : 'Seguridad'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 bg-gray-50 text-blue-900 font-bold text-sm rounded-xl hover:bg-gray-100 transition">
                  Gestionar Equipo
                </button>
              </div>

              {/* Location Mini Map Placeholder */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Ubicación</h2>
                <div className="h-48 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-200 shadow-inner overflow-hidden relative">
                   <div className="absolute inset-0 bg-blue-50/50"></div>
                   <MapPin size={32} className="text-blue-900/30 relative z-10" />
                </div>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <MapPin size={16} className="text-blue-900" />
                  {project.ubicacion}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'planos' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Planos del Proyecto</h2>
                <button 
                  onClick={() => { setModalType('plano'); setIsModalOpen(true); }}
                  className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-xl hover:bg-blue-800 transition font-bold text-sm"
                >
                  <Plus size={18} />
                  Subir Plano
                </button>
             </div>
             <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {planos.map((plano) => (
                  <div key={plano.id} className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden group cursor-pointer hover:border-blue-900 transition">
                    <div className="h-40 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                       <FileText size={48} className="text-gray-400 group-hover:scale-110 transition-transform duration-500" />
                       <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors"></div>
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest bg-blue-100 px-2 py-0.5 rounded">{plano.tipo}</span>
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{plano.nombre}</h4>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">Última mod: {new Date(plano.fecha_creacion).toLocaleDateString()}</p>
                      <div className="flex items-center justify-between pt-2">
                         <div className="flex items-center gap-1">
                            <button className="p-1.5 hover:bg-white rounded-lg transition text-gray-400 hover:text-blue-900">
                              <Download size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem('plano', plano.id)}
                              className="p-1.5 hover:bg-white rounded-lg transition text-gray-400 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                         </div>
                      <button onClick={() => navigate(`/proyectos/${id}/planos/${plano.id}`)} className="text-[11px] font-black text-blue-900 hover:underline uppercase tracking-wider">Ver Detalle</button>
                      </div>
                    </div>
                  </div>
                ))}
                {planos.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-400 font-bold uppercase tracking-widest">
                    No hay planos registrados
                  </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'avance' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Cronograma de Actividades</h2>
                <button 
                  onClick={() => { setModalType('actividad'); setIsModalOpen(true); }}
                  className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-xl hover:bg-blue-800 transition font-bold text-sm"
                >
                  <Plus size={18} />
                  Nueva Actividad
                </button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actividad</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Plazo</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Avance</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {actividades.map((act) => (
                      <tr key={act.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <span className="font-bold text-gray-900 block">{act.nombre}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Responsable: ID #{act.responsable_id}</span>
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-gray-600 tracking-tight">
                          {act.fecha_inicio} - {act.fecha_fin_plan}
                        </td>
                        <td className="px-8 py-5">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              act.estado === 'Completada' ? 'bg-green-100 text-green-700' : 
                              act.estado === 'En proceso' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                           }`}>
                             {act.estado}
                           </span>
                        </td>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[80px] shadow-inner">
                                <div 
                                  className={`h-full rounded-full ${act.avance_real === 100 ? 'bg-green-500' : 'bg-blue-900'}`}
                                  style={{ width: `${act.avance_real}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-black text-gray-900">{act.avance_real}%</span>
                           </div>
                        </td>
                        <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex justify-end gap-1">
                            <button 
                              onClick={() => { setSelectedActividad(act); setModalType('editar-actividad'); setIsModalOpen(true); }}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem('actividad', act.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {actividades.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-8 py-12 text-center text-gray-400 font-bold uppercase tracking-widest">
                          No hay actividades registradas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'evidencias' && (
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Evidencias Fotográficas</h2>
                <button 
                  onClick={() => { setModalType('evidencia'); setIsModalOpen(true); }}
                  className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-xl hover:bg-blue-800 transition font-bold text-sm"
                >
                  <Plus size={18} />
                  Subir Fotos
                </button>
             </div>
             <div className="p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {evidencias.map((evid) => (
                  <div key={evid.id} className="group relative bg-gray-100 rounded-2xl aspect-square overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                    {evid.archivo_url ? (
                      <img src={evid.archivo_url.startsWith('http') ? evid.archivo_url : `http://localhost:8000${evid.archivo_url}`} alt={evid.titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                         <ImageIcon size={48} strokeWidth={1} className="group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4 text-white z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-between items-end">
                       <div>
                         <p className="text-xs font-black uppercase tracking-widest mb-1">{evid.titulo}</p>
                         <p className="text-[10px] font-bold text-white/80 tracking-tighter">Subido el {new Date(evid.fecha_captura).toLocaleDateString()}</p>
                       </div>
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleDeleteItem('evidencia', evid.id); }}
                         className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-lg"
                       >
                         <Trash2 size={14} />
                       </button>
                    </div>
                  </div>
                ))}
                {evidencias.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-400 font-bold uppercase tracking-widest">
                    No hay evidencias registradas
                  </div>
                )}
             </div>
           </div>
        )}
      </div>
      {/* Modal para Creación de Items */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                {modalType === 'editar-proyecto' ? 'Editar Proyecto' : modalType === 'editar-actividad' ? 'Editar Actividad' : `Nuevo ${modalType === 'plano' ? 'Plano' : modalType === 'actividad' ? 'Actividad' : 'Evidencia'}`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-xl transition text-gray-500">
                <XCircle size={24} />
              </button>
            </div>
            
            <form 
              onSubmit={(e: any) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                const fileInput = e.target.querySelector('input[type="file"]');
                const file = fileInput?.files?.[0];
                handleCreateItem(modalType!, data, file);
              }}
              className="p-8 space-y-6 max-h-[70vh] overflow-y-auto"
            >
              {modalType === 'editar-proyecto' && project && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Nombre</label>
                    <input name="nombre" defaultValue={project.nombre} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Descripción</label>
                    <textarea name="descripcion" defaultValue={project.descripcion} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Ubicación</label>
                      <input name="ubicacion" defaultValue={project.ubicacion} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Cliente</label>
                      <input name="cliente" defaultValue={project.cliente} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Presupuesto</label>
                      <input name="presupuesto" type="number" defaultValue={project.presupuesto} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Avance (%)</label>
                      <input name="avance_total" type="number" defaultValue={project.avance_total} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Estado</label>
                      <select name="estado" defaultValue={project.estado} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                        <option>Activo</option>
                        <option>Completado</option>
                        <option>En Pausa</option>
                        <option>Cancelado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Tipo</label>
                      <select name="tipo" defaultValue={project.tipo} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                        <option>Residencial</option>
                        <option>Comercial</option>
                        <option>Industrial</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {modalType === 'plano' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Nombre del Plano</label>
                    <input name="nombre" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Número de Plano</label>
                      <input name="numero_plano" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Tipo</label>
                      <select name="tipo" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                        <option>Estructural</option>
                        <option>Arquitectónico</option>
                        <option>Eléctrico</option>
                        <option>Sanitario</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Archivo del Plano (PDF/DWG)</label>
                    <input type="file" name="file" accept=".pdf,.dwg,.zip" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  </div>
                  <input type="hidden" name="creado_por" value="1" />
                </>
              )}

              {modalType === 'actividad' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Nombre de la Actividad</label>
                    <input name="nombre" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Fecha Inicio</label>
                      <input name="fecha_inicio" type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Fecha Fin Plan</label>
                      <input name="fecha_fin_plan" type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                    </div>
                  </div>
                  <input type="hidden" name="responsable_id" value="1" />
                </>
              )}

              {modalType === 'editar-actividad' && selectedActividad && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Nombre de la Actividad</label>
                    <input name="nombre" defaultValue={selectedActividad.nombre} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Fecha Inicio</label>
                      <input name="fecha_inicio" type="date" defaultValue={selectedActividad.fecha_inicio} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Fecha Fin Plan</label>
                      <input name="fecha_fin_plan" type="date" defaultValue={selectedActividad.fecha_fin_plan} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Avance Real (%)</label>
                      <input name="avance_real" type="number" defaultValue={selectedActividad.avance_real} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Estado</label>
                      <select name="estado" defaultValue={selectedActividad.estado} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                        <option>No iniciada</option>
                        <option>En proceso</option>
                        <option>Completada</option>
                        <option>Retrasada</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {modalType === 'evidencia' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Título de la Evidencia</label>
                    <input name="titulo" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Actividad Relacionada</label>
                    <select name="actividad_id" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                      {actividades.map(act => (
                        <option key={act.id} value={act.id}>{act.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Foto de la Evidencia</label>
                    <input type="file" name="file" accept="image/jpeg, image/png, image/jpg, image/gif, image/webp" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  </div>
                  <input type="hidden" name="subido_por" value="1" />
                  <input type="hidden" name="fecha_captura" value={new Date().toISOString()} />
                </>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="bg-blue-900 text-white px-8 py-3 rounded-2xl hover:bg-blue-800 transition font-bold shadow-xl disabled:bg-blue-300 flex items-center gap-2"
                >
                  {isUploading && <Loader2 className="animate-spin" size={18} />}
                  {isUploading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
