import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import KPICard from '../components/KPICard';
import StatusBadge from '../components/StatusBadge';
import { Calendar as CalendarIcon, MapPin, Clock, CheckCircle, Plus, Play, Square, Trophy, Radio } from 'lucide-react';
import { fetchMatches, updateMatch } from '../../state/matchSlice';
import ScheduleMatchModal from '../components/ScheduleMatchModal';
import { createPortal } from 'react-dom';

const STATUS = {
  UPCOMING: 'UPCOMING',
  LIVE: 'LIVE',
  COMPLETED: 'COMPLETED',
};

// End Match modal — pick winner with rich numeric form
const EndMatchModal = ({ match, onClose, onConfirm, isSubmitting }) => {
  const [winner, setWinner] = useState('');
  const [result, setResult] = useState('');
  const [team1Score, setTeam1Score] = useState({ runs: 0, wickets: 0, overs: 0 });
  const [team2Score, setTeam2Score] = useState({ runs: 0, wickets: 0, overs: 0 });

  if (!match) return null;

  const ScoreInput = ({ label, value, onChange, max = 999, step = 1 }) => (
    <div className="flex flex-col items-center gap-1">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
        <button type="button" onClick={() => onChange(Math.max(0, value - step))} className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors">−</button>
        <span className="px-3 py-1.5 font-black text-slate-900 text-base min-w-[40px] text-center">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + step))} className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors">+</button>
      </div>
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 bg-amber-50">
          <Trophy size={18} className="text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900">End Match</h2>
        </div>
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* Team 1 Score */}
          <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
            <p className="text-sm font-bold text-slate-700 mb-3">{match.team1?.name || 'Team 1'} Score</p>
            <div className="flex items-center gap-4 justify-around">
              <ScoreInput label="Runs" value={team1Score.runs} onChange={(v) => setTeam1Score(s => ({...s, runs: v}))} />
              <ScoreInput label="Wickets" value={team1Score.wickets} onChange={(v) => setTeam1Score(s => ({...s, wickets: v}))} max={10} />
              <ScoreInput label="Overs" value={team1Score.overs} onChange={(v) => setTeam1Score(s => ({...s, overs: v}))} max={50} />
            </div>
          </div>

          {/* Team 2 Score */}
          <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
            <p className="text-sm font-bold text-slate-700 mb-3">{match.team2?.name || 'Team 2'} Score</p>
            <div className="flex items-center gap-4 justify-around">
              <ScoreInput label="Runs" value={team2Score.runs} onChange={(v) => setTeam2Score(s => ({...s, runs: v}))} />
              <ScoreInput label="Wickets" value={team2Score.wickets} onChange={(v) => setTeam2Score(s => ({...s, wickets: v}))} max={10} />
              <ScoreInput label="Overs" value={team2Score.overs} onChange={(v) => setTeam2Score(s => ({...s, overs: v}))} max={50} />
            </div>
          </div>

          {/* Winner */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Match Winner *</label>
            <select
              value={winner}
              onChange={(e) => setWinner(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#2ebd4f]"
            >
              <option value="">Pick winner</option>
              <option value={match.team1?._id}>{match.team1?.name || 'Team 1'}</option>
              <option value={match.team2?._id}>{match.team2?.name || 'Team 2'}</option>
              <option value="draw">Match Drawn / No Result</option>
            </select>
          </div>

          {/* Result description auto-generated */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Result Summary</label>
            <input
              type="text"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="e.g. India won by 6 wickets"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#2ebd4f]"
            />
          </div>
        </div>
        <div className="px-6 pb-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 font-bold text-sm rounded-lg">Cancel</button>
          <button
            onClick={() => onConfirm({ winner, result, team1Score, team2Score })}
            disabled={!winner || isSubmitting}
            className="px-5 py-2.5 text-white bg-amber-500 hover:bg-amber-600 font-bold text-sm rounded-lg disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> Saving...</> : 'Confirm & Complete'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Schedule = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { matches, isLoading } = useSelector((state) => state.match);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [endMatchTarget, setEndMatchTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startingMatchId, setStartingMatchId] = useState(null);

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  const handleStartMatch = async (match) => {
    setStartingMatchId(match._id);
    try {
      // First: update status to LIVE and wait for it to complete
      await dispatch(updateMatch({ id: match._id, data: { status: STATUS.LIVE } })).unwrap();
      // Then: redirect to live broadcast page so it sees the updated data
      navigate('/home/live');
    } catch (err) {
      alert(err || 'Failed to start match. Another match may already be live.');
    } finally {
      setStartingMatchId(null);
    }
  };

  const handleEndMatch = async ({ winner, result, team1Score, team2Score }) => {
    setIsSubmitting(true);
    try {
      const resultStr = result || `${winner === endMatchTarget.team1?._id ? endMatchTarget.team1?.name : endMatchTarget.team2?.name} won`;
      await dispatch(updateMatch({
        id: endMatchTarget._id,
        data: {
          status: STATUS.COMPLETED,
          winner: winner === 'draw' ? undefined : winner,
          result: resultStr,
          team1Score,
          team2Score,
        },
      })).unwrap();
      setEndMatchTarget(null); // auto-close on success
    } catch (err) {
      alert(err || 'Failed to complete match');
    } finally {
      setIsSubmitting(false);
    }
  };

  const upcomingCount = matches.filter(m => m.status === STATUS.UPCOMING).length;
  const liveCount = matches.filter(m => m.status === STATUS.LIVE).length;
  const completedCount = matches.filter(m => m.status === STATUS.COMPLETED).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      {isModalOpen && <ScheduleMatchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      {endMatchTarget && (
        <EndMatchModal
          match={endMatchTarget}
          onClose={() => setEndMatchTarget(null)}
          onConfirm={handleEndMatch}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center text-sm font-bold text-slate-500 mb-2 tracking-wide">
            <span>Administration</span>
            <span className="mx-2">&gt;</span>
            <span className="text-[#1E402F]">Match Scheduling</span>
          </div>
          <h2 className="text-[28px] md:text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Master Schedule</h2>
          <p className="text-[15px] text-slate-600 mt-1">Manage and coordinate all upcoming fixtures.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="self-start sm:self-auto flex items-center px-5 py-3 bg-[#1E402F] hover:bg-[#152e22] text-white text-sm font-bold rounded-md shadow-sm transition-colors tracking-wide">
          <Plus size={18} className="mr-2" strokeWidth={2.5} />
          Schedule New Match
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Fixtures" value={matches.length.toString()} icon={CalendarIcon} badgeText="All time" badgeColor="bg-[#e0e7ff] text-[#4f46e5]" />
        <KPICard title="Live Now" value={liveCount.toString()} icon={Clock} badgeText="Currently Scoring" badgeColor="text-[#d32f2f] bg-transparent p-0" />
        <KPICard title="Upcoming" value={upcomingCount.toString()} icon={CheckCircle} />
        <KPICard title="Completed" value={completedCount.toString()} icon={MapPin} />
      </div>

      {/* Matches Table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden">
        <div className="p-5 border-b border-[#e5e7eb]">
          <h3 className="text-[16px] font-bold text-slate-800">All Fixtures</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e5e7eb]">
                <th className="py-4 px-4 md:px-6 text-[13px] font-bold text-slate-700">Match</th>
                <th className="py-4 px-4 md:px-6 text-[13px] font-bold text-slate-700">Venue / Format</th>
                <th className="py-4 px-4 md:px-6 text-[13px] font-bold text-slate-700">Status / Result</th>
                <th className="py-4 px-4 md:px-6 text-[13px] font-bold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {isLoading ? (
                <tr><td colSpan="4" className="py-8 text-center text-slate-500 font-bold">Loading matches...</td></tr>
              ) : matches.length === 0 ? (
                <tr><td colSpan="4" className="py-8 text-center text-slate-500 font-bold">No matches scheduled yet.</td></tr>
              ) : (
                matches.map((match) => (
                  <tr key={match._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 md:px-6">
                      <p className="font-bold text-[15px] text-[#1E402F] tracking-wide">
                        {match.team1?.shortName || 'TBA'} vs {match.team2?.shortName || 'TBA'}
                      </p>
                      <p className="text-[13px] font-medium text-slate-500 mt-1 flex items-center">
                        <Clock size={12} className="mr-1.5 opacity-70" />
                        {match.startTime ? new Date(match.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'TBA'}
                      </p>
                    </td>
                    <td className="py-4 px-4 md:px-6">
                      <p className="font-bold text-[14px] text-slate-700">{match.venue || 'TBA'}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#f1f5f9] border border-[#e2e8f0] text-slate-600 text-[11px] rounded font-bold uppercase tracking-wider">{match.format || 'T20'}</span>
                    </td>
                    <td className="py-4 px-4 md:px-6">
                      {match.status === STATUS.LIVE ? (
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Live Now</span>
                          </span>
                        </div>
                      ) : match.status === STATUS.COMPLETED ? (
                        <div>
                          <StatusBadge status="Completed" />
                          {match.winner && (
                            <p className="text-[12px] font-bold text-[#1E402F] mt-1 flex items-center gap-1">
                              <Trophy size={11} />
                              {match.winner?.name || match.winner?.shortName || 'Winner recorded'}
                            </p>
                          )}
                          {match.result && (
                            <p className="text-[11px] text-slate-400 mt-0.5">{match.result}</p>
                          )}
                        </div>
                      ) : (
                        <StatusBadge status="Scheduled" />
                      )}
                    </td>
                    <td className="py-4 px-4 md:px-6 text-right">
                      {match.status === STATUS.UPCOMING && (
                        <button
                          onClick={() => handleStartMatch(match)}
                          disabled={startingMatchId === match._id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e7f9eb] hover:bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] text-[12px] font-bold rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {startingMatchId === match._id ? (
                            <>
                              <div className="w-3 h-3 border-2 border-[#15803d]/40 border-t-[#15803d] rounded-full animate-spin" />
                              Starting...
                            </>
                          ) : (
                            <>
                              <Play size={13} /> Start Match
                            </>
                          )}
                        </button>
                      )}
                      {match.status === STATUS.LIVE && (
                        <div className="flex flex-col gap-1 items-end">
                          <button
                            onClick={() => setEndMatchTarget(match)}
                            className="inline-flex items-center px-3 py-1.5 bg-[#ffebee] hover:bg-[#ffcdd2] text-[#d32f2f] border border-[#ffcdd2] text-[12px] font-bold rounded transition-colors"
                          >
                            <Square size={13} className="mr-1" /> End Match
                          </button>
                          <span className="text-[10px] text-red-600 font-bold animate-pulse mt-1">
                            match currently running
                          </span>
                        </div>
                      )}
                      {match.status === STATUS.COMPLETED && (
                        <span className="inline-flex items-center text-[12px] font-bold text-slate-400">
                          <CheckCircle size={13} className="mr-1" /> Done
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
