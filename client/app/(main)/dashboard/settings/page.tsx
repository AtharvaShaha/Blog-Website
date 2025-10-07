"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const schema = Yup.object().shape({
  username: Yup.string().min(3).required('Required'),
  email: Yup.string().email('Invalid').required('Required'),
});

export default function SettingsPage() {
  const { user } = useSelector((s: RootState) => s.auth);

  const formik = useFormik({
    initialValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      // UI-only save for now
      toast.success('Profile saved (UI only)');
    },
  });

  return (
    <ProtectedRoute>
      <motion.div initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{duration:0.35}} className="max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>

        <div className="bg-white rounded-lg p-6 shadow">
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Profile picture</label>
              <div className="mt-2 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
                <div>
                  <input type="file" accept="image/*" className="text-sm" />
                  <div className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</div>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input {...formik.getFieldProps('username')} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md" />
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-500 text-sm mt-1">{typeof formik.errors.username === 'string' ? formik.errors.username : JSON.stringify(formik.errors.username)}</div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input {...formik.getFieldProps('email')} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md" />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">{typeof formik.errors.email === 'string' ? formik.errors.email : JSON.stringify(formik.errors.email)}</div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save changes</button>
              <button type="button" onClick={() => { formik.resetForm(); toast('Reset'); }} className="px-4 py-2 border rounded-md">Reset</button>
            </div>
          </form>
        </div>
      </motion.div>
    </ProtectedRoute>
  );
}
