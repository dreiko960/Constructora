import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in duration-300">
        <div className="flex justify-center">
          <div className="bg-orange-100 p-6 rounded-full shadow-inner ring-8 ring-orange-50">
            <AlertCircle size={64} className="text-orange-600 drop-shadow-sm" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-8xl font-black text-blue-900 tracking-tighter">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Página no encontrada</h2>
          <p className="text-gray-500 max-w-xs mx-auto leading-relaxed">
            Lo sentimos, no pudimos encontrar la página que estás buscando. Puede que haya sido movida o eliminada.
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 bg-blue-900 text-white px-8 py-4 rounded-2xl hover:bg-blue-800 transition-all shadow-xl hover:shadow-blue-900/20 font-bold group"
        >
          <Home size={20} className="group-hover:-translate-y-0.5 transition-transform" />
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default NotFound;
