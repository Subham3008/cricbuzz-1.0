import React, { useEffect } from 'react';
import KPICard from '../components/KPICard';
import { Users, Globe, MonitorPlay, Calendar as CalendarIcon, ShieldAlert, BarChart2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeams } from '../../state/teamSlice';
import { fetchPlayers } from '../../state/playerSlice';
import { fetchMatches } from '../../state/matchSlice';

const DashboardOverview = () => {
  const dispatch = useDispatch();
  const { teams, isLoading: isLoadingTeams } = useSelector((state) => state.team);
  const { players, isLoading: isLoadingPlayers } = useSelector((state) => state.player);
  const { matches, isLoading: isLoadingMatches } = useSelector((state) => state.match);

  useEffect(() => {
    dispatch(fetchTeams());
    dispatch(fetchPlayers());
    dispatch(fetchMatches());
  }, [dispatch]);

  const liveMatchesCount = matches.filter(m => m.status === 'live').length;
  const upcomingMatchesCount = matches.filter(m => m.status === 'upcoming').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center text-sm font-bold text-slate-500 mb-2 tracking-wide">
            <span>Administration</span>
            <span className="mx-2">&gt;</span>
            <span className="text-[#1E402F]">Overview</span>
          </div>
          <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Dashboard</h2>
          <p className="text-[15px] text-slate-600 mt-1">High-level metrics and system activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Teams" 
          value={isLoadingTeams ? "..." : teams.length.toString()} 
          icon={Globe} 
          badgeText="Active" 
          badgeColor="bg-[#e0e7ff] text-[#4f46e5]" 
        />
        <KPICard 
          title="Total Players" 
          value={isLoadingPlayers ? "..." : players.length.toString()} 
          icon={Users} 
          badgeText="Registered" 
          badgeColor="bg-[#e7f9eb] text-[#2ebd4f]" 
        />
        <KPICard 
          title="Upcoming Fixtures" 
          value={isLoadingMatches ? "..." : upcomingMatchesCount.toString()} 
          icon={CalendarIcon} 
        />
        <KPICard 
          title="Live Matches" 
          value={isLoadingMatches ? "..." : liveMatchesCount.toString()} 
          icon={MonitorPlay} 
          badgeText="Now Scoring" 
          badgeColor="text-[#d32f2f] bg-[#ffebee] border border-[#ffcdd2]" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-6 h-96 flex flex-col items-center justify-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
             <BarChart2 size={120} />
           </div>
           <div className="w-full flex items-center justify-between absolute top-6 left-6 pr-12">
             <h3 className="text-[18px] font-bold text-slate-900">Traffic & API Usage</h3>
             <div className="flex items-center gap-2">
               <span className="flex items-center text-[12px] font-bold text-slate-500"><div className="w-2 h-2 rounded-full bg-[#2ebd4f] mr-1.5"></div> Success</span>
               <span className="flex items-center text-[12px] font-bold text-slate-500"><div className="w-2 h-2 rounded-full bg-slate-200 mr-1.5"></div> Latency</span>
             </div>
           </div>
           
           <div className="flex items-end justify-between w-full h-52 px-6 gap-4 mt-10 z-10">
              {[
                { label: 'Mon', val1: 45, val2: 30 },
                { label: 'Tue', val1: 65, val2: 40 },
                { label: 'Wed', val1: 85, val2: 50 },
                { label: 'Thu', val1: 55, val2: 35 },
                { label: 'Fri', val1: 90, val2: 60 },
                { label: 'Sat', val1: 100, val2: 70 },
                { label: 'Sun', val1: 75, val2: 45 }
              ].map((day, i) => (
                <div key={i} className="flex flex-col items-center w-full group relative">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-slate-800 text-white text-[11px] font-bold py-1.5 px-3 rounded shadow-lg whitespace-nowrap z-20 pointer-events-none">
                    {day.val1}k Requests
                  </div>
                  
                  {/* Bars */}
                  <div className="flex items-end justify-center w-full gap-1 h-full">
                     <div className="w-full max-w-[24px] bg-[#e7f9eb] group-hover:bg-[#2ebd4f] transition-all duration-300 rounded-t-md relative overflow-hidden" style={{ height: `${day.val1}%` }}>
                       <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#2ebd4f]/20 to-transparent h-1/2"></div>
                     </div>
                     <div className="w-full max-w-[12px] bg-slate-100 group-hover:bg-slate-300 transition-all duration-300 rounded-t-sm" style={{ height: `${day.val2}%` }}></div>
                  </div>
                  
                  {/* Label */}
                  <span className="text-[12px] font-bold text-slate-400 mt-3 group-hover:text-slate-700 transition-colors">{day.label}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-bold text-slate-800">System Health</h3>
          </div>
          
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#2ebd4f] animate-pulse mr-3"></div>
                  <span className="text-[14px] font-bold text-slate-700">Database Connection</span>
                </div>
                <span className="text-[13px] font-bold text-[#2ebd4f]">Stable</span>
             </div>
             
             <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#2ebd4f] animate-pulse mr-3"></div>
                  <span className="text-[14px] font-bold text-slate-700">API Gateway</span>
                </div>
                <span className="text-[13px] font-bold text-[#2ebd4f]">Online</span>
             </div>

             <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#f59e0b] mr-3"></div>
                  <span className="text-[14px] font-bold text-slate-700">Storage Capacity</span>
                </div>
                <span className="text-[13px] font-bold text-slate-500">78% Used</span>
             </div>

             <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center p-3 bg-[#fffbeb] text-[#d97706] rounded border border-[#fef3c7]">
                   <ShieldAlert size={16} className="mr-2" />
                   <span className="text-[13px] font-bold">1 Admin login from unknown IP</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
