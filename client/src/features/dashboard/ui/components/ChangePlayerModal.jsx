import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';

const ChangePlayerModal = ({ outBatsman, squad, onConfirm, onClose }) => {
  const [newBatsman, setNewBatsman] = useState('');

  if (!outBatsman) return null;

  // Filter out the dismissed batsman from available options
  const available = (squad || []).filter(p => p._id !== outBatsman._id);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            <h2 className="text-lg font-bold text-slate-900">Wicket! Change Batsman</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <p className="text-sm font-bold text-red-700">
              {outBatsman.name || 'Batsman'} is OUT
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Next Batsman *</label>
            <select
              value={newBatsman}
              onChange={(e) => setNewBatsman(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f]"
            >
              <option value="">Pick incoming batsman</option>
              {available.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="px-6 pb-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 font-bold text-sm rounded-lg">Cancel</button>
          <button
            onClick={() => { if (newBatsman) onConfirm(newBatsman); }}
            disabled={!newBatsman}
            className="px-5 py-2.5 text-white bg-[#1E402F] hover:bg-[#152e22] font-bold text-sm rounded-lg disabled:opacity-50"
          >
            Confirm &amp; Continue
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ChangePlayerModal;
