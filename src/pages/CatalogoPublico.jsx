/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import publicApi from '../lib/publicApi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Leaf, Apple, Droplets, Heart, Zap, Shield, Sun, Flower2, Sprout, Cherry, Flame, FlaskConical } from 'lucide-react';

const LUCIDE_ICONS = {
  leaf: Leaf, apple: Apple, droplets: Droplets, heart: Heart,
  zap: Zap, shield: Shield, sun: Sun, 'flower-2': Flower2,
  sprout: Sprout, cherry: Cherry, flame: Flame, beaker: FlaskConical,
};

function IngredientIcon({ icon, name }) {
  const Icon = LUCIDE_ICONS[icon] || Leaf;
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
        <Icon className="w-7 h-7 text-teal-500" strokeWidth={1.5} />
      </div>
      <span className="text-xs text-gray-500 font-medium leading-tight max-w-[60px]">{name}</span>
    </div>
  );
}

import { storageUrl } from '../lib/storage';
const IMG = storageUrl;

const WA_SVG = (
  <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function ProductDots({ page }) {
  return (
    <div className="flex items-center justify-center gap-1.5" aria-label="Páginas">
      {[1, 2].map(p => (
        <span
          key={p}
          className={`h-1.5 rounded-full transition-all ${p === page ? 'w-5 bg-teal-600' : 'w-1.5 bg-teal-200'}`}
        />
      ))}
    </div>
  );
}

function IconButton({ children, onClick, disabled, activeClass, inactiveClass = 'border-slate-200 text-slate-500 bg-white' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex h-10 flex-1 items-center justify-center rounded-xl border text-base font-bold shadow-sm transition disabled:opacity-35 ${activeClass || inactiveClass}`}
    >
      {children}
    </button>
  );
}

function BottomBar({ liked, archived, onLike, onArchive, onWhatsApp, page }) {
  return (
    <div className="flex-shrink-0 border-t border-slate-200 bg-white px-3 pb-3 pt-2 shadow-[0_-10px_30px_rgba(15,23,42,0.06)]">
      <ProductDots page={page} />
      <button
        onClick={onWhatsApp}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-600"
      >
        {WA_SVG} Solicitar por WhatsApp
      </button>
      <div className="mt-2 flex items-center gap-2">
        <IconButton onClick={onLike} activeClass={liked ? 'border-red-200 bg-red-50 text-red-500' : undefined}>♥</IconButton>
        <IconButton onClick={onArchive} activeClass={archived ? 'border-amber-200 bg-amber-50 text-amber-500' : undefined}>★</IconButton>
      </div>
    </div>
  );
}

function Page2({ product }) {
  const hasBenefits = product.benefits?.length > 0;
  const hasPrep = product.preparation?.length > 0;
  const hasIngr = product.ingredients?.length > 0;

  return (
    <>
      {/* MÓVIL: columna única */}
      <div className="flex flex-col h-full bg-white overflow-y-auto md:hidden px-5 py-4 space-y-5">
        {hasBenefits && (
          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Beneficios</p>
            <h2 className="text-lg font-black text-slate-900 mb-3">{product.name}</h2>
            <ul className="space-y-1.5">
              {product.benefits.map((b, i) => (
                <li key={i} className="flex gap-3 text-sm leading-5 text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-600" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasPrep && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Preparación</p>
            <div className="space-y-2">
              {product.preparation.map((step, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-teal-100 bg-teal-50/70 px-3 py-2.5 text-sm leading-5 text-slate-700">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">{i + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {hasIngr && (
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 text-center">Componentes</p>
            <div className="flex flex-wrap justify-center gap-3">
              {product.ingredients.map((ing, i) => (
                <IngredientIcon key={i} icon={ing.icon} name={ing.name} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TABLET (md–xl): 2 columnas, scroll natural */}
      <div className="hidden md:flex xl:hidden flex-col bg-white overflow-y-auto">
        <div className="grid grid-cols-2 border-b border-slate-100">
          <div className="border-r border-slate-200 px-6 py-5">
            <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Beneficios</p>
            <h2 className="text-lg font-black text-slate-900 mb-3">{product.name}</h2>
            {hasBenefits ? (
              <ul className="space-y-1.5">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-5 text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-600" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-slate-400">Sin beneficios cargados.</p>}
          </div>
          <div className="px-6 py-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Preparación</p>
            {hasPrep ? (
              <div className="space-y-2">
                {product.preparation.map((step, i) => (
                  <div key={i} className="flex gap-3 rounded-xl border border-teal-100 bg-teal-50/70 px-3 py-2.5 text-sm leading-5 text-slate-700">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">{i + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-slate-400">Sin preparación cargada.</p>}
          </div>
        </div>
        {hasIngr && (
          <div className="px-8 py-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-center">Componentes</p>
            <div className="flex flex-wrap justify-center gap-4">
              {product.ingredients.map((ing, i) => (
                <IngredientIcon key={i} icon={ing.icon} name={ing.name} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP (xl+): 2 columnas, altura fija sin scroll exterior */}
      <div className="hidden xl:flex flex-col h-full bg-white overflow-hidden">
        <div className="grid flex-1 grid-cols-2 min-h-0">
          <div className="overflow-y-auto border-r border-slate-200 px-8 py-5 lg:px-10 lg:py-6">
            <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Beneficios</p>
            <h1 className="text-xl font-black leading-tight text-slate-900 lg:text-2xl">{product.name}</h1>
            {hasBenefits ? (
              <ul className="mt-3 space-y-2">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-5 text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-600" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="mt-3 text-sm text-slate-400">Sin beneficios cargados.</p>}
          </div>
          <div className="overflow-y-auto px-8 py-5 lg:px-10 lg:py-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Preparación</p>
            {hasPrep ? (
              <div className="space-y-2">
                {product.preparation.map((step, i) => (
                  <div key={i} className="flex gap-3 rounded-xl border border-teal-100 bg-teal-50/70 px-3 py-2.5 text-sm leading-5 text-slate-700">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">{i + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-slate-400">Sin preparación cargada.</p>}
          </div>
        </div>
        {hasIngr && (
          <div className="flex-shrink-0 px-10 py-5 border-t border-gray-100">
            <h3 className="font-bold text-gray-500 mb-4 text-xs uppercase tracking-widest text-center">Componentes</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {product.ingredients.map((ing, i) => (
                <IngredientIcon key={i} icon={ing.icon} name={ing.name} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function CatalogoPublico() {
  const { slug } = useParams();
  const [catalog, setCatalog] = useState(null);
  const [status, setStatus] = useState('loading');
  const [expired, setExpired] = useState('');
  const [sessionId, setSessionId] = useState(() => sessionStorage.getItem(`session_${slug}`));
  const [prevActions, setPrevActions] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [productIndex, setProductIndex] = useState(0);
  const [page, setPage] = useState(1);
  const touchStartX = useRef(null);

  const handleLogout = () => {
    sessionStorage.removeItem(`session_${slug}`);
    setSessionId(null);
    setPrevActions([]);
    setStatus('register');
  };

  useEffect(() => {
    publicApi.get(`/c/${slug}`)
      .then(async res => {
        setCatalog(res.data);
        document.title = `${res.data.name} — ${res.data.brand_name || 'Catálogo'}`;
        const sid = sessionStorage.getItem(`session_${slug}`);
        if (sid) {
          const r = await publicApi.get(`/c/${slug}/actions?session_id=${sid}`).catch(() => ({ data: [] }));
          setPrevActions(r.data);
        }
        setStatus(sid ? 'catalog' : 'register');
      })
      .catch(err => {
        setExpired(err.response?.data?.message || 'Catálogo no disponible.');
        setStatus('expired');
      });
  }, [slug]);

  useEffect(() => {
    const onKey = (e) => {
      if (status !== 'catalog') return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [status, productIndex, page, catalog]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setError('');
    try {
      const res = await publicApi.post(`/c/${slug}/register`, form);
      const sid = res.data.session_id;
      sessionStorage.setItem(`session_${slug}`, sid);
      setSessionId(sid);
      publicApi.post(`/c/${slug}/track`, { session_id: sid, action: 'view' }).catch(() => {});
      const r = await publicApi.get(`/c/${slug}/actions?session_id=${sid}`).catch(() => ({ data: [] }));
      setPrevActions(r.data);
      setStatus('catalog');
    } catch (err) {
      setError(err.response?.data?.message || 'Error.');
    } finally {
      setRegistering(false);
    }
  };

  const track = (action, productId = null) => {
    if (!sessionId) return;
    publicApi.post(`/c/${slug}/track`, { session_id: Number(sessionId), product_id: productId, action }).catch(() => {});
  };

  const toggleLike = (productId) => {
    track('like', productId);
    setPrevActions(prev => prev.some(a => a.product_id === productId && a.action === 'like')
      ? prev.filter(a => !(a.product_id === productId && a.action === 'like'))
      : [...prev, { product_id: productId, action: 'like' }]);
  };

  const toggleArchive = (productId) => {
    track('archive', productId);
    setPrevActions(prev => prev.some(a => a.product_id === productId && a.action === 'archive')
      ? prev.filter(a => !(a.product_id === productId && a.action === 'archive'))
      : [...prev, { product_id: productId, action: 'archive' }]);
  };

  const handleWhatsApp = (product) => {
    track('whatsapp', product.id);
    const text = encodeURIComponent(`Hola! Me interesa: *${product.name}*${product.price ? ` (S/ ${product.price})` : ''}. ¿Tienes disponibilidad?`);
    window.open(`https://wa.me/${catalog.owner?.whatsapp_number?.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  const goNext = () => {
    if (page === 1) {
      setPage(2);
      return;
    }
    if (productIndex < catalog.products.length - 1) {
      setProductIndex(i => i + 1);
      setPage(1);
    }
  };

  const goPrev = () => {
    if (page === 2) {
      setPage(1);
      return;
    }
    if (productIndex > 0) {
      setProductIndex(i => i - 1);
      setPage(1);
    }
  };

  if (status === 'loading') return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-teal-600" />
    </div>
  );

  if (status === 'expired') return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
        <p className="mb-4 text-5xl">!</p>
        <h1 className="text-xl font-bold text-slate-800">Catálogo no disponible</h1>
        <p className="mt-2 text-sm text-slate-500">{expired}</p>
      </div>
    </div>
  );

  if (status === 'register') return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="bg-teal-700 px-8 py-9 text-center text-white">
          {catalog.logo_url ? (
            <img src={IMG(catalog.logo_url)}
              className="mx-auto mb-4 h-14 object-contain" alt={catalog.brand_name || catalog.name} />
          ) : (
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/15">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z" />
              </svg>
            </div>
          )}
          <h1 className="text-2xl font-bold">{catalog.name}</h1>
          {catalog.description && <p className="mt-2 text-sm text-teal-50">{catalog.description}</p>}
        </div>
        <div className="px-8 py-6">
          <p className="mb-5 text-center text-sm text-slate-500">Ingresa tus datos para ver el catálogo</p>
          {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Nombre completo</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Tu nombre" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Número de celular</label>
              <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="987654321" />
            </div>
            <button type="submit" disabled={registering}
              className="w-full rounded-xl bg-teal-700 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60">
              {registering ? 'Ingresando...' : 'Ver catálogo'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const products = catalog.products;

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm w-full">
          <p className="text-5xl mb-4">📦</p>
          <h1 className="text-xl font-bold text-gray-700">{catalog.name}</h1>
          <p className="text-gray-400 mt-2 text-sm">Este catálogo aún no tiene productos disponibles.</p>
        </div>
      </div>
    );
  }

  const product = products[productIndex];
  const image = IMG(product.images?.[0]);
  const liked = prevActions.some(a => a.product_id === product.id && a.action === 'like');
  const archived = prevActions.some(a => a.product_id === product.id && a.action === 'archive');
  return (
    <div className="flex bg-slate-100 lg:p-4" style={{ fontFamily: 'Inter, system-ui, sans-serif', height: '100dvh' }}>
      <main className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden bg-white shadow-2xl lg:rounded-2xl">
        <header className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 px-5 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            {catalog.logo_url && (
              <img src={IMG(catalog.logo_url)}
                className="h-8 object-contain" alt={catalog.brand_name || catalog.name} />
            )}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                {catalog.brand_name || catalog.name}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{productIndex + 1}/{products.length} · Pág. {page}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
            Salir
          </button>
        </header>

        <div className="relative min-h-0 flex-1 flex flex-col">
          {/* Zonas de navegación desktop — dentro del contenido, invisibles */}
          <button
            onClick={goPrev}
            disabled={productIndex === 0 && page === 1}
            className="absolute left-0 inset-y-0 w-14 z-20 hidden xl:flex items-center justify-start pl-2 disabled:pointer-events-none group"
            aria-label="Anterior"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 text-2xl select-none">‹</span>
          </button>
          <button
            onClick={goNext}
            disabled={productIndex === catalog.products.length - 1 && page === 2}
            className="absolute right-0 inset-y-0 w-14 z-20 hidden xl:flex items-center justify-end pr-2 disabled:pointer-events-none group"
            aria-label="Siguiente"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 text-2xl select-none">›</span>
          </button>

        <section
          className="min-h-0 flex-1 overflow-y-auto"
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            if (touchStartX.current === null) return;
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
            touchStartX.current = null;
          }}
        >
          {page === 1 && (
            <div className="relative grid min-h-full items-center gap-5 px-5 pb-6 pt-5 md:grid-cols-[0.9fr_1.1fr] md:px-10 lg:gap-12 lg:px-16 xl:px-20"
              style={product.background_image ? {
                backgroundImage: `url(${IMG(product.background_image)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              } : { background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)' }}>
              {product.background_image && <div className="absolute inset-0 bg-white/75 backdrop-blur-sm" />}
              <div className="relative z-10 order-2 md:order-1 lg:max-w-xl">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Producto destacado</p>
                <h1 className="text-3xl font-black leading-tight text-slate-900 md:text-4xl xl:text-5xl">{product.name}</h1>
                {product.description && (
                  <p className="mt-4 text-[15px] leading-7 text-slate-600 lg:text-base lg:leading-8">{product.description}</p>
                )}
                {product.price && (
                  <div className="mt-5" style={{ textShadow: '0 1px 3px rgba(255,255,255,0.8)' }}>
                    {product.promotional_price && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg text-gray-400 line-through">S/ {product.price}</span>
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">PROMO</span>
                      </div>
                    )}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-teal-700">S/</span>
                    <span className="text-5xl font-black text-teal-700 leading-none">{product.promotional_price || product.price}</span>
                  </div>
                  </div>
                )}
              </div>

              <div className="relative z-10 order-1 flex min-h-[260px] items-center justify-center rounded-2xl bg-white/90 shadow-sm ring-1 ring-slate-100 md:order-2 md:min-h-[420px] lg:min-h-[560px] overflow-hidden">
                {product.images?.length > 1 ? (
                  <Swiper modules={[Pagination]} pagination={{ clickable: true }} className="w-full h-full">
                    {product.images.map((img, i) => (
                      <SwiperSlide key={i} className="flex items-center justify-center p-5 lg:p-8">
                        <img src={IMG(img)} alt={`${product.name} ${i + 1}`} className="max-h-[330px] w-full object-contain md:max-h-[480px] lg:max-h-[620px]" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : image ? (
                  <img src={image} alt={product.name} className="max-h-[330px] w-full object-contain p-5 md:max-h-[480px] lg:max-h-[620px] lg:p-8" />
                ) : (
                  <div className="flex h-44 w-44 items-center justify-center rounded-2xl bg-slate-100 text-5xl text-slate-300">+</div>
                )}
              </div>
            </div>
          )}

          {page === 2 && <Page2 key={product.id} product={product} />}
        </section>
        </div>

        <BottomBar
          liked={liked}
          archived={archived}
          onLike={() => toggleLike(product.id)}
          onArchive={() => toggleArchive(product.id)}
          onWhatsApp={() => handleWhatsApp(product)}
          page={page}
        />
        <div className="flex-shrink-0 bg-white border-t border-slate-100 py-1.5 flex items-center justify-center gap-2">
          <img src="/logo.png" className="h-3 object-contain opacity-30" alt="logo" />
          <p className="text-[10px] text-slate-300">Desarrollado por <span className="text-teal-400 font-medium">Pedro Huacache</span></p>
        </div>
      </main>
    </div>
  );
}
