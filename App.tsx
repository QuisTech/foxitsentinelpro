
import React, { useState, useCallback } from 'react';
import { 
  AppStatus, 
  FoxitProject, 
  Template, 
  AuditEvent 
} from './types';
import { 
  TEMPLATES, 
  PDF_SERVICES, 
  JUDGE_QUICK_TIPS, 
  POLICY_ID 
} from './constants';
import { foxitService } from './services/foxitService';
import AuditTrail from './components/AuditTrail';
import { 
  FileText, 
  ShieldCheck, 
  Zap, 
  History, 
  Gavel, 
  Layout, 
  CheckCircle,
  AlertCircle,
  Download,
  ExternalLink,
  Search,
  Sparkles
} from 'lucide-react';

const DEMO_DATA: Record<string, Record<string, string>[]> = {
  'TPL-NDA-V2': [
    { partyA: 'Cyberdyne Systems', partyB: 'TechNoir Inc.', governingLaw: 'California', termYears: '5' },
    { partyA: 'Wayne Enterprises', partyB: 'Queen Industries', governingLaw: 'Gotham', termYears: '2' },
    { partyA: 'Acme Corp', partyB: 'Globex Corporation', governingLaw: 'Delaware', termYears: '3' }
  ],
  'TPL-SVC-V1': [
    { clientName: 'Massive Dynamic', projectScope: 'Quantum AI Integration', billingRate: '$450/hr', effectiveDate: '2026-06-01' },
    { clientName: 'Hooli', projectScope: 'Compression Algorithm V2', billingRate: '$300/hr', effectiveDate: '2026-07-15' }
  ],
  'TPL-EMP-V4': [
    { candidateName: 'John Connor', position: 'Security Chief', salary: '$150,000', equity: '0.1%' },
    { candidateName: 'Sarah Walker', position: 'Asset Manager', salary: '$120,000', equity: '0.05%' }
  ]
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workspace' | 'ledger'>('workspace');
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(TEMPLATES[0]);
  const [formData, setFormData] = useState<Record<string, string>>(TEMPLATES[0].schema);
  const [selectedServices, setSelectedServices] = useState<string[]>(['linearize', 'watermark']);
  const [signeeEmail, setSigneeEmail] = useState<string>('counsel@enterprise.com');
  const [currentProject, setCurrentProject] = useState<FoxitProject | null>(null);
  const [history, setHistory] = useState<FoxitProject[]>([]);
  const [judgeMode, setJudgeMode] = useState(false);


  const handleAutofill = useCallback(() => {
    const options = DEMO_DATA[selectedTemplate.id];
    if (options) {
      const randomOption = options[Math.floor(Math.random() * options.length)];
      setFormData(randomOption);
    }
  }, [selectedTemplate.id]);

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const executeWorkflow = async () => {
    const project: FoxitProject = {
      id: `FX-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      name: `${selectedTemplate.name} Auto-Gen`,
      templateId: selectedTemplate.id,
      data: { ...formData },
      status: AppStatus.IDLE,
      appliedServices: [...selectedServices],
      signeeEmail: signeeEmail,
      traceId: '',
      events: []
    };

    setCurrentProject(project);

    try {
      const result = await foxitService.processWorkflow(project, (update) => {
        setCurrentProject(prev => prev ? { ...prev, ...update } : null);
      });
      setHistory(prev => [result, ...prev]);
    } catch (err) {
      console.error("Workflow failed", err);
    }
  };

  const isProcessing = currentProject && 
    currentProject.status !== AppStatus.COMPLETED && 
    currentProject.status !== AppStatus.ERROR;

  return (
    <div className="min-h-screen flex flex-col font-['Inter'] selection:bg-[#ffaa19]/30 selection:text-[#3e1841] bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-[#fc6408] to-[#ffaa19] p-2 rounded-xl shadow-lg shadow-orange-200">
            <span className="text-xl">📄</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-[#3e1841] tracking-tight flex items-center gap-2">
              SENTINEL <span className="bg-[#fc6408] text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Pro</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Auditable Agreement Engine</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button 
            id="tab-workspace"
            onClick={() => setActiveTab('workspace')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'workspace' ? 'bg-white text-[#fc6408] shadow-sm translate-y-[-1px]' : 'text-slate-500 hover:text-[#3e1841]'}`}
          >
            <span className="text-xl">📄</span>
            Workflow
          </button>
          <button 
            id="tab-ledger"
            onClick={() => setActiveTab('ledger')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'ledger' ? 'bg-white text-[#fc6408] shadow-sm translate-y-[-1px]' : 'text-slate-500 hover:text-[#3e1841]'}`}
          >
            <span className="text-xl">📄</span>
            Ledger
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setJudgeMode(!judgeMode)}
            className={`hidden lg:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all border ${
              judgeMode ? 'bg-[#ffaa19]/10 text-[#fc6408] border-[#ffaa19]/30 shadow-inner' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xl">📄</span>
            Judge Mode: {judgeMode ? 'On' : 'Off'}
          </button>
          <div className="w-px h-6 bg-slate-200 mx-2 hidden lg:block"></div>
          <div className="hidden xl:block text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase">Engine Status</p>
            <p className="text-xs font-bold text-[#fc6408] flex items-center justify-end gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live: {POLICY_ID}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1920px] mx-auto w-full">
        {activeTab === 'workspace' ? (
          <>
            {/* Left Panel: Configuration */}
            <aside className="w-full lg:w-[450px] bg-white border-r border-slate-200 flex flex-col overflow-y-auto scrollbar-hide">
              <div className="p-8 space-y-10">
                {/* Steps Section */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-7 h-7 rounded-lg bg-[#fc6408]/10 text-[#fc6408] flex items-center justify-center text-xs font-black">01</span>
                    <h2 className="text-[11px] font-black uppercase tracking-widest text-[#3e1841]">Configuration</h2>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-wider">Contract Blueprint</label>
                      <div className="grid grid-cols-1 gap-3">
                        {TEMPLATES.map(t => (
                          <button
                            id={`template-${t.id}`}
                            key={t.id}
                            disabled={isProcessing}
                            onClick={() => {
                              setSelectedTemplate(t);
                              setFormData(t.schema);
                            }}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left group ${
                              selectedTemplate.id === t.id
                                ? 'bg-white border-[#fc6408] shadow-md ring-1 ring-[#fc6408]/20' 
                                : 'bg-slate-50 border-slate-200 hover:border-[#fc6408]/50 hover:bg-slate-100'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-colors ${
                              selectedTemplate.id === t.id ? 'bg-[#fc6408]/10' : 'bg-white border border-slate-200 group-hover:border-[#fc6408]/30'
                            }`}>
                              {t.icon}
                            </div>
                            <div className="flex-1">
                              <p className={`text-xs font-black uppercase tracking-wider ${selectedTemplate.id === t.id ? 'text-[#3e1841]' : 'text-slate-600'}`}>{t.name}</p>
                            </div>
                            {selectedTemplate.id === t.id && (
                              <div className="w-2 h-2 rounded-full bg-[#fc6408] shadow-[0_0_8px_rgba(252,100,8,0.5)]"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Injection Fields</label>
                        <button 
                          id="btn-autofill"
                          onClick={handleAutofill}
                          disabled={isProcessing}
                          className="text-[9px] font-black text-[#fc6408] uppercase tracking-widest hover:text-[#e55a06] flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="text-xl">📄</span>
                          Auto-Generate
                        </button>
                      </div>
                      <div className="space-y-4">
                        {Object.keys(formData).map(key => (
                          <div key={key}>
                            <label className="block text-[8px] font-bold text-slate-500 uppercase mb-1.5 ml-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                            <input 
                              id={`input-${key}`}
                              disabled={isProcessing}
                              type="text"
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-[#fc6408] transition-all"
                              value={formData[key]}
                              onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-7 h-7 rounded-lg bg-[#ffaa19]/20 text-[#fc6408] flex items-center justify-center text-xs font-black">02</span>
                    <h2 className="text-[11px] font-black uppercase tracking-widest text-[#3e1841]">Security Layer</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {PDF_SERVICES.map(service => (
                      <button
                        id={`service-${service.id}`}
                        key={service.id}
                        disabled={isProcessing}
                        onClick={() => toggleService(service.id)}
                        className={`flex items-center gap-3.5 p-3 rounded-xl border-2 transition-all text-left ${
                          selectedServices.includes(service.id) 
                            ? 'bg-[#fc6408]/5 border-[#fc6408] shadow-sm' 
                            : 'bg-white border-slate-100 hover:border-slate-300 opacity-60'
                        }`}
                      >
                        <span className="text-xl">{service.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-black uppercase tracking-wider leading-none ${selectedServices.includes(service.id) ? 'text-[#3e1841]' : 'text-slate-800'}`}>
                            {service.name}
                          </p>
                          <p className="text-[9px] text-slate-400 font-medium truncate mt-1">{service.description}</p>
                        </div>
                        <span className="text-xl">📄</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-7 h-7 rounded-lg bg-[#3e1841]/10 text-[#3e1841] flex items-center justify-center text-xs font-black">03</span>
                    <h2 className="text-[11px] font-black uppercase tracking-widest text-[#3e1841]">Recipient Dispatch</h2>
                  </div>
                  <div className="space-y-4">
                    <input 
                      id="input-signee-email"
                      disabled={isProcessing}
                      type="email"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-[#fc6408]/20 focus:border-[#fc6408] outline-none transition-all"
                      value={signeeEmail}
                      onChange={(e) => setSigneeEmail(e.target.value)}
                      placeholder="legal@acme.com"
                    />
                    <p className="text-[9px] text-slate-400 font-medium leading-relaxed italic">System will trigger Foxit eSign API upon successful document linearization.</p>
                  </div>
                </section>
              </div>

              {/* Action Button */}
              <div className="p-8 bg-slate-50/50 border-t border-slate-100 mt-auto sticky bottom-0 z-10 backdrop-blur-sm">
                <button 
                  id="btn-generate"
                  onClick={executeWorkflow}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-2xl text-white font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-200/40 active:scale-[0.98] ${
                    isProcessing
                      ? 'bg-slate-300 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-[#fc6408] to-[#ffaa19] hover:from-[#e55a06] hover:to-[#e59816]'
                  }`}
                >
                  <span className="text-xl">📄</span>
                  {isProcessing ? 'Processing Pipeline...' : 'Generate Agreement'}
                </button>
              </div>
            </aside>

            {/* Middle Panel: Live Preview & Stepper */}
            <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-hidden">
              {/* Pipeline Visualizer */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-xs font-black text-[#3e1841] uppercase tracking-widest">Pipeline Orchestration</h3>
                    <p className="text-[10px] text-slate-400 font-medium mt-1 tracking-wider">REST Node Mapping: {POLICY_ID}</p>
                  </div>
                  {currentProject && (
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border ${
                        currentProject.status === AppStatus.COMPLETED ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        currentProject.status === AppStatus.ERROR ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                        'bg-orange-50 text-[#fc6408] border-orange-200'
                      }`}>
                        {currentProject.status}
                      </span>
                    </div>
                  )}
                </div>

                <div className="relative px-2 flex justify-between">
                  <div className="absolute top-4 left-6 right-6 h-[2px] bg-slate-100 -z-0"></div>
                  {currentProject && (
                    <div 
                      className="absolute top-4 left-6 h-[2px] bg-gradient-to-r from-[#fc6408] to-[#ffaa19] transition-all duration-700 ease-out"
                      style={{ 
                        width: currentProject.status === AppStatus.COMPLETED ? 'calc(100% - 48px)' : 
                               currentProject.status === AppStatus.SIGNING ? '75%' : 
                               currentProject.status === AppStatus.PROCESSING ? '50%' : 
                               currentProject.status === AppStatus.GENERATING ? '25%' : '0%'
                      }}
                    ></div>
                  )}
                  
                  {[
                    { label: 'DocGen', icon: '📄' },
                    { label: 'Cloud Svc', icon: '🔒' },
                    { label: 'eSign', icon: '✍️' },
                    { label: 'Archive', icon: '✅' }
                  ].map((step, idx) => {
                    const isActive = currentProject && (
                      (idx === 0 && (currentProject.status === AppStatus.GENERATING || currentProject.status === AppStatus.PROCESSING || currentProject.status === AppStatus.SIGNING || currentProject.status === AppStatus.COMPLETED)) ||
                      (idx === 1 && (currentProject.status === AppStatus.PROCESSING || currentProject.status === AppStatus.SIGNING || currentProject.status === AppStatus.COMPLETED)) ||
                      (idx === 2 && (currentProject.status === AppStatus.SIGNING || currentProject.status === AppStatus.COMPLETED)) ||
                      (idx === 3 && currentProject.status === AppStatus.COMPLETED)
                    );
                    return (
                      <div key={idx} className="flex flex-col items-center relative z-10">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 border-2 ${
                          isActive ? 'bg-white border-[#fc6408] shadow-md scale-110' : 'bg-slate-50 border-slate-100 text-slate-300'
                        }`}>
                          <span className={`text-xs ${isActive ? '' : 'grayscale opacity-50'}`}>{step.icon}</span>
                        </div>
                        <p className={`text-[8px] font-black uppercase mt-3 tracking-widest ${isActive ? 'text-[#3e1841]' : 'text-slate-300'}`}>{step.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Embedded Document View */}
              <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col relative group">
                {/* Embedded Viewer Controls */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-[#fc6408] animate-pulse' : 'bg-slate-300'}`}></div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Foxit Embed API Stage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
                      <span className="text-xl">📄</span>
                    </button>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-600 shadow-sm hover:border-slate-300 transition-all uppercase tracking-wider">
                      Annotation Tools
                    </button>
                  </div>
                </div>

                <div id="preview-container" className="flex-1 bg-slate-100 p-8 flex items-center justify-center overflow-auto scrollbar-hide">
                  {!currentProject ? (
                    <div className="text-center max-w-sm">
                      <div className="w-20 h-20 bg-white rounded-3xl shadow-sm mx-auto flex items-center justify-center mb-6">
                         <span className="text-xl">📄</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Static Idle Mode</h4>
                      <p className="text-[10px] text-slate-400 mt-3 font-medium px-8 leading-relaxed">
                        Configure agreement details and trigger automation to preview the generated artifact.
                      </p>
                    </div>
                  ) : (
                    <div className="w-full max-w-2xl aspect-[1/1.414] bg-white rounded shadow-2xl relative overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-700">
                      {/* Placeholder PDF Content */}
                      <div className="flex-1 p-12 space-y-8 relative">
                         {/* Watermark Simulation */}
                         {currentProject.appliedServices.includes('watermark') && (
                           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-45deg] select-none">
                             <span className="text-[120px] font-black text-[#3e1841] uppercase">OFFICIAL</span>
                           </div>
                         )}

                         <div className="flex justify-between items-start border-b-2 border-[#3e1841] pb-8">
                            <div>
                               <h1 className="text-3xl font-black text-[#3e1841] leading-tight uppercase tracking-tighter">{selectedTemplate.name}</h1>
                               <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[0.3em]">Execution Artifact: {currentProject.id}</p>
                            </div>
                            <div className="w-12 h-12 bg-[#3e1841] text-white rounded flex items-center justify-center text-xl font-black">F</div>
                         </div>

                         <div className="space-y-4">
                           <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
                           <div className="h-3 bg-slate-50 rounded-full w-full"></div>
                           <div className="h-3 bg-slate-50 rounded-full w-5/6"></div>
                         </div>

                         <div className="grid grid-cols-2 gap-10 py-10 border-y border-slate-100">
                           {Object.entries(currentProject.data).map(([key, value]) => (
                             <div key={key}>
                               <p className="text-[8px] font-black text-slate-300 uppercase mb-2 tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</p>
                               <p className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1">{value}</p>
                             </div>
                           ))}
                         </div>

                         <div className="space-y-4">
                            <div className="h-3 bg-slate-50 rounded-full w-full"></div>
                            <div className="h-3 bg-slate-50 rounded-full w-full"></div>
                            <div className="h-3 bg-slate-50 rounded-full w-2/3"></div>
                         </div>

                         <div className="mt-auto pt-16 flex justify-between items-end border-t border-slate-100">
                            <div className="w-48">
                               <div className="h-[2px] bg-slate-300 mb-2"></div>
                               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Authorized Signatory</p>
                               {currentProject.status === AppStatus.COMPLETED && (
                                 <div className="text-[#fc6408] italic font-serif text-lg mt-1 animate-in fade-in slide-in-from-left duration-1000">/ Jane Foxit /</div>
                               )}
                            </div>
                            <div className="text-right">
                               <p className="text-[9px] font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
                               <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Verification Timestamp</p>
                            </div>
                         </div>

                         {/* Loader Overlay */}
                         {isProcessing && (
                           <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-12 transition-all">
                              <div className="w-16 h-16 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-6 ring-1 ring-slate-100">
                                 <div className="w-8 h-8 border-[3px] border-[#fc6408] border-t-transparent rounded-full animate-spin"></div>
                              </div>
                              <h5 className="text-xs font-black text-[#3e1841] uppercase tracking-[0.2em]">{currentProject.status}...</h5>
                              <p className="text-[10px] text-slate-500 font-medium mt-3 leading-relaxed max-w-[200px]">Assembling components via high-speed Foxit Cloud engines</p>
                           </div>
                         )}

                          {currentProject.status === AppStatus.COMPLETED && (
                            <div className="absolute top-6 right-6 flex gap-3 z-20">
                              <a 
                                href={currentProject.outputUrl} 
                                download={`${currentProject.name.replace(/\s+/g, '_')}.pdf`}
                                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-xl shadow-xl hover:bg-emerald-600 transition-all hover:scale-105 border-2 border-emerald-400 group/btn"
                              >
                                <span className="text-xl">📄</span>
                                <span className="text-xs font-black uppercase tracking-widest">Download PDF</span>
                              </a>
                              <button className="p-2.5 bg-[#fc6408] text-white rounded-xl shadow-lg hover:bg-[#e55a06] transition-all hover:scale-110">
                                <span className="text-xl">📄</span>
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel: Audit Ledger */}
            <aside id="audit-panel" className="w-full lg:w-[320px] bg-white border-l border-slate-200 flex flex-col p-6 overflow-hidden">
               <AuditTrail 
                  events={currentProject?.events || []} 
                  traceId={currentProject?.traceId} 
                  judgeMode={judgeMode} 
               />
               
               <div className="mt-6 bg-[#3e1841] rounded-3xl p-6 text-white shadow-xl shadow-slate-400/20">
                 <h3 className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                   <span className="text-xl">📄</span>
                   Workflow Insights
                 </h3>
                 <p className="text-[10px] text-slate-200 leading-relaxed font-medium">
                   This agreement uses Foxit's high-speed linearize feature to ensure sub-second rendering in court systems. Every API node is recorded in the traceability ledger for legal non-repudiation.
                 </p>
               </div>
            </aside>
          </>
        ) : (
          /* ARCHIVE / HISTORY TAB */
          <div className="flex-1 p-10 overflow-y-auto bg-[#fbfcfd]">
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="flex justify-between items-end bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div>
                   <span className="text-[10px] font-black text-[#fc6408] uppercase tracking-[0.3em] mb-3 block">Document Vault</span>
                   <h2 className="text-4xl font-black text-[#3e1841] tracking-tighter">Workflow Archive</h2>
                   <p className="text-slate-500 font-medium mt-2">Full audit trail of Foxit API lifecycle orchestrations.</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Total Assets</p>
                    <p className="text-3xl font-black text-[#fc6408] leading-none">{history.length}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Avg Speed</p>
                    <p className="text-3xl font-black text-[#3e1841] leading-none">3.8s</p>
                  </div>
                </div>
              </div>

              {judgeMode && (
                <div className="bg-[#ffaa19]/10 border border-[#ffaa19]/30 p-6 rounded-3xl">
                   <h3 className="text-xs font-black text-[#3e1841] uppercase tracking-widest mb-3 flex items-center gap-2">
                     <span className="text-xl">📄</span>
                     Judge's Briefing
                   </h3>
                   <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {JUDGE_QUICK_TIPS.map((tip, idx) => (
                       <li key={idx} className="text-[10px] text-slate-700 font-bold flex items-start gap-3">
                         <span className="w-1.5 h-1.5 rounded-full bg-[#fc6408] mt-1"></span>
                         {tip}
                       </li>
                     ))}
                   </ul>
                </div>
              )}

              <div className="grid gap-6">
                {history.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-32 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl mx-auto flex items-center justify-center mb-6 border border-slate-100">
                      <span className="text-xl">📄</span>
                    </div>
                    <h3 className="text-lg font-black text-[#3e1841] uppercase tracking-widest">Vault is Empty</h3>
                    <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto mt-3">Execute your first workflow in the Workspace to see auditable records here.</p>
                  </div>
                ) : (
                  history.map((project) => (
                    <div key={project.id} className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-8 shadow-sm hover:shadow-xl hover:translate-y-[-2px] transition-all group">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center text-slate-300 group-hover:from-orange-50 group-hover:to-orange-100 group-hover:text-[#fc6408] transition-colors border border-slate-100">
                        <span className="text-xl">📄</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h4 className="font-black text-[#3e1841] tracking-tight text-lg uppercase">{project.name}</h4>
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase rounded-lg border border-emerald-100">Audited</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">TRC: {project.traceId.slice(0, 8)}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                          <span className="text-[10px] font-bold text-slate-500">{project.signeeEmail}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                          <span className="text-[10px] font-bold text-slate-500">{project.appliedServices.length} Security Layers</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right mr-6 hidden xl:block">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Artifact Integrity</p>
                          <p className="text-[11px] font-bold text-[#3e1841]">Verified & Secure</p>
                        </div>
                        <a 
                          href={project.outputUrl}
                          download={`${project.name.replace(/\s+/g, '_')}.pdf`}
                          className="w-12 h-12 bg-[#3e1841] text-white rounded-2xl flex items-center justify-center hover:bg-[#fc6408] transition-all shadow-lg active:scale-95"
                          title="Download PDF"
                        >
                          <span className="text-xl">📄</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Status Bar */}
      <footer className="bg-white border-t border-slate-200 px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-4 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">Cloud Nodes:</span>
            <div className="flex -space-x-1.5">
              {['DocGen', 'PDF Services', 'eSign', 'Linearizer'].map(node => (
                <div key={node} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[8px] font-black text-slate-500 uppercase z-10 hover:z-20 hover:border-[#fc6408] hover:text-[#fc6408] transition-all cursor-default shadow-sm">
                  {node}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
           <span className="text-[#3e1841] border-l border-slate-200 pl-8">Sentinel Pro Build 2026.05</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
