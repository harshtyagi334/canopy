import { Project } from '../types';

/**
 * Triggers the browser's native print-to-PDF utility with CSS print media queries.
 * Automatically formats document title so that browser "Save as PDF" uses a formal statutory naming standard.
 */
export function triggerPrintReport(project?: Project): void {
  const originalTitle = document.title;
  
  if (project) {
    const formattedId = project.id.toUpperCase().replace(/[^A-Z0-9]/g, '_');
    const timestamp = new Date().toISOString().split('T')[0];
    document.title = `GeoAudit_AI_Compliance_Report_${formattedId}_${timestamp}`;
  } else {
    document.title = `GeoAudit_AI_Statutory_Compliance_Audit_Report_${new Date().toISOString().split('T')[0]}`;
  }

  // Brief timeout to ensure any state changes/DOM elements are rendered
  setTimeout(() => {
    window.print();
    
    // Restore original document title after print dialog closes
    const restoreTitle = () => {
      document.title = originalTitle;
      window.removeEventListener('afterprint', restoreTitle);
    };
    
    window.addEventListener('afterprint', restoreTitle);
    
    // Fallback restoration in case afterprint isn't fired
    setTimeout(() => {
      document.title = originalTitle;
    }, 2000);
  }, 100);
}
