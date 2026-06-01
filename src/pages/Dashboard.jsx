import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/analytics').then(res => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Hola, {user?.name} 👋</h2>
      <p className="text-gray-500 mt-1">Bienvenida a tu panel de catálogos FWP.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {[
          { label: 'Visitas totales', value: stats?.total_visits, icon: '👥', color: 'bg-teal-50 text-teal-700' },
          { label: 'Likes totales', value: stats?.total_likes, icon: '❤️', color: 'bg-pink-50 text-pink-700' },
          { label: 'Clicks WhatsApp', value: stats?.total_whatsapp, icon: '💬', color: 'bg-green-50 text-green-700' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stats ? (card.value ?? 0) : '—'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
