import React from 'react';
import { useFormik } from 'formik';
import { loginSchema } from '../../validation/loginFormValidation';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const res = await fetch('https://auto-track-server.onrender.com/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const data = await res.json();
        const { token, user } = data;

        if (res.ok) {
          alert('Login successful');
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          navigate(user.role === 'admin' ? '/AdminDashboard' : '/EmployeesDashboard');
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (error) {
        alert('Server error, please try again later');
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl px-8 py-10">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Login</h1>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 rounded-md border ${
                formik.touched.email && formik.errors.email
                  ? 'border-red-500'
                  : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 rounded-md border ${
                formik.touched.password && formik.errors.password
                  ? 'border-red-500'
                  : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-all shadow-md"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm mt-6 text-gray-700">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
