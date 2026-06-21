import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="bg-[#151A24] p-8 rounded-2xl w-96 border border-[#1A2235]">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Login to Habits</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="bg-[#0B0E14] text-white p-3 rounded-lg border border-[#1A2235] focus:outline-none focus:border-[#10B981]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-[#0B0E14] text-white p-3 rounded-lg border border-[#1A2235] focus:outline-none focus:border-[#10B981]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-[#10B981] text-white p-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all mt-2">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[#8E9BAE]">
          Don't have an account? <Link to="/signup" className="text-[#10B981]">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
