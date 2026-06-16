import React, { useEffect } from 'react';
import { MonitorPlay, Clock, AlertCircle, Trophy, Radio } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMatches, updateMatch } from '../../state/matchSlice';
import { useNavigate } from 'react-router-dom';

const LiveMatches = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { matches, isLoading } = useSelector((state) => state.match);

  useEffect(() => {
    dispatch(fetchMatches());
    // Refresh every 15 seconds to pick up live data
    const interval = setInterval(() => dispatch(fetchMatches()), 15000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // FIX: LIVE is uppercase in the backend
  const liveMatches = matches.filter((match) => match.status === 'LIVE');

  const handleEndMatch = async (match) => {
    if (window.confirm(`End match: ${match.team1?.name} vs ${match.team2?.name}?`)) {
      navigate('/home/schedule');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center text-sm font-bold text-slate-500 mb-2 tracking-wide">
            <span>Administration</span>
            <span className="mx-2">&gt;</span>
            <span className="text-[#1E402F]">Live Broadcast</span>
          </div>
          <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Live Broadcast</h2>
          <p className="text-[15px] text-slate-600 mt-1">Monitor and manage all currently active fixtures.</p>
        </div>
        {liveMatches.length > 0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-red-600">{liveMatches.length} Match Live</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden min-h-[60vh]">
        <div className="p-5 border-b border-[#e5e7eb] flex items-center justify-between bg-[#fafafa]">
          <h3 className="text-[16px] font-bold text-slate-800 flex items-center">
            <MonitorPlay size={18} className="mr-2 text-[#2ebd4f]" /> Active Games ({liveMatches.length})
          </h3>
          <button
            onClick={() => dispatch(fetchMatches())}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
          >
            <Radio size={13} /> Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-[#2ebd4f] rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-bold">Connecting to live feeds...</p>
          </div>
        ) : liveMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
               <AlertCircle size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Live Matches</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">There are currently no matches in progress. Check the Master Schedule for upcoming fixtures or start a new match.</p>
            <button onClick={() => navigate('/home/schedule')} className="px-6 py-2.5 bg-[#1E402F] hover:bg-[#152e22] text-white text-sm font-bold rounded-md shadow-sm transition-colors">
              View Schedule
            </button>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveMatches.map((match) => (
              <div key={match._id} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#bbf7d0] transition-all group">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-[#1E402F] to-[#2a5a40] p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">Live</span>
                  </div>
                  <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">{match.format || 'T20'}</span>
                </div>

                {/* Teams */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                        <span className="font-black text-slate-700 text-sm">{match.team1?.shortName || 'T1'}</span>
                      </div>
                      <span className="font-bold text-slate-800 text-sm">{match.team1?.name}</span>
                    </div>
                    <div className="text-center">
                      <span className="font-black text-slate-200 text-lg">VS</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                        <span className="font-black text-slate-700 text-sm">{match.team2?.shortName || 'T2'}</span>
                      </div>
                      <span className="font-bold text-slate-800 text-sm">{match.team2?.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-[12px] font-bold text-slate-500 mb-4 border-t border-slate-100 pt-4">
                    <Clock size={13} className="mr-1.5" />
                    {match.venue || 'TBA'}
                  </div>

                  {/* Toss info */}
                  {match.tossWinner && (
                    <div className="mb-4 bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-center">
                      <p className="text-[12px] text-slate-500">
                        <span className="font-bold text-slate-700">{match.tossWinner?.shortName || match.tossWinner?.name}</span>
                        {' '}won toss &amp; chose to{' '}
                        <span className="font-bold text-[#1E402F]">{match.tossDecision?.toLowerCase()}</span>
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate(`/home/scoring/${match._id}`)}
                      className="w-full py-2.5 bg-[#1E402F] hover:bg-[#152e22] text-white font-bold text-sm rounded-lg transition-colors"
                    >
                      Open Scoring Panel
                    </button>
                    <button
                      onClick={() => handleEndMatch(match)}
                      className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-sm rounded-lg transition-colors"
                    >
                      End Match →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatches;
