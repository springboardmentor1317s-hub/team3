'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Save, Loader, X, Plus, Mail, Building,
  GraduationCap, BookOpen, Zap, Edit2, Check
} from 'lucide-react';
import Logo from '@/components/Logo';
import { ToastContainer } from '@/components/Toast';

export default function StudentProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);

  const [formData, setFormData] = useState({
    fullName: '',
    interests: [],
    skills: [],
    profileBio: '',
  });

  const [interestInput, setInterestInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration: 3000 }]);
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to fetch profile');

      const data = await res.json();
      setUser(data.data);
      setFormData({
        fullName: data.data.fullName || '',
        interests: data.data.interests || [],
        skills: data.data.skills || [],
        profileBio: data.data.profileBio || '',
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      showToast('Error loading profile', 'error');
      setLoading(false);
    }
  };

  const handleAddInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interestInput.trim()],
      }));
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (index) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index),
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      if (!formData.interests || formData.interests.length === 0) {
        showToast('Please add at least one interest', 'error');
        setSaving(false);
        return;
      }

      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save profile');

      const data = await res.json();
      setUser(data.data);
      showToast('Profile updated successfully!', 'success');
      setSaving(false);
    } catch (err) {
      showToast(err.message, 'error');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-900/50 border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Logo />
          </Link>
          <Link
            href="/student-dashboard"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Your Profile</h1>
            <p className="text-slate-400">Complete your profile to get personalized event recommendations</p>
          </div>

          {/* Profile Card */}
          <motion.div
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 backdrop-blur-sm"
            whileHover={{ borderColor: 'rgba(99, 102, 241, 0.5)' }}
          >
            {/* Basic Info Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                Basic Information
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* College & Email (Read-only) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      College
                    </label>
                    <input
                      type="text"
                      value={user?.college || ''}
                      disabled
                      className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-lg text-slate-400 opacity-75 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-lg text-slate-400 opacity-75 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    About You (Bio)
                  </label>
                  <textarea
                    value={formData.profileBio}
                    onChange={(e) => setFormData(prev => ({ ...prev, profileBio: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
                    rows="4"
                    placeholder="Tell us about yourself, your background, and what you're passionate about..."
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-700 my-8" />

            {/* Interests Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Your Interests
              </h2>

              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  Add interests to help us recommend relevant events
                </p>

                {/* Interest Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                    className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                    placeholder="e.g., Web Development, AI/ML, Design, etc."
                  />
                  <button
                    onClick={handleAddInterest}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                {/* Interests Tags */}
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="px-4 py-2 bg-indigo-600/20 border border-indigo-500/50 rounded-full text-indigo-300 flex items-center gap-2 text-sm"
                    >
                      {interest}
                      <button
                        onClick={() => handleRemoveInterest(idx)}
                        className="hover:text-indigo-200 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {formData.interests.length === 0 && (
                  <p className="text-sm text-slate-500 italic">
                    No interests added yet. Add at least one to get recommendations!
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-700 my-8" />

            {/* Skills Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Your Skills
              </h2>

              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  List your skills and expertise to find the perfect events
                </p>

                {/* Skill Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                    placeholder="e.g., JavaScript, Python, Public Speaking, etc."
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium flex items-center gap-2 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="px-4 py-2 bg-yellow-600/20 border border-yellow-500/50 rounded-full text-yellow-300 flex items-center gap-2 text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(idx)}
                        className="hover:text-yellow-200 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {formData.skills.length === 0 && (
                  <p className="text-sm text-slate-500 italic">
                    No skills added yet. (Optional but helpful for better recommendations)
                  </p>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-4 pt-4">
              <motion.button
                onClick={handleSaveProfile}
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Profile
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div
            className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-indigo-200 flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>
                After saving your profile, you'll see AI-powered event recommendations on your dashboard
                that match your interests and skills!
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
    </div>
  );
}
