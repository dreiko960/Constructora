import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, X, HardHat, MapPin, Users, Calendar, DollarSign, Info, AlertCircle } from 'lucide-react';
import api from '../../lib/api';

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    ubicacion: '',
    cliente: '',
    fecha_inicio: '',
    fecha_fin: '',
    presupuesto: 0,
    tipo: 'Residencial',
    responsable_id: 0,
  });

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, responsable_id: response.data[0].id }));
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'presupuesto' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (formData.responsable_id === 0) {
        setError('Por favor, selecciona un responsable para el proyecto.');
        setIsLoading(false);
        return;
      }
      const dataToSubmit = {
        ...formData,
        fecha_inicio: formData.fecha_inicio || null,
        fecha_fin: formData.fecha_fin || null,
      };
      await api.post('/proyectos', dataToSubmit);
      navigate('/proyectos');
    } catch (err: any) {
      console.error('Error creating project:', err);
      let msg = 'Error al crear el proyecto.';
      if (err.code === 'ERR_NETWORK') {
        msg = 'Error de red: No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo.';
      } else if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          msg = err.response.data.detail.map((e: any) => `${e.loc[e.loc.length-1]}: ${e.msg}`).join(', ');
        } else {
          msg = err.response.data.detail;
        }
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/proyectos')}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-900 font-bold transition-colors group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          Volver a Proyectos
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Crear Nuevo Proyecto</h1>
          <p className="text-gray-500 mt-1 font-medium">Ingresa los detalles técnicos y administrativos de la obra.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-500" size={20} />
                <p className="text-sm text-red-700 font-bold">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* General Information */}
            <div className="space-y-6">
              <h2 className="text-sm font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                <Info size={16} />
                Información General
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Nombre del Proyecto</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HardHat size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="nombre"
                      required
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej: Edificio Mirador"
                      className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Descripción</label>
                  <textarea
                    name="descripcion"
                    rows={4}
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Describe los alcances del proyecto..."
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Tipo de Obra</label>
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-bold text-gray-700"
                    >
                      <option value="Residencial">Residencial</option>
                      <option value="Comercial">Comercial</option>
                      <option value="Industrial">Industrial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Responsable</label>
                    <select
                      name="responsable_id"
                      value={formData.responsable_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, responsable_id: parseInt(e.target.value) }))}
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-bold text-gray-700"
                    >
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Presupuesto (USD)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="presupuesto"
                        value={formData.presupuesto}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logistics Information */}
            <div className="space-y-6">
              <h2 className="text-sm font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={16} />
                Ubicación y Logística
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Ubicación</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="ubicacion"
                      value={formData.ubicacion}
                      onChange={handleChange}
                      placeholder="Ej: Av. Principal 123, Lima"
                      className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Cliente</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="cliente"
                      value={formData.cliente}
                      onChange={handleChange}
                      placeholder="Nombre de la empresa o cliente"
                      className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Fecha Inicio</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="fecha_inicio"
                        value={formData.fecha_inicio}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-bold text-gray-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Fecha Fin Est.</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="fecha_fin"
                        value={formData.fecha_fin}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-bold text-gray-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/proyectos')}
              className="px-6 py-3 rounded-2xl text-gray-500 font-bold hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-blue-900 text-white px-8 py-3 rounded-2xl hover:bg-blue-800 transition shadow-xl hover:shadow-blue-900/20 font-bold disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Save size={20} />
              )}
              Guardar Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
