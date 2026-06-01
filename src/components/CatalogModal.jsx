import { useState } from 'react';
import api from '../lib/axios';

const empty = { name: '', description: '', logo_url: '', brand_name: '', starts_at: '', ends_at: '' };

export default function CatalogModal({ catalog, onClose, onSaved }) {
  const [form, setForm] = useState(catalog ? {
    name: catalog.name,
    description: catalog.description ?? '',
    logo_url: catalog.logo_url ?? '',
    brand_name: catalog.brand_name ?? '',
    starts_at: catalog.starts_at ? catalog.starts_at.slice(0, 10) : '',
    ends_at: catalog.ends_at ? catalog.ends_at.slice(0, 10) : '',
  } : empty);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleUploadLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    const res = await api.post('/products/upload-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    set('logo_url', `${import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000'}${res.data.url}`);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = { ...form, starts_at: form.starts_at || null, ends_at: form.ends_at || null };
      if (catalog) await api.put(`/catalogs/${catalog.id}`, payload);
      else await api.post('/catalogs', payload);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar.');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">{catalog ? 'Editar catálogo' : 'Nuevo catálogo'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nombre *</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Ej: Catálogo Junio 2025" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Descripción</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={2} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Descripción opcional..." />
          </div>

          {/* Logo de marca */}
          <div>
            <label className="text-sm font-medium text-gray-700">Logo de la marca</label>
            <p className="text-xs text-gray-400 mb-2">Se muestra en el header del catálogo público</p>
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <input value={form.logo_url} onChange={e => set('logo_url', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="https://... (URL del logo)" />
              </div>
              <label className="cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition whitespace-nowrap flex-shrink-0">
                {uploading ? 'Subiendo...' : '📁 Subir'}
                <input type="file" accept="image/*" className="hidden" onChange={handleUploadLogo} />
              </label>
            </div>
            {form.logo_url && (
              <div className="mt-2 flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                <img src={form.logo_url} className="h-10 object-contain" alt="logo preview" />
                <button type="button" onClick={() => set('logo_url', '')} className="text-xs text-red-400 hover:text-red-600">Quitar</button>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Nombre de la marca</label>
            <input value={form.brand_name} onChange={e => set('brand_name', e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Ej: FWP, NutriVida, etc." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Válido desde</label>
              <input type="date" value={form.starts_at} onChange={e => set('starts_at', e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Válido hasta</label>
              <input type="date" value={form.ends_at} onChange={e => set('ends_at', e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 rounded-lg py-2 text-sm hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg py-2 text-sm font-medium transition disabled:opacity-50">
              {saving ? 'Guardando...' : catalog ? 'Actualizar' : 'Crear catálogo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
