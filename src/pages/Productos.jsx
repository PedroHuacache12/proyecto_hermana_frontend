import { useState, useEffect } from 'react';
import api from '../lib/axios';
import ProductModal from '../components/ProductModal';
import usePageTitle from '../hooks/usePageTitle';

export default function Productos() {
  usePageTitle('Productos');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [brandFilter, setBrandFilter] = useState('');

  const fetchProducts = async () => {
    const res = await api.get('/products');
    setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSaved = () => { setModalOpen(false); setEditing(null); fetchProducts(); };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  const filtered = brandFilter ? products.filter(p => p.brand === brandFilter) : products;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Productos</h2>
        <button onClick={() => { setEditing(null); setModalOpen(true); }}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          + Nuevo producto
        </button>
      </div>

      {brands.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          <button onClick={() => setBrandFilter('')}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition ${!brandFilter ? 'bg-teal-600 text-white border-teal-600' : 'border-gray-200 text-gray-500 hover:border-teal-400'}`}>
            Todas
          </button>
          {brands.map(b => (
            <button key={b} onClick={() => setBrandFilter(b)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition ${brandFilter === b ? 'bg-teal-600 text-white border-teal-600' : 'border-gray-200 text-gray-500 hover:border-teal-400'}`}>
              {b}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-3">📦</p>
          <p>No tienes productos aún. ¡Crea el primero!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="w-full h-44 bg-gray-50 flex items-center justify-center overflow-hidden">
                {p.images?.[0]
                  ? <img src={p.images[0].startsWith('http') ? p.images[0] : `${import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000'}${p.images[0]}`} alt={p.name} className="h-full w-full object-contain p-2" />
                  : <span className="text-5xl text-gray-200">📦</span>
                }
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {p.brand && <span className="text-xs text-teal-600 font-medium">{p.brand}</span>}
                    <h3 className="font-semibold text-gray-800">{p.name}</h3>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                {p.price && <p className="text-teal-600 font-bold mt-1">S/ {p.price}</p>}
                {p.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.description}</p>}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => { setEditing(p); setModalOpen(true); }}
                    className="flex-1 text-sm border border-gray-200 rounded-lg py-1.5 hover:bg-gray-50 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex-1 text-sm border border-red-100 text-red-500 rounded-lg py-1.5 hover:bg-red-50 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <ProductModal
          product={editing}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
