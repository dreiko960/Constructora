import React, { useState, useEffect } from 'react';
import * as Router from 'react-router-dom';
const { useNavigate } = Router;
import { Plus, Search, UserPlus, Mail, Phone, Shield, MoreVertical, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../lib/api';

interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  rol_id: number;
  estado: string;
  fecha_creacion: string;
}

interface Role {
  id: number;
  nombre: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          api.get('/users'),
          api.get('/roles')
        ]);
        setUsers(usersRes.data);
        setRoles(rolesRes.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsersData();
  }, []);

  const getRoleName = (rolId: number) => {
    return roles.find(r => r.id === rolId)?.nombre || 'Usuario';
  };

  const filteredUsers = users.filter(user => 
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Usuarios</h1>
          <p className="text-slate-500 mt-1">Administra los accesos y roles de tu equipo de trabajo.</p>
        </div>
        <button 
          onClick={() => navigate('/usuarios/nuevo')}
          className="flex items-center justify-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition shadow-lg hover:shadow-amber-600/20 font-bold"
        >
          <UserPlus size={20} />
          Nuevo Usuario
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition text-sm font-medium"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Usuario</th>
                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Contacto</th>
                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Rol</th>
                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Estado</th>
                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-semibold text-slate-700 border-2 border-white shadow-sm">
                        {user.nombre.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{user.nombre}</span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tighter">ID: #{user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <Phone size={14} className="text-gray-400" />
                        {user.telefono || 'Sin teléfono'}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-slate-700" />
                      <span className="text-sm font-bold text-slate-700">{getRoleName(user.rol_id)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest inline-flex items-center gap-1.5 ${
                      user.estado === 'Activo' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {user.estado === 'Activo' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {user.estado}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/usuarios/editar/${user.id}`)}
                        className="p-2 text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-gray-400 font-bold uppercase tracking-widest">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
