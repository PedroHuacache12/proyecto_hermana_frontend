import { useState, useEffect } from 'react';
import api from '../lib/axios';
import usePageTitle from '../hooks/usePageTitle';

const emptyForm = { name: '', email: '', password: '', whatsapp_number: '', role: 'user' };

function UserModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState(user ? {
    name: user.name, whatsapp_number: user.whatsapp_number ?? '', role: user.role, password: ''
  } : emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      if (user) await api.put(`/users/${user.id}`, payload);
      else await api.post('/users', payload);
      onSaved();
    } catch (err) { setError(err.response?.data?.message || 'Error.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">{user ? 'Editar usuario' : 'Nuevo usuario'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nombre</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          {!user && (
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-700">{user ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'}</label>
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
              required={!user} minLength={8}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder={user ? '••••••••' : 'Mínimo 8 caracteres'} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">WhatsApp</label>
            <input value={form.whatsapp_number} onChange={e => set('whatsapp_number', e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="51987654321" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Rol</label>
            <select value={form.role} onChange={e => set('role', e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="user">Usuario</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 rounded-lg py-2 text-sm hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 bg-teal-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50">
              {saving ? 'Guardando...' : user ? 'Actualizar' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Usuarios() {
  usePageTitle('Usuarios');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetch = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    await api.delete(`/users/${id}`);
    fetch();
  };

  const handleSaved = () => { setModal(false); setEditing(null); fetch(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Usuarios</h2>
        <button onClick={() => { setEditing(null); setModal(true); }}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          + Nuevo usuario
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3 text-gray-500">{u.whatsapp_number || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role === 'superadmin' ? '⭐ Superadmin' : 'Usuario'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => { setEditing(u); setModal(true); }}
                      className="text-xs border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50">Editar</button>
                    <button onClick={() => handleDelete(u.id)}
                      className="text-xs border border-red-100 text-red-500 rounded-lg px-3 py-1 hover:bg-red-50">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && <UserModal user={editing} onClose={() => { setModal(false); setEditing(null); }} onSaved={handleSaved} />}
    </div>
  );
}
