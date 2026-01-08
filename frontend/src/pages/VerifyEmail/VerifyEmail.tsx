import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { API_ENDPOINTS } from '../../constants';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import Logo from '../../components/Layout/Logo';
import '../Auth/Auth.css'; // Reuse some background styles

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    const token = searchParams.get('token');

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Missing verification token.');
                return;
            }

            try {
                await axiosInstance.get(`${API_ENDPOINTS.LOGIN.replace('/login', '/verify-email')}?token=${token}`);
                setStatus('success');
            } catch (err: any) {
                setStatus('error');
                setMessage(err.response?.data || 'Verification failed. The link may be expired or invalid.');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            <div className="auth-card animate-fade-in glass text-center p-12">
                <div className="logo mb-8 justify-center">
                    <div className="logo-icon">
                        <Logo size={72} />
                    </div>
                    <div className="logo-text">
                        <h1 className="gradient-text">JobTracker</h1>
                        <span className="logo-subtitle">Pro</span>
                    </div>
                </div>

                {status === 'loading' && (
                    <div className="flex flex-col items-center py-8">
                        <Loader2 className="animate-spin text-primary-500 mb-4" size={48} />
                        <h2 className="text-2xl font-bold">Verifying your email...</h2>
                        <p className="text-secondary">Please wait while we confirm your account.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center py-8 animate-scale-up">
                        <CheckCircle2 className="text-success mb-4" size={64} />
                        <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
                        <p className="text-secondary mb-8">
                            Your account is now active. You can sign in to start tracking your applications.
                        </p>
                        <Link to="/login" className="btn btn-primary w-full">
                            Sign In Now <ArrowRight size={18} className="ml-2" />
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center py-8">
                        <XCircle className="text-error mb-4" size={64} />
                        <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
                        <p className="text-secondary mb-8">{message}</p>
                        <Link to="/login" className="btn btn-secondary w-full">
                            Go Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
