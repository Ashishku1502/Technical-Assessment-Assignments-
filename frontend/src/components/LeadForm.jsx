import { useState } from 'react';
import api from '../services/api';
import { User, Mail, Phone, BookOpen, School, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const LeadForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: '',
        college: '',
        year: '',
    });

    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const courses = ['Computer Science', 'Data Science', 'AI & ML', 'Cybersecurity', 'Web Development'];
    const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await api.post('/leads', formData);
            setStatus({ type: 'success', message: res.data.message });
            setFormData({ name: '', email: '', phone: '', course: '', college: '', year: '' });
        } catch (err) {
            setStatus({
                type: 'error',
                message: err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Something went wrong'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="glass-card" style={{ maxWidth: '600px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Enroll Now
                    </h1>
                    <p style={{ color: '#94a3b8' }}>Kickstart your career with our specialized courses</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label><User size={14} style={{ marginRight: '6px' }} /> Full Name</label>
                        <input
                            required
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label><Mail size={14} style={{ marginRight: '6px' }} /> Email Address</label>
                            <input
                                required
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label><Phone size={14} style={{ marginRight: '6px' }} /> Phone Number</label>
                            <input
                                required
                                type="tel"
                                placeholder="+91 XXXXX XXXXX"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label><BookOpen size={14} style={{ marginRight: '6px' }} /> Select Course</label>
                        <select
                            required
                            value={formData.course}
                            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        >
                            <option value="">Choose a course</option>
                            {courses.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label><School size={14} style={{ marginRight: '6px' }} /> College Name</label>
                        <input
                            required
                            type="text"
                            placeholder="Your University"
                            value={formData.college}
                            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label><Calendar size={14} style={{ marginRight: '6px' }} /> Academic Year</label>
                        <select
                            required
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        >
                            <option value="">Select Year</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>

                {status.message && (
                    <div className={`toast toast-${status.type}`}>
                        {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span>{status.message}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadForm;
