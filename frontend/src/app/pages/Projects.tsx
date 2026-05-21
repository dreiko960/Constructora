import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, HardHat, MoreVertical, ChevronRight, Trash2, AlertCircle } from 'lucide-react';
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

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setError(null);
        const response = await api.get('/proyectos');
        console.log('Projects fetched:', response.data);
        setProjects(response.data);
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        if (error?.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        if (error.code === 'ERR_NETWORK') {
          setError('Error de red: No se pudo conectar con el servidor backend (http://127.0.0.1:8000).');
        } else {
          setError('No se pudieron cargar los proyectos. Por favor, intenta de nuevo más tarde.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const name = project.nombre || '';
    const cliente = project.cliente || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'Todos' || project.tipo === filterType;
    return matchesSearch && matchesType;
  });

  const handleDeleteProject = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) {
      try {
        await api.delete(`/proyectos/${id}`);
        setProjects(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error al eliminar el proyecto');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proyectos de Obra</h1>
          <p className="text-gray-500 mt-1">Gestiona y monitorea todos tus proyectos activos.</p>
        </div>
        <button 
          onClick={() => navigate('/proyectos/nuevo')}
          className="flex items-center justify-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-xl hover:bg-blue-800 transition shadow-lg hover:shadow-blue-900/20 font-bold"
        >
          <Plus size={20} />
          Nuevo Proyecto
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-sm text-red-700 font-bold">{error}</p>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar por nombre o cliente..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="Todos">Todos los tipos</option>
            <option value="Residencial">Residencial</option>
            <option value="Comercial">Comercial</option>
            <option value="Industrial">Industrial</option>
          </select>
          <button className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-4"></div>
          <p className="text-gray-500 font-medium">Cargando proyectos...</p>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group cursor-pointer"
              onClick={() => navigate(`/proyectos/${project.id}`)}
            >
              <div className="h-40 bg-blue-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-blue-200">
                  <HardHat size={64} strokeWidth={1} />
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm ${
                    project.estado === 'Activo' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                  }`}>
                    {project.estado || 'Desconocido'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-1">{project.nombre}</h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => handleDeleteProject(e, project.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.descripcion}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                    <span>Avance</span>
                    <span className="text-gray-900">{project.avance_total}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-900 rounded-full transition-all duration-1000" 
                      style={{ width: `${project.avance_total}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <span className="block font-medium uppercase tracking-tight mb-0.5">Cliente</span>
                    <span className="text-gray-900 font-bold">{project.cliente}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-900 group-hover:text-white transition-all">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No se encontraron proyectos</h3>
          <p className="text-gray-500 mt-1 max-w-xs mx-auto">Prueba ajustando tus filtros o términos de búsqueda.</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
