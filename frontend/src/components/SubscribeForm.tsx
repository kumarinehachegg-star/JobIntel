import React, { useState } from 'react';

const SubscribeForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // call backend subscription endpoint (not implemented) - simulate
      await new Promise((r) => setTimeout(r, 600));
      setMsg('Subscribed — check your email for confirmation (simulated)');
      setEmail('');
    } catch (err) {
      setMsg('Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <label className="text-sm font-medium">Email</label>
      <div className="flex gap-2">
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="input" required />
        <button disabled={loading} className="btn btn-primary">{loading ? 'Subscribing...' : 'Subscribe'}</button>
      </div>
      {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
    </form>
  );
};

export default SubscribeForm;
