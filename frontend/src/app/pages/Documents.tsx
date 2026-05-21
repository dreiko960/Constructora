import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileText, Download, Eye, CheckCircle2, XCircle, Clock, Trash2, X, Upload, Pencil } from 'lucide-react';
import api from '../../lib/api';

interface Document {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string;
  archivo_url: string;
  estado: string;
  version: string;
  tamaño: number;
  subido_por: number;
  fecha_subida: string;
  proyecto_id: number;
}

interface Proyecto {
  id: number;
  nombre: string;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDocuments();
    fetchProyectos();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProyectos = async () => {
    try {
      const response = await api.get('/proyectos');
      setProyectos(response.data);
    } catch (error) {
      console.error('Error fetching proyectos:', error);
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const response = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const handleCreateDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nombre = formData.get('nombre') as string;
    const tipo = formData.get('tipo') as string;
    const estado = formData.get('estado') as string;
    const descripcion = formData.get('descripcion') as string;
    const proyectoId = formData.get('proyecto_id') as string;
    const version = formData.get('version') as string;

    try {
      let archivoUrl = '';
      if (selectedFile) {
        const url = await uploadFile(selectedFile);
        if (!url) {
          alert('Error al subir el archivo');
          return;
        }
        archivoUrl = url;
      }

      await api.post('/documents', {
        nombre,
        tipo,
        estado,
        descripcion,
        version: version || '1.0',
        archivo_url: archivoUrl,
        proyecto_id: proyectoId ? parseInt(proyectoId) : null,
        subido_por: 1,
      });
      setIsModalOpen(false);
      setSelectedFile(null);
      fetchDocuments();
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Error al crear el documento');
    }
  };

  const handleEditDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDoc) return;
    const formData = new FormData(e.currentTarget);
    const nombre = formData.get('nombre') as string;
    const tipo = formData.get('tipo') as string;
    const estado = formData.get('estado') as string;
    const descripcion = formData.get('descripcion') as string;
    const proyectoId = formData.get('proyecto_id') as string;
    const version = formData.get('version') as string;

