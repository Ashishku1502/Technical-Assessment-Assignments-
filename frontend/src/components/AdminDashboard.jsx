import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Search, Filter, LogOut, RefreshCw, Check, User as UserIcon } from 'lucide-react';

const AdminDashboard = ({ setAuth }) => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [course, setCourse] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const courses = ['Computer Science', 'Data Science', 'AI & ML', 'Cybersecurity', 'Web Development'];

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/leads', {
                params: { search, course, status: statusFilter }
            });
            setLeads(res.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) handleLogout();
        } finally {
            setLoading(false);
        }
    }, [search, course, statusFilter, handleLogout]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchLeads();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchLeads]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuth(false);
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await api.patch(`/leads/${id}/status`, { status: newStatus });
            fetchLeads();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.25rem' }}>Lead Dashboard</h1>
                    <p style={{ color: 'var(--text-dim)' }}>Manage and track your student applications</p>
                </div>
                <button onClick={handleLogout} style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>
                    <LogOut size={16} /> Logout
                </button>
            </header>

            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div className="search-bar">
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                        <input
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select value={course} onChange={(e) => setCourse(e.target.value)}>
                        <option value="">All Courses</option>
                        {courses.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All Status</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                    </select>
                    <button onClick={fetchLeads} style={{ width: 'auto', background: 'transparent' }}>
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Course</th>
                                <th>College & Year</th>
                                <th>Status</th>
                                <th>Applied On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                                        No leads found mapping your search.
                                    </td>
                                </tr>
                            ) : (
                                leads.map(lead => (
                                    <tr key={lead.id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{lead.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{lead.email}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{lead.phone}</div>
                                        </td>
                                        <td>{lead.course}</td>
                                        <td>
                                            <div>{lead.college}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{lead.year}</div>
                                        </td>
                                        <td>
                                            <span className={`badge badge-${lead.status}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                                        <td>
                                            {lead.status === 'new' && (
                                                <button
                                                    onClick={() => updateStatus(lead.id, 'contacted')}
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)', width: 'auto' }}
                                                >
                                                    Mark Contacted
                                                </button>
                                            )}
                                            {lead.status === 'contacted' && <Check size={18} color="#4ade80" />}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
