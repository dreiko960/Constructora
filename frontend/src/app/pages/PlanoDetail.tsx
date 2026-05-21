import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  FileText,
  Download,
  Share2,
  Printer,
  Plus,
  Clock,
  User,
  Tag,
  Layers,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Upload,
  X,
  Loader2,
  Search,
  ExternalLink
} from 'lucide-react';
import api from '../../lib/api';

interface Plano {
  id: number;
  nombre: string;
  tipo: string;
  numero_plano: string;
  descripcion: string;
  estado: string;
  archivo_url: string;
  fecha_creacion: string;
  proyecto_id: number;
}

interface VersionPlano {
  id: number;
  plano_id: number;
  version: string;
  archivo_url: string;
  cambios: string;
  fecha_version: string;
  modificado_por: number;
}

interface Proyecto {
  id: number;
  nombre: string;
}

const PlanoDetail: React.FC = () => {
  const { id: proyectoId, planoId } = useParams<{ id: string; planoId: string }>();
  const navigate = useNavigate();

  const [plano, setPlano] = useState<Plano | null>(null);
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [versiones, setVersiones] = useState<VersionPlano[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ version: '', cambios: '', archivo_url: '' });

  const fetchPlanoData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [planoRes, versionesRes, proyectoRes] = await Promise.all([
        api.get(`/planos/${planoId}`),
        api.get(`/planos/${planoId}/versiones`),
        api.get(`/proyectos/${proyectoId}`)
      ]);
      setPlano(planoRes.data);
      setVersiones(versionesRes.data);
      setProyecto(proyectoRes.data);
    } catch (error) {
      console.error('Error fetching plano data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [planoId, proyectoId]);

  useEffect(() => {
    fetchPlanoData();
  }, [fetchPlanoData]);

  const handleUploadVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.version) return;
    setIsUploading(true);
    try {
      await api.post(`/planos/${planoId}/versiones`, {
        version: uploadForm.version,
        archivo_url: uploadForm.archivo_url || `/uploads/planos/${plano?.nombre.replace(/\s+/g, '_')}_v${uploadForm.version}.pdf`,
        cambios: uploadForm.cambios,
        modificado_por: 1
      });
      setShowUploadModal(false);
      setUploadForm({ version: '', cambios: '', archivo_url: '' });
      fetchPlanoData();
    } catch (error) {
      console.error('Error uploading version:', error);
      alert('Error al subir la versión');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteVersion = async (versionId: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta versión?')) return;
    try {
      await api.delete(`/planos/${planoId}/versiones/${versionId}`);
      fetchPlanoData();
    } catch (error) {
      console.error('Error deleting version:', error);
    }
  };

  const handleDownload = () => {
    if (plano?.archivo_url) {
      window.open(`http://localhost:8000${plano.archivo_url}`, '_blank');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Enlace copiado al portapapeles');
    } catch {
      prompt('Copia este enlace:', shareUrl);
    }
  };

  const filteredVersiones = versiones.filter(v =>
    v.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.cambios && v.cambios.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const latestVersion = versiones.length > 0
    ? versiones.reduce((a, b) => a.id > b.id ? a : b)
    : null;

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Aprobado': return 'bg-green-100 text-green-700';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-700';
      case 'Rechazado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getFileTypeIcon = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase();
    return <FileText size={48} className="text-blue-400" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="animate-spin text-blue-900" size={48} />
      </div>
    );
  }

  if (!plano) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Plano no encontrado</h2>
        <button onClick={() => navigate(`/proyectos/${proyectoId}`)} className="mt-4 text-blue-900 hover:text-blue-800 font-bold">
          Volver al proyecto
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-[1400px] mx-auto">
      {/* Breadcrumb + Acciones superiores */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate(`/proyectos/${proyectoId}`)}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-900 font-bold transition-colors w-fit group text-sm"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            Volver a Proyectos
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <button onClick={() => navigate('/proyectos')} className="hover:text-blue-900 transition font-medium">Proyectos</button>
            <ChevronLeft size={14} className="rotate-180" />
            <button onClick={() => navigate(`/proyectos/${proyectoId}`)} className="hover:text-blue-900 transition font-medium truncate max-w-[200px]">{proyecto?.nombre || 'Proyecto'}</button>
            <ChevronLeft size={14} className="rotate-180" />
            <span className="text-gray-900 font-bold truncate max-w-[250px]">{plano.nombre}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-blue-900 transition font-bold text-sm shadow-sm">
            <Share2 size={16} />
            <span className="hidden sm:inline">Compartir</span>
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-blue-900 transition font-bold text-sm shadow-sm">
            <Printer size={16} />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-blue-900 transition font-bold text-sm shadow-sm">
            <Download size={16} />
            <span className="hidden sm:inline">Descargar</span>
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition font-bold text-sm shadow-lg hover:shadow-blue-900/20"
          >
            <Plus size={16} />
            Subir Versión
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* COLUMNA IZQUIERDA — Información + Historial (60%) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Información del Plano */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header del plano */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getEstadoColor(plano.estado)}`}>
                      {plano.estado}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700">
                      {plano.tipo}
                    </span>
                    {latestVersion && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700">
                        v{latestVersion.version}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">{plano.nombre}</h1>
                  {plano.numero_plano && (
                    <p className="text-sm font-medium text-gray-400">N° de plano: <span className="text-gray-600 font-bold">{plano.numero_plano}</span></p>
                  )}
                </div>
                <FileText size={64} className="text-blue-100 flex-shrink-0 hidden md:block" />
              </div>
              {plano.descripcion && (
                <p className="text-gray-600 leading-relaxed font-medium text-sm">{plano.descripcion}</p>
              )}
            </div>

            {/* Metadatos */}
            <div className="px-6 py-5 bg-gray-50/50 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-gray-100">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Calendar size={12} />
                  F. Creación
                </div>
                <p className="text-sm font-bold text-gray-900">{new Date(plano.fecha_creacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Layers size={12} />
                  Tipo de Plano
                </div>
                <p className="text-sm font-bold text-gray-900">{plano.tipo}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Tag size={12} />
                  N° Plano
                </div>
                <p className="text-sm font-bold text-gray-900">{plano.numero_plano || 'Sin asignar'}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Clock size={12} />
                  Versiones
                </div>
                <p className="text-sm font-bold text-gray-900">{versiones.length} {versiones.length === 1 ? 'versión' : 'versiones'}</p>
              </div>
            </div>
          </div>

          {/* Historial de Versiones */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-bold text-gray-900">Historial de Versiones</h2>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-blue-900 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                >
                  <Upload size={14} />
                  Nueva Versión
                </button>
              </div>

              {/* Buscador de versiones */}
              {versiones.length > 0 && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por versión o cambios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                  />
                </div>
              )}
            </div>

            <div className="divide-y divide-gray-50">
              {versiones.length > 0 ? (
                filteredVersiones.map((ver, index) => (
                  <div key={ver.id} className="px-6 py-5 hover:bg-gray-50/50 transition-colors group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-xs ${
                          index === 0 ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {index === 0 ? 'ACT' : `v${ver.version}`}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-bold text-gray-900 text-sm">
                              Versión {ver.version}
                              {index === 0 && <span className="ml-2 text-[10px] font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Actual</span>}
                            </h3>
                          </div>
                          {ver.cambios && (
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">{ver.cambios}</p>
                          )}
                          <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(ver.fecha_version).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <User size={12} />
                              Usuario #{ver.modificado_por}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {ver.archivo_url && (
                          <a
                            href={`http://localhost:8000${ver.archivo_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all"
                            title="Ver archivo"
                          >
                            <Eye size={16} />
                          </a>
                        )}
                        {ver.archivo_url && (
                          <a
                            href={`http://localhost:8000${ver.archivo_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Descargar"
                          >
                            <Download size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => handleDeleteVersion(ver.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Eliminar versión"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <FileText size={40} className="mx-auto mb-3 text-gray-200" />
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sin versiones registradas</p>
                  <p className="text-xs text-gray-400 mt-1">Sube una versión para comenzar el historial</p>
                </div>
              )}
              {filteredVersiones.length === 0 && searchTerm && versiones.length > 0 && (
                <div className="px-6 py-8 text-center">
                  <Search size={32} className="mx-auto mb-2 text-gray-200" />
                  <p className="text-sm font-bold text-gray-400">No se encontraron versiones para "{searchTerm}"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA — Vista Previa (40%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card de Vista Previa */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">Vista Previa</h3>
              {plano.archivo_url && (
                <a
                  href={`http://localhost:8000${plano.archivo_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-900 hover:underline uppercase tracking-wider"
                >
                  Abrir <ExternalLink size={12} />
                </a>
              )}
            </div>

            <div className="p-8">
              {/* Área de simulación visual del plano */}
              <div className="relative bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden aspect-[4/3] flex flex-col items-center justify-center p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/20" />

                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  {getFileTypeIcon(plano.archivo_url || '.pdf')}

                  <div className="space-y-1">
                    <p className="text-sm font-black text-gray-700 tracking-tight">
                      {plano.nombre}
                    </p>
                    {latestVersion && (
                      <p className="text-xs font-bold text-blue-600">
                        v{latestVersion.version} — Actual
                      </p>
                    )}
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Simulación de visualización</p>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed max-w-[220px]">
                      {plano.tipo} — {plano.numero_plano || 'Sin numeración'}
                    </p>
                  </div>

                  {/* Indicadores visuales de un plano */}
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-[10px] font-bold text-gray-500">{plano.tipo}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="text-[10px] font-bold text-gray-500">{plano.estado}</span>
                    </div>
                  </div>
                </div>

                {/* Grid decorativo de plano técnico */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E3A8A" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Acciones rápidas bajo la vista previa */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <button onClick={handleDownload} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-900 transition group">
                  <Download size={18} className="text-gray-400 group-hover:text-blue-900 transition" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-blue-900">Descargar</span>
                </button>
                <button onClick={handleShare} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-900 transition group">
                  <Share2 size={18} className="text-gray-400 group-hover:text-blue-900 transition" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-blue-900">Compartir</span>
                </button>
                <button onClick={handlePrint} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-900 transition group">
                  <Printer size={18} className="text-gray-400 group-hover:text-blue-900 transition" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-blue-900">Imprimir</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card de Información Rápida */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">Información Rápida</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Proyecto</span>
                <span className="text-xs font-bold text-gray-900 truncate max-w-[160px]">{proyecto?.nombre}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tipo</span>
                <span className="text-xs font-bold text-gray-900">{plano.tipo}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</span>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${getEstadoColor(plano.estado)}`}>{plano.estado}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">N° Plano</span>
                <span className="text-xs font-bold text-gray-900">{plano.numero_plano || '—'}</span>
              </div>
              {latestVersion && (
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Versión actual</span>
                  <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">v{latestVersion.version}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Versiones</span>
                <span className="text-xs font-bold text-gray-900">{versiones.length}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Creado</span>
                <span className="text-xs font-bold text-gray-900">{new Date(plano.fecha_creacion).toLocaleDateString('es-ES')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Subir Versión */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-black text-gray-900">Subir Nueva Versión</h3>
              <button onClick={() => { setShowUploadModal(false); setUploadForm({ version: '', cambios: '', archivo_url: '' }); }} className="p-2 hover:bg-gray-200 rounded-xl transition text-gray-500">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadVersion} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Número de Versión *</label>
                <input
                  type="text"
                  placeholder="Ej: 2.0, 1.3, 3.0"
                  value={uploadForm.version}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, version: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                />
                <p className="text-[10px] text-gray-400 mt-1 font-medium">Usa formato vX.Y (ej: 2.0, 1.5)</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Cambios / Descripción</label>
                <textarea
                  placeholder="Describe los cambios realizados en esta versión..."
                  value={uploadForm.cambios}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, cambios: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Archivo del Plano (opcional)</label>
                <input
                  type="file"
                  accept=".pdf,.dwg,.dxf,.zip"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition text-sm">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="bg-blue-900 text-white px-6 py-2.5 rounded-xl hover:bg-blue-800 transition font-bold shadow-xl disabled:bg-blue-300 flex items-center gap-2 text-sm"
                >
                  {isUploading && <Loader2 className="animate-spin" size={16} />}
                  {isUploading ? 'Subiendo...' : 'Subir Versión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanoDetail;
