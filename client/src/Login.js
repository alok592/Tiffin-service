import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UtensilsCrossed } from 'lucide-react';

const API = "https://tiffin-service-arb4.onrender.com";

const Login = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleAuth = async (e) => {

    e.preventDefault();

    try {

      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Login failed");
        return;
      }

      // Save user + token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === "student") {
        navigate("/student-dashboard");
      } else if (data.user.role === "owner") {
        navigate("/mess-owner-dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {

      console.error(err);
      alert("⚠️ Server Error: Make sure backend is running.");

    }

  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">

      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">
          <UtensilsCrossed className="text-white w-7 h-7" />
        </div>
        <span className="text-3xl font-bold text-slate-900">
          MealConnect
        </span>
      </div>

      <div className="w-full max-w-[440px] bg-white rounded-[40px] p-12 border border-white">

        <div className="text-center mb-10">
          <h1 className="text-[32px] font-bold text-slate-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 font-medium">
            Log in to your account
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">

          <div className="space-y-2">
            <label className="text-[15px] font-bold text-slate-900 ml-1">
              Email
            </label>

            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-6 py-4 rounded-2xl border border-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[15px] font-bold text-slate-900 ml-1">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-6 py-4 rounded-2xl border border-gray-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300"
              >
                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>

            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-4 rounded-2xl text-lg"
          >
            Log In
          </button>

        </form>

        <div className="text-center mt-12">

          <p className="text-gray-400 font-medium">
            Don't have an account?

            <Link
              to="/register"
              className="text-orange-500 font-bold ml-1"
            >
              Sign Up
            </Link>

          </p>

        </div>

      </div>

    </div>
  );

};

export default Login;
