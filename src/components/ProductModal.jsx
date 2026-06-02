import { useState } from 'react';
import api from '../lib/axios';

function SmartListField({ label, hint, placeholder, items, onChange, itemPlaceholder }) {
  const parse = (text) => text.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);

  const handlePaste = (e, i) => {
    const text = e.clipboardData.getData('text');
    if (/[,;\n]/.test(text)) {
      e.preventDefault();
      const parts = parse(text);
      const newItems = [...items];
      newItems.splice(i, 1, ...parts);
      onChange(newItems.length ? newItems : ['']);
    }
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <p className="text-xs text-gray-400 mb-2">{hint}</p>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input value={item}
            onChange={e => { const a = [...items]; a[i] = e.target.value; onChange(a); }}
            onPaste={e => handlePaste(e, i)}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); onChange([...items.slice(0, i+1), '', ...items.slice(i+1)]); }
              if (e.key === 'Backspace' && !item && items.length > 1) { e.preventDefault(); onChange(items.filter((_, idx) => idx !== i)); }
            }}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder={`${itemPlaceholder} ${i + 1}`} />
          {items.length > 1 && <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">✕</button>}
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ''])} className="text-sm text-teal-600 hover:underline">+ Agregar {itemPlaceholder.toLowerCase()}</button>
    </div>
  );
}

// Iconos sugeridos de Lucide para ingredientes
const ICON_OPTIONS = [
  { value: 'leaf', label: 'Hoja / Natural' },
  { value: 'apple', label: 'Manzana' },
  { value: 'droplets', label: 'Agua / Fibra' },
  { value: 'heart', label: 'Salud' },
  { value: 'zap', label: 'Energía' },
  { value: 'shield', label: 'Protección' },
  { value: 'sun', label: 'Vitamina' },
  { value: 'flower-2', label: 'Flor / Planta' },
  { value: 'sprout', label: 'Brote / Probiótico' },
  { value: 'cherry', label: 'Fruta' },
  { value: 'flame', label: 'Metabolismo' },
  { value: 'beaker', label: 'Componente' },
];

function AddImageUrl({ onAdd }) {
  const [url, setUrl] = useState('');
  const [show, setShow] = useState(false);
  const handle = () => {
    if (url.trim()) { onAdd(url.trim()); setUrl(''); setShow(false); }
  };
  if (!show) return (
    <button type="button" onClick={() => setShow(true)} className="mt-2 text-xs text-teal-600 hover:underline">
      + Agregar por URL
    </button>
  );
  return (
    <div className="mt-2 flex gap-2">
      <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && handle()}
        className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        placeholder="https://ejemplo.com/foto.jpg" autoFocus />
      <button type="button" onClick={handle} className="bg-teal-600 text-white px-3 rounded-lg text-sm">Agregar</button>
      <button type="button" onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600 px-1">✕</button>
    </div>
  );
}

const emptyForm = {
  name: '', brand: '', description: '', price: '', promotional_price: '',
  benefits: [''], preparation: [''],
  images: [], ingredients: [], background_image: '', active: true,
};

