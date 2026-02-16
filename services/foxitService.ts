import { AppStatus, AuditEvent, FoxitProject } from '../types';

export const foxitService = {
  async processWorkflow(
    project: FoxitProject,
    onUpdate: (update: Partial<FoxitProject>) => void
  ): Promise<FoxitProject> {
    const traceId = crypto.randomUUID();
    const events: AuditEvent[] = [];
    const BACKEND_URL = 'http://localhost:3001/api';

    const addEvent = (step: string, action: string, status: 'success' | 'info' | 'error' = 'success', metadata?: any) => {
      const event: AuditEvent = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        step,
        action,
        status,
        metadata
      };
      events.push(event);
      onUpdate({ events: [...events] });
    };

    try {
      // 1. INITIALIZATION
      onUpdate({ status: AppStatus.GENERATING, traceId });
      addEvent('ORCHESTRATOR', 'Workflow Initialized', 'info', { traceId, template: project.templateId });
      
      // 2. DOC GEN (Real Call)
      addEvent('DOCGEN-API', 'POST /api/generate', 'info', { input: project.data });
      
      const genResponse = await fetch(`${BACKEND_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: project.templateId,
          data: project.data,
          services: project.appliedServices
        })
      });

      if (!genResponse.ok) throw new Error('Document Generation Failed');
      const genResult = await genResponse.json();
      let currentPdfBase64 = genResult.pdfBase64;

      addEvent('DOCGEN-API', 'Generation Successful', 'success', { 
        size_bytes: Math.ceil((currentPdfBase64.length * 3) / 4),
        format: 'pdf'
      });

      // 3. CLOUD SERVICES (Real Call)
      if (project.appliedServices.length > 0) {
        onUpdate({ status: AppStatus.PROCESSING });
        addEvent('CLOUD-SERVICES', `Applying ${project.appliedServices.length} services`, 'info');

        const procResponse = await fetch(`${BACKEND_URL}/process`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pdfBase64: currentPdfBase64,
            services: project.appliedServices
          })
        });

        if (!procResponse.ok) throw new Error('PDF Processing Failed');
        const procResult = await procResponse.json();
        currentPdfBase64 = procResult.pdfBase64;
        
        addEvent('CLOUD-SERVICES', 'Processing Complete', 'success', {
          services: project.appliedServices
        });
      }

      // 4. ESIGN (Still Mocked as we lack credentials)
      onUpdate({ status: AppStatus.SIGNING });
      addEvent('ESIGN-API', `Creating Envelope for ${project.signeeEmail}`, 'success', {
        recipient_id: 'rec_88291',
        note: 'Mocked for demo - eSign API requires separate credentials'
      });
      await new Promise(resolve => setTimeout(resolve, 800)); // Short mock delay

      // 5. COMPLETION - Create Blob URL
      const binaryString = window.atob(currentPdfBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const finalUrl = URL.createObjectURL(blob);

      addEvent('VAULT', 'Artifact Archived', 'success', { 
        uri: 'blob:secure-store',
        size: blob.size
      });

      const finalProject = {
        ...project,
        status: AppStatus.COMPLETED,
        events: [...events],
        outputUrl: finalUrl,
        traceId
      };

      onUpdate(finalProject);
      return finalProject;

    } catch (error) {
      console.error(error);
      addEvent('CRITICAL', 'Pipeline Failure', 'error', { error: String(error) });
      onUpdate({ status: AppStatus.ERROR });
      throw error;
    }
  }
};
