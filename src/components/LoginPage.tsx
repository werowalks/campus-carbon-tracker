import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Leaf, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import campusBackground from '@/assets/campus-background.jpg';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', name: '' });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [errors, setErrors] = useState<{ login?: string; register?: string; forgotPassword?: string }>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate input
    const result = loginSchema.safeParse(loginForm);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const errorMessage = Object.values(fieldErrors).flat()[0];
      setErrors({ login: errorMessage });
      return;
    }

    setIsLoading(true);

    const response = await login(loginForm.email, loginForm.password);
    
    if (response.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      setErrors({ login: response.error || 'Login failed' });
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate input
    const result = registerSchema.safeParse(registerForm);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const errorMessage = Object.values(fieldErrors).flat()[0];
      setErrors({ register: errorMessage });
      return;
    }

    setIsLoading(true);

    const response = await register(registerForm.email, registerForm.password, registerForm.name);
    
    if (response.success) {
      if (response.error?.includes('check your email')) {
        setShowConfirmation(true);
        toast.info('Please check your email to confirm your account');
      } else {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } else {
      setErrors({ register: response.error || 'Registration failed' });
    }
    
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = forgotPasswordSchema.safeParse({ email: forgotPasswordEmail });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const errorMessage = Object.values(fieldErrors).flat()[0];
      setErrors({ forgotPassword: errorMessage });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('register-user', {
        body: {
          action: 'recovery',
          email: forgotPasswordEmail.trim(),
        },
      });

      if (error) {
        setErrors({ forgotPassword: error.message });
      } else if (!data?.success) {
        setErrors({ forgotPassword: data?.error || 'Unable to send password reset email.' });
      } else {
        setResetEmailSent(true);
        toast.success('Password reset email sent! Check your inbox.');
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      setErrors({ forgotPassword: 'An unexpected error occurred. Please try again.' });
    }

    setIsLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${campusBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay with blur for better readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      <div className="w-full max-w-md animate-slide-up relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-4 shadow-xl">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">
            Carbon Footprint Dashboard
          </h1>
          <p className="text-white/80 mt-2">
            Sustainable Campus Initiative
          </p>
        </div>

        {/* Email Confirmation Message */}
        {showConfirmation && (
          <Card className="mb-4 border-green-500 bg-green-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Check your email</p>
                  <p className="text-sm text-green-700">
                    We've sent you a confirmation link. Please check your inbox to verify your account.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Auth Card */}
        <Card className="border-0 shadow-xl">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader className="pb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="login" className="mt-0">
                <form onSubmit={handleLogin} className="space-y-4">
                  {errors.login && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      <p className="text-sm text-destructive">{errors.login}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                        autoComplete="current-password"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Button type="submit" className="w-full eco-gradient" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <form onSubmit={handleRegister} className="space-y-4">
                  {errors.register && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      <p className="text-sm text-destructive">{errors.register}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Juan Dela Cruz"
                        className="pl-10"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        required
                        autoComplete="name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        required
                        minLength={6}
                        autoComplete="new-password"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                  </div>
                  <Button type="submit" className="w-full eco-gradient" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <p className="text-center text-xs text-white/60 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Reset Password</h2>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmailSent(false);
                    setForgotPasswordEmail('');
                    setErrors({});
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {resetEmailSent ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Email sent!</p>
                    <p className="text-sm text-green-700">
                      Check your inbox for a password reset link.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  {errors.forgotPassword && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      <p className="text-sm text-destructive">{errors.forgotPassword}</p>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full eco-gradient" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
