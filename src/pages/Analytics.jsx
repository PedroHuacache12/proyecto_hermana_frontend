import { useState, useEffect } from 'react';
import api from '../lib/axios';

import { storageUrl } from '../lib/storage';
const IMG = storageUrl;

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [catalogs, setCatalogs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/analytics'), api.get('/analytics/catalogs')]).then(([s, c]) => {
      setSummary(s.data);
      setCatalogs(c.data);
      setLoading(false);
    });
  }, []);

  const loadCatalog = async (id) => {
    setSelected(id);
    setDetail(null);
    const res = await api.get(`/analytics/catalogs/${id}`);
    setDetail(res.data);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Estadísticas</h2>

      {/* Resumen global */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Visitas totales', value: summary?.total_visits, icon: '👥' },
          { label: 'Likes totales', value: summary?.total_likes, icon: '❤️' },
          { label: 'Clicks WhatsApp', value: summary?.total_whatsapp, icon: '💬' },
          { label: 'Catálogos', value: summary?.total_catalogs, icon: '📋' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-2xl">{c.icon}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{c.value ?? 0}</p>
            <p className="text-xs text-gray-400">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lista de catálogos */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Catálogos</h3>
          <div className="space-y-2">
            {catalogs.map(c => (
              <button key={c.id} onClick={() => loadCatalog(c.id)}
                className={`w-full text-left p-3 rounded-lg border transition text-sm ${
                  selected === c.id ? 'border-teal-400 bg-teal-50' : 'border-gray-100 hover:bg-gray-50'
                }`}>
                <p className="font-medium text-gray-800 truncate">{c.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">👥 {c.visitor_sessions_count} visitas · {c.published ? '🟢 Activo' : '⚪ Borrador'}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Detalle del catálogo */}
        <div className="md:col-span-2 space-y-4">
          {!detail && !selected && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center text-gray-400">
              Selecciona un catálogo para ver su detalle
            </div>
          )}
          {selected && !detail && (
            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" /></div>
          )}

          {detail && (
            <>
              {/* Stats por producto */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <h3 className="font-semibold text-gray-700 mb-3">Por producto</h3>
                {detail.product_stats.length === 0 ? (
                  <p className="text-sm text-gray-400">Sin interacciones aún.</p>
                ) : (
                  <div className="space-y-3">
                    {detail.product_stats.map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {s.product?.images?.[0]
                            ? <img src={IMG(s.product.images[0])} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">📦</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          {s.product?.brand && <p className="text-[10px] text-teal-500 font-semibold">{s.product.brand}</p>}
                          <p className="text-sm font-medium text-gray-800 truncate">{s.product?.name}</p>
                          <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
                            <span>❤️ {s.likes}</span>
                            <span>💬 {s.whatsapp}</span>
                            <span>📌 {s.archives}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats por marca */}
              {(() => {
                const byBrand = detail.product_stats.reduce((acc, s) => {
                  const brand = s.product?.brand || 'Sin marca';
                  if (!acc[brand]) acc[brand] = { likes: 0, whatsapp: 0, archives: 0 };
                  acc[brand].likes += s.likes;
                  acc[brand].whatsapp += s.whatsapp;
                  acc[brand].archives += s.archives;
                  return acc;
                }, {});
                const brands = Object.entries(byBrand);
                if (!brands.length) return null;
                return (
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <h3 className="font-semibold text-gray-700 mb-3">Por marca</h3>
                    <div className="space-y-2">
                      {brands.map(([brand, stats]) => (
                        <div key={brand} className="flex items-center justify-between text-sm">
                          <span className="font-medium text-teal-700">{brand}</span>
                          <div className="flex gap-4 text-xs text-gray-400">
                            <span>❤️ {stats.likes}</span>
                            <span>💬 {stats.whatsapp}</span>
                            <span>📌 {stats.archives}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Visitantes */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <h3 className="font-semibold text-gray-700 mb-3">Visitantes ({detail.total_visits})</h3>
                {detail.visitors.length === 0 ? (
                  <p className="text-sm text-gray-400">Sin visitantes aún.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                          <th className="pb-2">Nombre</th>
                          <th className="pb-2">Celular</th>
                          <th className="pb-2">Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.visitors.map(v => (
                          <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-2 font-medium text-gray-700">{v.name}</td>
                            <td className="py-2">
                              <a href={`https://wa.me/51${v.phone}`} target="_blank" rel="noreferrer"
                                className="text-green-600 hover:underline">{v.phone}</a>
                            </td>
                            <td className="py-2 text-gray-400">{new Date(v.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
