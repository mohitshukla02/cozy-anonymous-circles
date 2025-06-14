
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { generateRandomUsername } from '@/utils/usernameGenerator';
import { FlickeringGrid } from '@/components/ui/flickering-grid';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState(generateRandomUsername());
  const [useCustomUsername, setUseCustomUsername] = useState(false);
  const [customUsername, setCustomUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redditLoading, setRedditLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const { signUp, signIn, signInWithReddit, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Password validation functions
  const hasUppercase = (str: string) => /[A-Z]/.test(str);
  const hasLowercase = (str: string) => /[a-z]/.test(str);
  const hasSpecialChar = (str: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str);
  const hasMinLength = (str: string) => str.length >= 8;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const isPasswordValid = password && hasUppercase(password) && hasLowercase(password) && hasSpecialChar(password) && hasMinLength(password);
  const canSubmit = isSignUp ? (email && isPasswordValid && passwordsMatch && (useCustomUsername ? customUsername.trim() : username)) : (email && password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);

    try {
      let result;
      const finalUsername = useCustomUsername ? customUsername.trim() : username;
      
      if (isSignUp) {
        result = await signUp(email, password, finalUsername);
      } else {
        result = await signIn(email, password);
      }

      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: isSignUp ? "Account created! Please check your email for verification." : "Welcome back!",
        });
        
        if (!isSignUp) {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedditSignIn = async () => {
    setRedditLoading(true);
    try {
      const result = await signInWithReddit();
      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong with Reddit login",
        variant: "destructive"
      });
    } finally {
      setRedditLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong with Google login",
        variant: "destructive"
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const generateNewUsername = () => {
    setUsername(generateRandomUsername());
  };

  const ValidationIndicator = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className={`flex items-center space-x-2 text-xs ${isValid ? 'text-green-600' : 'text-gray-400'}`}>
      {isValid ? <Check size={12} /> : <X size={12} />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Flickering Grid Background */}
      <div className="absolute inset-0 z-0">
        <FlickeringGrid
          className="w-full h-full"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.3}
          flickerChance={0.1}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/lovable-uploads/ef93a52d-7a19-46ab-9703-c60bf1cfdcd7.png" alt="Circles Logo" className="w-12 h-12" />
              </div>
              <span className="font-medium text-2xl text-gray-800">Circles</span>
            </Link>
          </div>

          {/* Auth Card */}
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-soft p-8 mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2">
                {isSignUp ? 'Join Circles' : 'Welcome Back'}
              </h2>
              <p className="text-gray-600 text-sm">
                {isSignUp ? 'Create your anonymous identity' : 'Sign in to your account'}
              </p>
            </div>

            {/* Social Sign In Buttons */}
            <div className="mb-6 space-y-3">
              <Button
                onClick={handleRedditSignIn}
                disabled={redditLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                {redditLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                  </svg>
                )}
                Continue with Reddit
              </Button>
              
              <Button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                variant="outline"
                className="w-full bg-white/50 hover:bg-white/70 backdrop-blur-sm border-gray-200/50"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue with Google
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                Auto-populate your interests from your Reddit communities
              </p>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/70 text-gray-500">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  
                  <div className="mb-3">
                    <label className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <input
                        type="checkbox"
                        checked={useCustomUsername}
                        onChange={(e) => setUseCustomUsername(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span>Use custom username</span>
                    </label>
                  </div>

                  {useCustomUsername ? (
                    <Input
                      value={customUsername}
                      onChange={(e) => setCustomUsername(e.target.value)}
                      placeholder="Enter your custom username"
                      className="w-full bg-white/50 backdrop-blur-sm border-gray-200/50"
                      required
                    />
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Your anonymous username"
                        className="flex-1 bg-white/50 backdrop-blur-sm border-gray-200/50"
                        required
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={generateNewUsername}
                        className="whitespace-nowrap bg-white/50 hover:bg-white/70 backdrop-blur-sm border-gray-200/50"
                      >
                        Generate
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-white/50 backdrop-blur-sm border-gray-200/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pr-10 bg-white/50 backdrop-blur-sm border-gray-200/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {isSignUp && password && (
                  <div className="mt-2 space-y-1">
                    <ValidationIndicator isValid={hasUppercase(password)} text="One uppercase letter" />
                    <ValidationIndicator isValid={hasLowercase(password)} text="One lowercase letter" />
                    <ValidationIndicator isValid={hasSpecialChar(password)} text="One special character" />
                    <ValidationIndicator isValid={hasMinLength(password)} text="Minimum 8 characters" />
                  </div>
                )}
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className={`pr-10 bg-white/50 backdrop-blur-sm border-gray-200/50 ${confirmPassword && (passwordsMatch ? 'border-green-500 focus:border-green-500' : 'border-red-500 focus:border-red-500')}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirmPassword && (
                    <div className="mt-2">
                      <ValidationIndicator isValid={passwordsMatch} text="Passwords match" />
                    </div>
                  )}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !canSubmit}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {isSignUp ? 'Join Circles' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Join us"
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
