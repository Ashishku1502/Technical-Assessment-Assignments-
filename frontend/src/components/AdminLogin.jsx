import { useState } from 'react';
import api from '../services/api';
import { Lock, User } from 'lucide-react';

const AdminLogin = ({ setAuth }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            setAuth(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="glass-card" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Access</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label><User size={14} style={{ marginRight: '6px' }} /> Username</label>
                        <input
                            required
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label><Lock size={14} style={{ marginRight: '6px' }} /> Password</label>
                        <input
                            required
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>
                {error && <p style={{ color: 'var(--error)', marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{error}</p>}
            </div>
        </div>
    );
};

export default AdminLogin;
