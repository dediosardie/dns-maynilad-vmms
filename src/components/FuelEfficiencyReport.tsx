import { Card, Button, Badge } from './ui';

interface FuelEfficiencyAnalysis {
  summary: string;
  insights: string[];
  recommendations: string[];
  costTrends: string;
  efficiencyScore: number;
  anomalies: string[];
}

interface FuelEfficiencyReportProps {
  analysis: FuelEfficiencyAnalysis | null;
  isLoading: boolean;
  onClose: () => void;
  onConfigure?: () => void;
  error?: string;
}

export default function FuelEfficiencyReport({
  analysis,
  isLoading,
  onClose,
  onConfigure,
  error
}: FuelEfficiencyReportProps) {
  // Get efficiency badge variant based on score
  const getEfficiencyBadge = (score: number): { variant: 'success' | 'warning' | 'danger', label: string } => {
    if (score >= 80) return { variant: 'success', label: 'Excellent' };
    if (score >= 60) return { variant: 'warning', label: 'Good' };
    return { variant: 'danger', label: 'Needs Improvement' };
  };

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary mb-2">Analysis Error</h3>
              <p className="text-text-secondary mb-4">{error}</p>
              {error.includes('token') && onConfigure && (
                <Button onClick={onConfigure} variant="primary">
                  Configure GitHub Token
                </Button>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose} variant="secondary">Close</Button>
          </div>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">AI Analysis in Progress</h3>
          <p className="text-text-secondary">GitHub AI Models (GPT-4o) is analyzing your fuel efficiency data...</p>
          <p className="text-text-muted text-sm mt-2">This may take a few moments</p>
        </div>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  const efficiencyBadge = getEfficiencyBadge(analysis.efficiencyScore);

  return (
    <>
      <style>{`
        @media print {
          /* Hide all non-report elements */
          body > *:not(.print-report) {
            display: none !important;
          }
          
          /* Ensure report container is visible */
          .print-report {
            display: block !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
          }
          
          /* Hide action buttons */
          .no-print {
            display: none !important;
          }
          
          /* Adjust card spacing for print */
          .print-report > * {
            page-break-inside: avoid;
            margin-bottom: 20px !important;
          }
          
          /* Remove shadows and adjust colors for print */
          .print-report * {
            box-shadow: none !important;
            background: white !important;
            color: black !important;
          }
          
          /* Preserve badge colors */
          .print-badge-success {
            background: #10b981 !important;
            color: white !important;
            border: 1px solid #059669;
          }
          
          .print-badge-warning {
            background: #f59e0b !important;
            color: white !important;
            border: 1px solid #d97706;
          }
          
          .print-badge-danger {
            background: #ef4444 !important;
            color: white !important;
            border: 1px solid #dc2626;
          }
          
          /* Ensure borders are visible */
          .print-report [class*="border"] {
            border-color: #e5e7eb !important;
          }
          
          /* Preserve icon colors */
          .print-report svg {
            color: #6b7280 !important;
          }
          
          /* Better text rendering */
          .print-report {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
      <div className="space-y-6 max-w-4xl mx-auto print-report">
      {/* Header Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">AI-Driven Fuel Efficiency Report</h2>
                <p className="text-sm text-text-muted">Powered by GitHub AI Models (GPT-4o)</p>
              </div>
            </div>
            <Badge variant={efficiencyBadge.variant} className={`text-base px-4 py-2 print-badge-${efficiencyBadge.variant}`}>
              {efficiencyBadge.label}: {analysis.efficiencyScore}%
            </Badge>
          </div>
          
          <div className="bg-accent-soft border border-accent/20 rounded-lg p-4">
            <p className="text-text-primary leading-relaxed">{analysis.summary}</p>
          </div>
        </div>
      </Card>

      {/* Key Insights */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="text-lg font-semibold text-text-primary">Key Insights</h3>
          </div>
          <ul className="space-y-3">
            {analysis.insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-accent-soft text-accent rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-text-secondary flex-1">{insight}</p>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Recommendations */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-text-primary">Recommendations</h3>
          </div>
          <ul className="space-y-3">
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <p className="text-text-secondary flex-1">{recommendation}</p>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Cost Trends */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <h3 className="text-lg font-semibold text-text-primary">Cost Trends Analysis</h3>
          </div>
          <div className="bg-bg-elevated rounded-lg p-4">
            <p className="text-text-secondary leading-relaxed">{analysis.costTrends}</p>
          </div>
        </div>
      </Card>

      {/* Anomalies (if any) */}
      {analysis.anomalies && analysis.anomalies.length > 0 && (
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-semibold text-text-primary">Anomalies Detected</h3>
            </div>
            <ul className="space-y-3">
              {analysis.anomalies.map((anomaly, index) => (
                <li key={index} className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-text-secondary flex-1">{anomaly}</p>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 no-print">
        <Button onClick={onClose} variant="secondary">Close Report</Button>
        <Button onClick={() => window.print()} variant="primary" size="md" className="inline-flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Report
        </Button>
      </div>
    </div>
    </>
  );
}
