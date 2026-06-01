import { useState, useEffect } from 'react';

import { storageUrl } from '../lib/storage';
const IMG = storageUrl;

export default function ProductCard({ product, whatsapp, onTrack, initialLiked = false, initialArchived = false }) {
  const [page, setPage] = useState(1);
  const [liked, setLiked] = useState(initialLiked);
  const [archived, setArchived] = useState(initialArchived);

  useEffect(() => { setLiked(initialLiked); }, [initialLiked]);
  useEffect(() => { setArchived(initialArchived); }, [initialArchived]);

  const handleLike = () => { setLiked(l => !l); onTrack('like'); };
  const handleArchive = () => { setArchived(a => !a); onTrack('archive'); };
  const handleWhatsApp = () => {
    onTrack('whatsapp');
    const text = encodeURIComponent(`Hola! Me interesa: *${product.name}*${product.price ? ` (S/ ${product.price})` : ''}. ¿Tienes disponibilidad?`);
    window.open(`https://wa.me/${whatsapp?.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {product.images?.[0] && (
        <div className="relative">
          <img src={IMG(product.images[0])} alt={product.name} className="w-full h-60 object-cover" />
          <div className="absolute top-3 right-3 flex gap-2">
            <button onClick={handleLike}
              className={`w-9 h-9 rounded-full shadow-md flex items-center justify-center transition ${liked ? 'bg-red-500 text-white' : 'bg-white text-gray-400'}`}>
              ♥
            </button>
            <button onClick={handleArchive}
              className={`w-9 h-9 rounded-full shadow-md flex items-center justify-center transition ${archived ? 'bg-yellow-400 text-white' : 'bg-white text-gray-400'}`}>
              🔖
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {['Información', 'Beneficios y prep.'].map((label, i) => (
          <button key={i} onClick={() => setPage(i + 1)}
            className={`flex-1 py-3 text-sm font-medium transition ${
              page === i + 1 ? 'text-teal-600 border-b-2 border-teal-500 bg-teal-50/50' : 'text-gray-400 hover:text-gray-600'
            }`}>
            {label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {page === 1 && (
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="text-lg font-bold text-gray-800 leading-tight">{product.name}</h2>
              {product.price && <span className="bg-teal-50 text-teal-700 font-bold text-base px-3 py-1 rounded-lg whitespace-nowrap">S/ {product.price}</span>}
            </div>
            {product.description && <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>}
            {!product.images?.[0] && (
              <div className="flex gap-2 mt-3">
                <button onClick={handleLike} className={`p-2 rounded-lg border text-sm transition ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400'}`}>
                  {liked ? '❤️ Guardado' : '🤍 Me gusta'}
                </button>
                <button onClick={handleArchive} className={`p-2 rounded-lg border text-sm transition ${archived ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'border-gray-200 text-gray-400'}`}>
                  {archived ? '🔖 Archivado' : '📌 Archivar'}
                </button>
              </div>
            )}
          </div>
        )}

        {page === 2 && (
          <div className="space-y-5">
            {product.benefits?.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-1">✨ Beneficios</h3>
                <ul className="space-y-1.5">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-teal-500 mt-0.5 flex-shrink-0">•</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.preparation?.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">📋 Preparación</h3>
                <ol className="space-y-1.5">
                  {product.preparation.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="bg-teal-100 text-teal-700 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span> {p}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {!product.benefits?.length && !product.preparation?.length && (
              <p className="text-gray-400 text-sm text-center py-4">Sin información adicional.</p>
            )}
          </div>
        )}
      </div>

      <div className="px-5 pb-5">
        <button onClick={handleWhatsApp}
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:scale-95 text-white font-semibold py-3 rounded-xl transition text-sm shadow-sm">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Solicitar por WhatsApp
        </button>
      </div>
    </div>
  );
}
