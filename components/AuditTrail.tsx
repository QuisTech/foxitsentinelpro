
import React from 'react';
import { AuditEvent } from '../types';

interface AuditTrailProps {
  events: AuditEvent[];
  traceId?: string;
  judgeMode: boolean;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ events, traceId, judgeMode }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Traceability Ledger</h3>
          {traceId && (
            <p className="text-[10px] font-mono text-slate-400 mt-1">UUID: {traceId.slice(0, 18)}...</p>
          )}
        </div>
        <div className={`px-2 py-1 rounded text-[9px] font-black uppercase ${judgeMode ? 'bg-[#ffaa19]/20 text-[#fc6408]' : 'bg-slate-100 text-slate-500'}`}>
          {judgeMode ? 'Judge Mode Active' : 'Standard View'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <div className="w-10 h-10 border-2 border-dashed border-slate-300 rounded-lg mb-3"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Awaiting Sequence...</p>
          </div>
        ) : (
          events.map((event, idx) => (
            <div key={event.id} className="relative pl-6 border-l-2 border-slate-100 pb-2">
              <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                event.status === 'success' ? 'bg-emerald-500' : 
                event.status === 'error' ? 'bg-rose-500' : 'bg-[#3e1841]'
              }`}>
                {event.status === 'success' && (
                  <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              
              <div className="flex justify-between items-start mb-1">
                <span className="text-[9px] font-black text-slate-400 uppercase">{event.step}</span>
                <span className="text-[9px] font-mono text-slate-300">{new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
              
              <p className="text-xs font-bold text-slate-700 leading-tight">{event.action}</p>
              
              {judgeMode && event.metadata && (
                <div className="mt-2 bg-[#3e1841] rounded-lg p-2 overflow-hidden">
                  <pre className="text-[9px] font-mono text-emerald-400 whitespace-pre-wrap break-all">
                    {JSON.stringify(event.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )).reverse()
        )}
      </div>
    </div>
  );
};

export default AuditTrail;
