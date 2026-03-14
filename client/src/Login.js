import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UtensilsCrossed } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    // Aapka existing backend fetch logic yahan aayega
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      
      {/* 🥗 Brand Header - Using .brand-font from your CSS */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-xl bg-primary-brand flex items-center justify-center shadow-sm hover-effect">
          <UtensilsCrossed className="text-white w-7 h-7" />
        </div>
        <span className="text-3xl font-bold text-slate-900 brand-font">MealConnect</span>
      </div>

      {/* 📦 Premium Login Card */}
      <div className="w-full max-w-[440px] bg-white rounded-[40px] shadow-[0_15px_50px_rgba(0,0,0,0.03)] p-12 border border-white hover-effect">
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-bold text-slate-900 mb-2 heading-font">Welcome Back</h1>
          <p className="text-gray-400 font-medium">Log in to your account</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[15px] font-bold text-slate-900 ml-1">Email</label>
            <input 
              type="email" 
              placeholder="your@email.com"
              className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-white focus:border-[#f97316] focus:ring-4 focus:ring-orange-50 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[15px] font-bold text-slate-900 ml-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-white focus:border-[#f97316] focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-slate-500 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* 🔘 Premium Button - Using .btn-premium from your CSS */}
          <button type="submit" className="btn-premium w-full py-4 rounded-2xl text-lg mt-4 shadow-lg shadow-orange-100">
            Log In
          </button>
        </form>

        <div className="text-center mt-12">
          <p className="text-gray-400 font-medium">
            Don't have an account? 
            <Link to="/register" className="text-primary-brand font-bold hover:underline ml-1 decoration-2 underline-offset-4">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;