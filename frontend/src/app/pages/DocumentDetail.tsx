import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, User, Tag, Info, Download, Edit, Trash2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import api from '../../lib/api';

interface DocumentDetail {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string;
  archivo_url: string;
  estado: string;
  version: string;
  tamaño: number;
  fecha_subida: string;
  subido_por: number;
  proyecto_id: number;
  fecha_aprob: string | null;
  aprobado_por: number | null;
}

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<DocumentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await api.get(`/documents/${id}`);
      setDoc(response.data);
    } catch (err) {
      setError('Error al cargar el documento');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este documento?')) return;
    try {
      await api.delete(`/documents/${id}`);
      navigate('/documentos');
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Error al eliminar el documento');
    }
  };

  const handleDownload = () => {
    if (!doc?.archivo_url) return;
    const url = doc.archivo_url.startsWith('http') ? doc.archivo_url : `http://localhost:8000${doc.archivo_url}`;
    const link = window.document.createElement('a');
    link.href = url;
    link.download = doc.nombre;
    link.target = '_blank';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handleView = () => {
    if (!doc?.archivo_url) return;
    const url = doc.archivo_url.startsWith('http') ? doc.archivo_url : `http://localhost:8000${doc.archivo_url}`;
    window.open(url, '_blank');
  };

  const estadoConfig: Record<string, { icon: React.ReactNode; className: string }> = {
    'Aprobado': { icon: <CheckCircle2 size={14} />, className: 'bg-green-100 text-green-700' },
    'Pendiente': { icon: <Clock size={14} />, className: 'bg-orange-100 text-orange-700' },
    'Rechazado': { icon: <XCircle size={14} />, className: 'bg-red-100 text-red-700' },
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-bold">{error || 'Documento no encontrado'}</p>
        <button onClick={() => navigate('/documentos')} className="mt-4 text-blue-900 font-bold hover:underline">
          Volver a Documentos
        </button>
      </div>
    );
  }

  const estado = estadoConfig[doc.estado] || estadoConfig['Pendiente'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/documentos')} className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-500">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{doc.nombre}</h1>
          <p className="text-gray-500 mt-1">Detalles del documento</p>
        </div>
        <div className="flex items-center gap-2">
          {doc.archivo_url && (
            <>
              <button onClick={handleView} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-900 rounded-xl hover:bg-blue-100 transition font-bold">
                <FileText size={18} /> Visualizar
              </button>
              <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition font-bold">
                <Download size={18} /> Descargar
              </button>
            </>
          )}
          <button onClick={() => navigate(`/documentos/editar/${id}`)} className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition font-bold">
            <Edit size={18} /> Editar
          </button>
          <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition font-bold">
            <Trash2 size={18} /> Eliminar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tight">Información General</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</label>
                <p className="text-gray-900 font-bold mt-1">{doc.nombre}</p>
              </div>
              {doc.descripcion && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Descripción</label>
                  <p className="text-gray-700 mt-1">{doc.descripcion}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo</label>
                  <p className="text-gray-900 font-bold mt-1">{doc.tipo || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Versión</label>
                  <p className="text-gray-900 font-bold mt-1">{doc.version || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {doc.archivo_url && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tight">Archivo</h2>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="p-3 bg-blue-100 text-blue-900 rounded-xl">
                  <FileText size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{doc.archivo_url.split('/').pop()}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(doc.tamaño)}</p>
                </div>
                <button onClick={handleView} className="p-2 text-blue-900 hover:bg-blue-50 rounded-lg transition">
                  <FileText size={20} />
                </button>
                <button onClick={handleDownload} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                  <Download size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-tight">Estado</h3>
            <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${estado.className}`}>
              {estado.icon}
              {doc.estado}
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Metadatos</h3>
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Fecha Subida</p>
                <p className="text-sm font-bold text-gray-700">{new Date(doc.fecha_subida).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User size={16} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Subido por</p>
                <p className="text-sm font-bold text-gray-700">{doc.subido_por === 1 ? 'Admin' : `Usuario ${doc.subido_por}`}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Tag size={16} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Tipo</p>
                <p className="text-sm font-bold text-gray-700">{doc.tipo || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Info size={16} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Tamaño</p>
                <p className="text-sm font-bold text-gray-700">{formatFileSize(doc.tamaño)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;
