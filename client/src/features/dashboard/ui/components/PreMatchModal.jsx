import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Play } from 'lucide-react';

const PreMatchModal = ({ match, onSubmit }) => {
  const team1 = match.team1;
  const team2 = match.team2;

  const [battingTeam, setBattingTeam] = useState(match.tossWinner === team1._id ? (match.tossDecision === 'BAT' ? team1._id : team2._id) : (match.tossDecision === 'BAT' ? team2._id : team1._id));
  const [striker, setStriker] = useState('');
  const [nonStriker, setNonStriker] = useState('');
  const [bowler, setBowler] = useState('');

  const battingSquad = battingTeam === team1._id ? match.team1.squadPlayers || [] : match.team2.squadPlayers || [];
  const bowlingSquad = battingTeam === team1._id ? match.team2.squadPlayers || [] : match.team1.squadPlayers || [];

  const handleStart = () => {
    onSubmit({ battingTeam, striker, nonStriker, currentBowler: bowler });
  };

  const isValid = battingTeam && striker && nonStriker && bowler && striker !== nonStriker;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#e7f9eb]">
          <div className="flex items-center gap-2">
            <Play size={18} className="text-[#2ebd4f]" />
            <h2 className="text-lg font-bold text-[#1E402F]">Match Initial Setup</h2>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-sm text-slate-500 font-medium">Please select the opening players to start the live match.</p>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Batting Team</label>
            <select
              value={battingTeam}
              onChange={(e) => setBattingTeam(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
            >
              <option value={team1._id}>{team1.name}</option>
              <option value={team2._id}>{team2.name}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Striker *</label>
              <select
                value={striker}
                onChange={(e) => setStriker(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
              >
                <option value="">Select Striker</option>
                {battingSquad.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Non-Striker *</label>
              <select
                value={nonStriker}
                onChange={(e) => setNonStriker(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
              >
                <option value="">Select Non-Striker</option>
                {battingSquad.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Opening Bowler *</label>
            <select
              value={bowler}
              onChange={(e) => setBowler(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
            >
              <option value="">Select Bowler</option>
              {bowlingSquad.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="px-6 pb-6 flex justify-end gap-3">
          <button
            onClick={handleStart}
            disabled={!isValid}
            className="w-full py-3 text-white bg-[#1E402F] hover:bg-[#152e22] font-bold text-sm rounded-lg disabled:opacity-50"
          >
            Confirm & Start Match
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PreMatchModal;
