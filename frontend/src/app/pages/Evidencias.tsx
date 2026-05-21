import React, { useState, useEffect } from 'react';
import { Search, Filter, Camera, MapPin, Calendar, Tag, ChevronRight, Eye, Download, Trash2, Maximize2, X } from 'lucide-react';
import api from '../../lib/api';

interface Evidencia {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  archivo_url: string;
  fecha_captura: string;
  subido_por: number;
  tags: string;
  project_name?: string;
}

const Evidencias: React.FC = () => {
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [evidRes, projRes] = await Promise.all([
        api.get('/evidencias'),
        api.get('/proyectos')
      ]);
      setEvidencias(evidRes.data);
      setProjects(projRes.data);
    } catch (error) {
      console.error('Error fetching evidence:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleCreateEvidence = async (e: any) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const fileInput = e.target.querySelector('input[type="file"]');
    const file = fileInput?.files?.[0];
    
    try {
      let archivo_url = '';
      if (file) {
        archivo_url = await handleFileUpload(file);
      }
      
      await api.post('/evidencias-general', { ...data, archivo_url, subido_por: 1, fecha_captura: new Date().toISOString() });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating evidence:', error);
      alert('Error al subir la evidencia');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteEvidence = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta evidencia?')) {
      try {
        await api.delete(`/evidencias/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting evidence:', error);
        alert('Error al eliminar la evidencia');
      }
    }
  };

  const filteredEvidencias = evidencias.filter(evid => 
    evid.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evid.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evid.tags.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (evid.project_name && evid.project_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registro de Evidencias</h1>
          <p className="text-gray-500 mt-1">Monitoreo visual del progreso de todas las obras en tiempo real.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-xl hover:bg-blue-800 transition shadow-lg hover:shadow-blue-900/20 font-bold"
        >
          <Camera size={20} />
          Subir Evidencia
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar por título, proyecto o etiquetas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-medium"
          />
        </div>
        <button className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition">
          <Filter size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          </div>
        ) : filteredEvidencias.map((evid) => (
          <div key={evid.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
              {evid.archivo_url ? (
                <img src={evid.archivo_url.startsWith('http') ? evid.archivo_url : `http://localhost:8000${evid.archivo_url}`} alt={evid.titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <Camera size={48} className="text-gray-300 group-hover:scale-110 transition-transform duration-700" strokeWidth={1} />
              )}
              <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors"></div>
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="p-2 bg-white/90 text-blue-900 rounded-lg shadow-sm hover:bg-white transition">
                    <Maximize2 size={16} />
                 </button>
                 <button className="p-2 bg-white/90 text-blue-900 rounded-lg shadow-sm hover:bg-white transition">
                    <Download size={16} />
                 </button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                  {projects.find(p => p.id === (evid as any).proyecto_id)?.nombre || 'Proyecto'}
                </span>
                <h3 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-blue-900 transition-colors">{evid.titulo}</h3>
              </div>
              
              <div className="space-y-2 text-xs font-bold text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  {new Date(evid.fecha_captura).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-gray-400" />
                  <span className="line-clamp-1">{evid.tags || 'Sin etiquetas'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-black text-blue-900 border border-white shadow-sm">
                    {evid.subido_por === 1 ? 'AD' : 'US'}
                  </div>
                  <span className="text-[11px] font-bold text-gray-700">{evid.subido_por === 1 ? 'Admin' : 'Usuario'}</span>
                </div>
                <button 
                  onClick={() => handleDeleteEvidence(evid.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {!isLoading && evidencias.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 font-bold uppercase tracking-widest">
            No hay evidencias registradas
          </div>
        )}
      </div>

      {/* Modal para Subir Evidencia */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Nueva Evidencia</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-xl transition text-gray-500">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateEvidence} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Título</label>
                <input name="titulo" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Proyecto</label>
                <select name="proyecto_id" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Etiquetas (separadas por coma)</label>
                <input name="tags" placeholder="Ej: Vaciado, Piso 1" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Foto de la Evidencia</label>
                <input type="file" name="file" accept="image/jpeg, image/png, image/jpg, image/gif, image/webp" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="bg-blue-900 text-white px-8 py-3 rounded-2xl hover:bg-blue-800 transition font-bold shadow-xl disabled:bg-blue-300 flex items-center gap-2"
                >
                  {isUploading ? 'Subiendo...' : 'Subir Evidencia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evidencias;