export default function ProductModal({ product, onClose, onSaved }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(product ? {
    ...product,
    benefits: product.benefits?.length ? product.benefits : [''],
    preparation: product.preparation?.length ? product.preparation : [''],
    brand: product.brand ?? '',
    promotional_price: product.promotional_price ?? '',
    ingredients: product.ingredients ?? [],
    background_image: product.background_image ?? '',
    price: product.price ?? '',
  } : emptyForm);
  const [uploading, setUploading] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const setListItem = (key, i, val) => {
    const arr = [...form[key]];
    arr[i] = val;
    set(key, arr);
  };
  const addListItem = (key) => set(key, [...form[key], '']);
  const removeListItem = (key, i) => set(key, form[key].filter((_, idx) => idx !== i));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    const res = await api.post('/products/upload-image', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const url = res.data.url.startsWith('http') ? res.data.url : `${import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000'}${res.data.url}`;
    set('images', [...form.images, url]);
    setUploading(false);
  };

  const removeImage = (i) => set('images', form.images.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        benefits: form.benefits.filter(b => b.trim()),
        preparation: form.preparation.filter(p => p.trim()),
        price: form.price === '' ? null : form.price,
        promotional_price: form.promotional_price === '' ? null : form.promotional_price,
      };
      if (product) {
        await api.put(`/products/${product.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">{product ? 'Editar producto' : 'Nuevo producto'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {/* Steps */}
        <div className="flex px-6 pt-4 gap-2">
          {['Info general', 'Beneficios y preparación'].map((label, i) => (
            <button
              key={i}
              onClick={() => setStep(i + 1)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                step === i + 1 ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700">Marca</label>
                <input value={form.brand} onChange={e => set('brand', e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Ej: FWP, Natura, Herbalife..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nombre *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Ej: LIV - Ligereza que fluye" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  rows={3} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Descripción del producto..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Precio (S/)</label>
                  <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Precio promocional (S/)</label>
                  <input type="number" value={form.promotional_price} onChange={e => set('promotional_price', e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Opcional" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Fotos del producto</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20">
                      <img src={img.startsWith('http') ? img : `${import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000'}${img}`} className="w-full h-full object-cover rounded-lg" />
                      <button onClick={() => removeImage(i)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">✕</button>
                    </div>
                  ))}
                  <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 transition gap-0.5">
                    {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600" /> : <>
                      <span className="text-xl text-gray-300">↑</span>
                      <span className="text-[9px] text-gray-400">Subir</span>
                    </>}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                {/* Agregar por URL */}
                <AddImageUrl onAdd={url => set('images', [...form.images, url])} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Imagen de fondo del catálogo</label>
                <p className="text-xs text-gray-400 mb-1">URL de imagen lifestyle (opcional). Si no pones, usará gradiente teal.</p>
                <div className="flex gap-2">
                  <input value={form.background_image} onChange={e => set('background_image', e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="https://... o sube una foto" />
                  <label className="cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition whitespace-nowrap">
                    {uploadingBg ? '...' : 'Subir'}
                    <input type="file" accept="image/*" className="hidden" onChange={async e => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setUploadingBg(true);
                      const fd = new FormData();
                      fd.append('image', file);
                      const res = await api.post('/products/upload-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                      const bgUrl = res.data.url.startsWith('http') ? res.data.url : `${import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000'}${res.data.url}`;
                      set('background_image', bgUrl);
                      setUploadingBg(false);
                    }} />
                  </label>
                </div>
                {form.background_image && (
                  <img src={form.background_image} className="mt-2 h-16 w-full object-cover rounded-lg" />
                )}
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Activo</label>
                <button onClick={() => set('active', !form.active)}
                  className={`w-11 h-6 rounded-full transition ${form.active ? 'bg-teal-500' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${form.active ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <SmartListField
                label="Beneficios"
                hint='Escribe o pega. Separa por coma, punto y coma o nueva línea.'
                placeholder="Ej: Mejora digestión, Reduce hinchazón; Aumenta energía"
                items={form.benefits}
                onChange={v => set('benefits', v)}
                itemPlaceholder="Beneficio"
              />

              <SmartListField
                label="Modo de preparación"
                hint='Cada paso separado por coma, punto y coma o nueva línea.'
                placeholder="Ej: Agregar 1 scoop, Mezclar con 200ml de agua; Tomar antes de comer"
                items={form.preparation}
                onChange={v => set('preparation', v)}
                itemPlaceholder="Paso"
              />

              {/* Ingredientes */}
              <div>
                <label className="text-sm font-medium text-gray-700">Ingredientes / Componentes</label>
                <p className="text-xs text-gray-400 mb-2">Al pegar nombres separados por coma se dividen automáticamente</p>
                {form.ingredients.map((ing, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <select
                      value={ing.icon || ''}
                      onChange={e => {
                        const arr = [...form.ingredients];
                        arr[i] = { ...arr[i], icon: e.target.value };
                        set('ingredients', arr);
                      }}
                      className="border border-gray-300 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 w-36"
                    >
                      <option value="">Sin icono</option>
                      {ICON_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <input
                      value={ing.name || ''}
                      onPaste={e => {
                        const text = e.clipboardData.getData('text');
                        if (/[,;\n]/.test(text)) {
                          e.preventDefault();
                          const parts = text.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
                          const arr = [...form.ingredients];
                          arr.splice(i, 1, ...parts.map(name => ({ name, icon: 'leaf' })));
                          set('ingredients', arr);
                        }
                      }}
                      onChange={e => {
                        const arr = [...form.ingredients];
                        arr[i] = { ...arr[i], name: e.target.value };
                        set('ingredients', arr);
                      }}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder={`Ej: Probióticos`}
                    />
                    <button onClick={() => set('ingredients', form.ingredients.filter((_, idx) => idx !== i))}
                      className="text-red-400 hover:text-red-600">✕</button>
                  </div>
                ))}
                <button onClick={() => set('ingredients', [...form.ingredients, { name: '', icon: 'leaf' }])}
                  className="text-sm text-teal-600 hover:underline">+ Agregar ingrediente</button>
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          {step === 2 && (
            <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 rounded-lg py-2 text-sm hover:bg-gray-50 transition">
              ← Anterior
            </button>
          )}
          {step === 1 && (
            <button onClick={() => setStep(2)} disabled={!form.name}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg py-2 text-sm font-medium transition disabled:opacity-50">
              Siguiente →
            </button>
          )}
          {step === 2 && (
            <button onClick={handleSubmit} disabled={saving}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg py-2 text-sm font-medium transition disabled:opacity-50">
              {saving ? 'Guardando...' : product ? 'Actualizar' : 'Guardar producto'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
