import React, { useEffect, useState } from 'react';

type Source = {
  _id?: string;
  name?: string;
  url: string;
  selector?: string;
  enabled?: boolean;
};

export default function AdminCrawlers() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [form, setForm] = useState<Source>({ url: '', selector: '', enabled: true });

  const api = (path: string, opts: RequestInit = {}) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(`/api/admin${path}`, { headers, ...opts });
  };

  async function load() {
    setLoading(true);
    try {
      const res = await api('/sources');
      if (res.ok) {
        const data = await res.json();
        setSources(data);
      } else {
        console.error('Failed to load', await res.text());
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createSource(e: React.FormEvent) {
    e.preventDefault();
    const res = await api('/sources', { method: 'POST', body: JSON.stringify(form) });
    if (res.ok) {
      setForm({ url: '', selector: '', enabled: true });
      load();
    } else {
      alert('Create failed: ' + (await res.text()));
    }
  }

  async function remove(id?: string) {
    if (!id) return;
    if (!confirm('Delete this source?')) return;
    const res = await api(`/sources/${id}`, { method: 'DELETE' });
    if (res.ok) load(); else alert('Delete failed');
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Crawler Sources</h2>
        <p className="text-sm text-muted-foreground">Manage scraping sources and selectors.</p>
      </div>

      <div className="p-4 border rounded">
        <label className="block mb-2">Admin Bearer Token (optional)</label>
        <input className="w-full p-2 border" value={token} onChange={(e) => setToken(e.target.value)} />
      </div>

      <form onSubmit={createSource} className="grid gap-2 sm:grid-cols-3 items-end">
        <div>
          <label className="block text-sm">Name</label>
          <input className="w-full p-2 border" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm">URL</label>
          <input required className="w-full p-2 border" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm">Selector (optional)</label>
          <input className="w-full p-2 border" value={form.selector} onChange={(e) => setForm({ ...form, selector: e.target.value })} />
        </div>
        <div className="sm:col-span-3">
          <button className="px-4 py-2 bg-primary text-white rounded">Create Source</button>
        </div>
      </form>

      <div className="mt-4">
        <h3 className="text-lg font-medium">Existing Sources</h3>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <ul className="space-y-2 mt-2">
            {sources.map((s) => (
              <li key={s._id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">{s.name || s.url}</div>
                  <div className="text-sm text-muted-foreground">{s.url}</div>
                  {s.selector && <div className="text-xs text-muted-foreground">Selector: {s.selector}</div>}
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border rounded" onClick={() => remove(s._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
