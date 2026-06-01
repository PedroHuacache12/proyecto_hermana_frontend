import { useState, useEffect } from 'react';
import api from '../lib/axios';
import CatalogModal from '../components/CatalogModal';
import CatalogProductsModal from '../components/CatalogProductsModal';

function CopyLink({ url }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="mt-2 flex items-center gap-2">
      <a href={url} target="_blank" rel="noreferrer"
        className="text-xs text-teal-600 hover:text-teal-800 font-mono truncate max-w-[220px] hover:underline">
        {url.replace(window.location.origin, '')}
      </a>
      <button onClick={handle}
        className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full border transition font-medium ${
          copied ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-gray-200 text-gray-500 hover:border-teal-300 hover:text-teal-600'
        }`}>
        {copied ? '✓ Copiado' : 'Copiar'}
      </button>
    </div>
  );
}


export default function Catalogos() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [productsModal, setProductsModal] = useState(null);

  const fetch = async () => {
    const res = await api.get('/catalogs');
    setCatalogs(res.data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleSaved = () => { setModalOpen(false); setEditing(null); fetch(); };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este catálogo?')) return;
    await api.delete(`/catalogs/${id}`);
    fetch();
  };

  const handlePublish = async (id) => {
    await api.post(`/catalogs/${id}/publish`);
    fetch();
  };

  const getStatus = (c) => {
    if (!c.published) return { label: 'Borrador', color: 'bg-gray-100 text-gray-500' };
    const now = new Date();
    if (c.ends_at && new Date(c.ends_at) < now) return { label: 'Vencido', color: 'bg-red-100 text-red-600' };
    if (c.starts_at && new Date(c.starts_at) > now) return { label: 'Programado', color: 'bg-blue-100 text-blue-600' };
    return { label: 'Activo', color: 'bg-green-100 text-green-700' };
  };

  const publicUrl = (slug) => `${window.location.origin}/c/${slug}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Catálogos</h2>
        <button onClick={() => { setEditing(null); setModalOpen(true); }}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          + Nuevo catálogo
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600" />
        </div>
      ) : catalogs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-3">📋</p>
          <p>No tienes catálogos aún. ¡Crea el primero!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {catalogs.map(c => {
            const status = getStatus(c);
            return (
              <div key={c.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-800">{c.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
                    </div>
                    {c.description && <p className="text-sm text-gray-500 mt-1">{c.description}</p>}
                    <div className="flex gap-4 mt-2 text-xs text-gray-400 flex-wrap">
                      {c.starts_at && <span>Desde: {new Date(c.starts_at).toLocaleDateString()}</span>}
                      {c.ends_at && <span>Hasta: {new Date(c.ends_at).toLocaleDateString()}</span>}
                      <span>👥 {c.visitor_sessions_count} visitas</span>
                    </div>
                    {c.published && (
                      <CopyLink url={publicUrl(c.slug)} />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setProductsModal(c)}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition">
                      📦 Productos
                    </button>
                    <button onClick={() => { setEditing(c); setModalOpen(true); }}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition">
                      Editar
                    </button>
                    <button onClick={() => handlePublish(c.id)}
                      className={`text-sm rounded-lg px-3 py-1.5 transition font-medium ${
                        c.published ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-teal-600 text-white hover:bg-teal-700'
                      }`}>
                      {c.published ? 'Despublicar' : 'Publicar'}
                    </button>
                    <button onClick={() => handleDelete(c.id)}
                      className="text-sm border border-red-100 text-red-500 rounded-lg px-3 py-1.5 hover:bg-red-50 transition">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <CatalogModal catalog={editing} onClose={() => { setModalOpen(false); setEditing(null); }} onSaved={handleSaved} />
      )}
      {productsModal && (
        <CatalogProductsModal catalog={productsModal} onClose={() => { setProductsModal(null); fetch(); }} />
      )}
    </div>
  );
}