    try {
      let archivoUrl = editingDoc.archivo_url;
      if (editSelectedFile) {
        const url = await uploadFile(editSelectedFile);
        if (!url) {
          alert('Error al subir el archivo');
          return;
        }
        archivoUrl = url;
      }

      await api.put(`/documents/${editingDoc.id}`, {
        nombre,
        tipo,
        estado,
        descripcion,
        version,
        archivo_url: archivoUrl,
        proyecto_id: proyectoId ? parseInt(proyectoId) : null,
      });
      setIsEditModalOpen(false);
      setEditingDoc(null);
      setEditSelectedFile(null);
      fetchDocuments();
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Error al actualizar el documento');
    }
  };

  const handleView = (doc: Document) => {
    if (!doc.archivo_url) {
      alert('Este documento no tiene archivo adjunto');
      return;
    }
    const url = doc.archivo_url.startsWith('http') ? doc.archivo_url : `http://localhost:8000${doc.archivo_url}`;
    window.open(url, '_blank');
  };

  const handleDownload = (doc: Document) => {
    if (!doc.archivo_url) {
      alert('Este documento no tiene archivo adjunto');
      return;
    }
    const url = doc.archivo_url.startsWith('http') ? doc.archivo_url : `http://localhost:8000${doc.archivo_url}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.nombre;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (docId: number) => {
    if (!confirm('¿Estás seguro de eliminar este documento?')) return;
    try {
      await api.delete(`/documents/${docId}`);
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Error al eliminar el documento');
    }
  };

  const openEditModal = (doc: Document) => {
    setEditingDoc(doc);
    setEditSelectedFile(null);
    setIsEditModalOpen(true);
  };

  const estadoConfig: Record<string, { icon: React.ReactNode; className: string }> = {
    'Aprobado': { icon: <CheckCircle2 size={12} />, className: 'bg-green-100 text-green-700' },
    'Pendiente': { icon: <Clock size={12} />, className: 'bg-orange-100 text-orange-700' },
    'Rechazado': { icon: <XCircle size={12} />, className: 'bg-red-100 text-red-700' },
  };

  const filteredDocs = documents.filter(doc =>
    doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.tipo && doc.tipo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderFormFields = (isEdit: boolean) => {
    const doc = isEdit ? editingDoc : null;
    const file = isEdit ? editSelectedFile : selectedFile;
    const setFile = isEdit ? setEditSelectedFile : setSelectedFile;

    return (
      <>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Nombre del Documento</label>
          <input name="nombre" required defaultValue={doc?.nombre} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Descripción</label>
          <textarea name="descripcion" rows={2} defaultValue={doc?.descripcion} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Tipo</label>
            <select name="tipo" defaultValue={doc?.tipo || ''} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold">
              <option value="">Seleccionar...</option>
              <option>Contrato</option>
              <option>Permiso</option>
              <option>Presupuesto</option>
              <option>Manual</option>
              <option>Legal</option>
              <option>Administrativo</option>
              <option>Tecnico</option>
              <option>Financiero</option>
              <option>Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Estado</label>
            <select name="estado" defaultValue={doc?.estado || 'Pendiente'} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold">
              <option>Pendiente</option>
              <option>Aprobado</option>
              <option>Rechazado</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Proyecto</label>
            <select name="proyecto_id" defaultValue={doc?.proyecto_id || ''} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold">
              <option value="">Sin proyecto</option>
              {proyectos.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Versión</label>
            <input name="version" defaultValue={doc?.version || '1.0'} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            {isEdit ? 'Archivo (dejar vacío para mantener actual)' : 'Archivo'}
          </label>
          <label className="flex items-center justify-center gap-3 w-full px-4 py-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50/30 transition cursor-pointer">
            <Upload size={20} className="text-gray-400" />
            <span className="text-sm font-bold text-gray-500">
              {file ? file.name : (isEdit ? 'Cambiar archivo...' : 'Seleccionar archivo...')}
            </span>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
          {file && (
            <p className="mt-1 text-xs text-gray-500 font-medium">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentación General</h1>
          <p className="text-gray-500 mt-1">Centraliza y gestiona todos los documentos legales y administrativos.</p>
        </div>
        <button
          onClick={() => { setSelectedFile(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-xl hover:bg-blue-800 transition shadow-lg hover:shadow-blue-900/20 font-bold"
        >
          <Plus size={20} />
          Subir Documento
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-medium"
          />
        </div>
        <button className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition">
          <Filter size={18} />
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Documento</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Tipo</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Versión</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Subido por</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                  </td>
                </tr>
              ) : filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-50 text-blue-900 rounded-lg">
                        <FileText size={20} />
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block">{doc.nombre}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{new Date(doc.fecha_subida).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-700">{doc.tipo || 'N/A'}</td>
                  <td className="px-8 py-5">
                    {(() => {
                      const estado = estadoConfig[doc.estado] || estadoConfig['Pendiente'];
                      return (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${estado.className}`}>
                          {estado.icon}
                          {doc.estado}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-700">{doc.version || '1.0'}</td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-600">{doc.subido_por === 1 ? 'Admin' : 'Usuario'}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleView(doc)} className="p-2 text-gray-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all" title="Visualizar">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleDownload(doc)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Descargar">
                        <Download size={18} />
                      </button>
                      <button onClick={() => openEditModal(doc)} className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all" title="Editar">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(doc.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Eliminar">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-gray-400 font-bold uppercase tracking-widest">
                    No se encontraron documentos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 sticky top-0 z-10">
              <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Nuevo Documento</h3>
              <button onClick={() => { setIsModalOpen(false); setSelectedFile(null); }} className="p-2 hover:bg-gray-200 rounded-xl transition text-gray-500">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateDocument} className="p-8 space-y-6">
              {renderFormFields(false)}
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => { setIsModalOpen(false); setSelectedFile(null); }} className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition">
                  Cancelar
                </button>
                <button type="submit" className="bg-blue-900 text-white px-8 py-3 rounded-2xl hover:bg-blue-800 transition font-bold shadow-xl">
                  Subir Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {isEditModalOpen && editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 sticky top-0 z-10">
              <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Editar Documento</h3>
              <button onClick={() => { setIsEditModalOpen(false); setEditingDoc(null); setEditSelectedFile(null); }} className="p-2 hover:bg-gray-200 rounded-xl transition text-gray-500">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditDocument} className="p-8 space-y-6">
              {renderFormFields(true)}
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => { setIsEditModalOpen(false); setEditingDoc(null); setEditSelectedFile(null); }} className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition">
                  Cancelar
                </button>
                <button type="submit" className="bg-blue-900 text-white px-8 py-3 rounded-2xl hover:bg-blue-800 transition font-bold shadow-xl">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
