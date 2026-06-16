import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { X, Loader2 } from 'lucide-react';
import { createTeam } from '../../state/teamSlice';

const AddTeamModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { isLoading: isCreating } = useSelector(state => state.team);

  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    logo: '',
    primaryColor: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const isValidUrl = (str) => {
    try { new URL(str); return true; } catch { return false; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.shortName || !formData.logo) {
      setError('Name, Short Name and Logo URL are required.');
      return;
    }
    if (!isValidUrl(formData.logo)) {
      setError('Logo must be a valid URL (e.g. https://example.com/logo.png)');
      return;
    }
    if (formData.primaryColor && !/^#[0-9a-fA-F]{6}$/.test(formData.primaryColor)) {
      setError('Primary color must be a hex code like #1A2B3C');
      return;
    }

    const payload = {
      name: formData.name,
      shortName: formData.shortName.toUpperCase(),
      logo: formData.logo,
      ...(formData.primaryColor && { primaryColor: formData.primaryColor }),
    };

    try {
      await dispatch(createTeam(payload)).unwrap();
      onClose();
      setFormData({ name: '', shortName: '', logo: '', primaryColor: '' });
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to create team');
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Add New Team</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded border border-red-100">
              {error}
            </div>
          )}

          {/* Team Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Team Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Mumbai Indians"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f] transition-all"
            />
          </div>

          {/* Short Name + Primary Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Short Name *</label>
              <input
                type="text"
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
                placeholder="e.g. MI"
                maxLength={10}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f] transition-all uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Primary Color
                <span className="text-slate-400 font-normal ml-1">(optional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  name="primaryColor"
                  value={formData.primaryColor || '#1E402F'}
                  onChange={(e) => {
                    setFormData({ ...formData, primaryColor: e.target.value });
                    setError('');
                  }}
                  className="h-[42px] w-12 border border-slate-200 rounded-lg cursor-pointer bg-slate-50 p-1"
                />
                <input
                  type="text"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  placeholder="#1E402F"
                  maxLength={7}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f] transition-all font-mono"
                />
              </div>
            </div>
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Logo URL *</label>
            <input
              type="url"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="https://example.com/team-logo.png"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f] transition-all"
            />
            {formData.logo && isValidUrl(formData.logo) && (
              <div className="mt-2 flex items-center gap-2">
                <img src={formData.logo} alt="Preview" className="w-8 h-8 rounded object-contain border border-slate-200 bg-slate-50 p-0.5" onError={(e) => { e.target.style.display = 'none'; }} />
                <span className="text-xs text-slate-400 font-medium">Logo preview</span>
              </div>
            )}
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 font-bold text-sm rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isCreating} className="px-5 py-2.5 text-white bg-[#1E402F] hover:bg-[#152e22] font-bold text-sm rounded-lg transition-colors flex items-center">
              {isCreating && <Loader2 size={16} className="animate-spin mr-2" />}
              {isCreating ? 'Creating...' : 'Add Team'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddTeamModal;
