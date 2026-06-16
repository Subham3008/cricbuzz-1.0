import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react';
import { fetchMatches, updateMatch } from '../../state/matchSlice';
import ChangePlayerModal from '../components/ChangePlayerModal';

const ScoringPanel = () => {
  const { matchId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { matches, isLoading } = useSelector(state => state.match);

  const match = matches.find(m => m._id === matchId);

  // Local batting state — mirrors who is currently batting
  // In a real system this would come from a scorecard model
  const [batsmen, setBatsmen] = useState([null, null]);
  const [wicketTarget, setWicketTarget] = useState(null); // which batsman slot (0 or 1) got out

  useEffect(() => {
    if (!matches.length) dispatch(fetchMatches());
  }, [dispatch, matches.length]);

  // Populate initial batsmen from playingXI if available
  useEffect(() => {
    if (match?.playingXI) {
      const battingTeamXI = match.tossDecision === 'BAT'
        ? match.playingXI?.team1
        : match.playingXI?.team2;
      if (battingTeamXI?.length >= 2) {
        setBatsmen([battingTeamXI[0]?.player, battingTeamXI[1]?.player]);
      }
    }
  }, [match]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#2ebd4f] rounded-full animate-spin" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <p className="text-slate-500 font-bold mb-4">Match not found or not loaded yet.</p>
        <button onClick={() => navigate('/home/live')} className="px-6 py-2.5 bg-[#1E402F] text-white font-bold rounded-md text-sm">
          ← Back to Live Matches
        </button>
      </div>
    );
  }

  const handleWicket = (slot) => setWicketTarget(slot);

  const handleNewBatsman = (newPlayerId) => {
    const updated = [...batsmen];
    updated[wicketTarget] = { _id: newPlayerId, name: `Player #${newPlayerId.slice(-4)}` };
    setBatsmen(updated);
    setWicketTarget(null);
    // In production — PATCH scorecard API here
  };

  // Build squad from playingXI for the incoming batsman dropdown
  const battingSquad = (match.tossDecision === 'BAT' ? match.playingXI?.team1 : match.playingXI?.team2)
    ?.map(p => p.player) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {wicketTarget !== null && (
        <ChangePlayerModal
          outBatsman={batsmen[wicketTarget]}
          squad={battingSquad}
          onConfirm={handleNewBatsman}
          onClose={() => setWicketTarget(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/home/live')} className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="text-sm font-bold text-slate-500">Live Scoring</p>
          <h2 className="text-[26px] font-bold text-slate-900">
            {match.team1?.shortName || 'T1'} vs {match.team2?.shortName || 'T2'}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">{match.venue} • {match.format}</p>
        </div>
        <div className="ml-auto flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Scoreboard placeholder */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Current Innings</h3>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-[42px] font-black text-slate-900">—</p>
            <p className="text-sm font-bold text-slate-500">Runs</p>
          </div>
          <div className="text-center">
            <p className="text-[42px] font-black text-slate-900">—</p>
            <p className="text-sm font-bold text-slate-500">Wickets</p>
          </div>
          <div className="text-center">
            <p className="text-[42px] font-black text-slate-900">—</p>
            <p className="text-sm font-bold text-slate-500">Overs</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-4 text-center">Connect a live scorecard API to populate scores</p>
      </div>

      {/* Batting — Active Batsmen */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-slate-800">At the Crease</h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Batting</span>
        </div>
        <div className="divide-y divide-slate-100">
          {[0, 1].map((slot) => (
            <div key={slot} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#e7f9eb] flex items-center justify-center font-black text-[#1E402F]">
                  {slot === 0 ? '🏏' : '🏏'}
                </div>
                <div>
                  <p className="font-bold text-slate-800">
                    {batsmen[slot]?.name || `Batsman ${slot + 1} — Not Set`}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">{slot === 0 ? 'Striker' : 'Non-Striker'}</p>
                </div>
              </div>
              <button
                onClick={() => handleWicket(slot)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[12px] font-bold rounded-lg transition-colors"
              >
                <AlertTriangle size={13} />
                Wicket!
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h4 className="font-bold text-slate-700 mb-3 text-sm">Match Controls</h4>
          <div className="space-y-2">
            <button
              onClick={() => dispatch(updateMatch({ id: matchId, data: { status: 'INNINGS_BREAK' } }))}
              className="w-full py-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Innings Break
            </button>
            <button
              onClick={() => navigate('/home/schedule')}
              className="w-full py-2 text-sm font-bold text-white bg-[#1E402F] hover:bg-[#152e22] rounded-lg transition-colors"
            >
              End Match
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h4 className="font-bold text-slate-700 mb-3 text-sm">Match Info</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Format</span>
              <span className="font-bold text-slate-800">{match.format || 'T20'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Venue</span>
              <span className="font-bold text-slate-800 text-right max-w-[60%]">{match.venue || 'TBA'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Toss</span>
              <span className="font-bold text-slate-800">
                {match.tossWinner ? `${match.tossWinner?.shortName || '—'} won` : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoringPanel;
