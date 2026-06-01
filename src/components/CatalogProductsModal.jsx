import { useState, useEffect } from 'react';
import api from '../lib/axios';

import { storageUrl } from '../lib/storage';
const IMG = storageUrl;

export default function CatalogProductsModal({ catalog, onClose }) {
  const [allProducts, setAllProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const [brandFilter, setBrandFilter] = useState('');

  useEffect(() => {
    api.get('/products').then(res => setAllProducts(res.data));
    api.get(`/catalogs/${catalog.id}`).then(res => {
      setSelected((res.data.products || []).map(p => p.id));
    }).catch(() => {});
  }, []);

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const handleSave = async () => {
    setSaving(true);
    await api.post(`/catalogs/${catalog.id}/products`, { product_ids: selected });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-800">Productos del catálogo</h2>
            <p className="text-xs text-gray-400">{catalog.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {/* Filtro por marca */}
          {[...new Set(allProducts.map(p => p.brand).filter(Boolean))].length > 0 && (
            <div className="flex gap-2 flex-wrap pb-2">
              <button onClick={() => setBrandFilter('')}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition ${!brandFilter ? 'bg-teal-600 text-white border-teal-600' : 'border-gray-200 text-gray-500'}`}>
                Todas
              </button>
              {[...new Set(allProducts.map(p => p.brand).filter(Boolean))].map(b => (
                <button key={b} onClick={() => setBrandFilter(b)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition ${brandFilter === b ? 'bg-teal-600 text-white border-teal-600' : 'border-gray-200 text-gray-500'}`}>
                  {b}
                </button>
              ))}
            </div>
          )}
          {allProducts.length === 0 && (
            <p className="text-center text-gray-400 py-10">No tienes productos. Crea uno primero.</p>
          )}
          {allProducts.filter(p => !brandFilter || p.brand === brandFilter).map(p => (
            <div key={p.id}
              onClick={() => toggle(p.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                selected.includes(p.id) ? 'border-teal-400 bg-teal-50' : 'border-gray-100 hover:bg-gray-50'
              }`}>
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                {p.images?.[0]
                  ? <img src={IMG(p.images[0])} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                }
              </div>
              <div className="flex-1 min-w-0">
                {p.brand && <p className="text-[10px] text-teal-500 font-semibold">{p.brand}</p>}
                <p className="font-medium text-sm text-gray-800 truncate">{p.name}</p>
                {p.price && <p className="text-xs text-teal-600">S/ {p.price}</p>}
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selected.includes(p.id) ? 'border-teal-500 bg-teal-500' : 'border-gray-300'
              }`}>
                {selected.includes(p.id) && <span className="text-white text-xs">✓</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose}
            className="flex-1 border border-gray-200 rounded-lg py-2 text-sm hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg py-2 text-sm font-medium transition disabled:opacity-50">
            {saving ? 'Guardando...' : `Guardar (${selected.length} productos)`}
          </button>
        </div>
      </div>
    </div>
  );
}
