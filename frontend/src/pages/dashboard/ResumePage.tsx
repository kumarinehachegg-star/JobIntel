import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ResumeUploadModal } from '@/components/ResumeUploadModal';

interface ResumeData {
  id: string;
  status: string;
  parsedAt: string;
  format: string;
  matchingScore?: number;
  potentialMatches?: number;
}

const ResumePage = () => {
  const { user } = useAuthStore();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchResumeData();
  }, [user]);

  const fetchResumeData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/resume/status', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setResumeData(data);
        setError('');
      } else if (response.status === 404) {
        setResumeData(null);
      } else {
        setError('Failed to fetch resume data');
      }
    } catch (err) {
      console.error('Failed to fetch resume', err);
      setError('Error loading resume');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUploaded = () => {
    setShowUploadModal(false);
    fetchResumeData();
  };

  const deleteResume = async () => {
    if (!resumeData) return;
    
    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/resume/${resumeData.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setResumeData(null);
        setError('');
      } else {
        setError('Failed to delete resume');
      }
    } catch (err) {
      console.error('Failed to delete resume', err);
      setError('Error deleting resume');
    } finally {
      setDeleting(false);
    }
  };

  const downloadResume = async () => {
    if (!resumeData) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/resume/${resumeData.id}/download`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `resume.${resumeData.format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to download resume', err);
      setError('Error downloading resume');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-muted rounded-xl p-8 h-40 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-muted rounded-xl p-8 h-40 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Resume & CV</h1>
          <p className="text-muted-foreground">Manage your resume for job matching</p>
        </div>
        <Button
          onClick={() => setShowUploadModal(true)}
          className="gap-2 bg-gradient-to-r from-primary to-accent w-full sm:w-auto"
        >
          <FileText className="h-4 w-4" />
          {resumeData ? 'Update Resume' : 'Upload Resume'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-900 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <ResumeUploadModal
        open={showUploadModal}
        onOpenChange={(open) => {
          setShowUploadModal(open);
          if (!open) {
            handleResumeUploaded();
          }
        }}
      />

      {resumeData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resume Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-green-100 flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 mb-1">Resume Successfully Uploaded ✓</h4>
                  <p className="text-sm text-green-800 mb-2">
                    Your resume was processed on {new Date(resumeData.parsedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-green-800">
                    Status: <strong>{resumeData.status || 'Processed'}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Resume Details */}
            <div className="space-y-4">
              <h4 className="font-semibold">Resume Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border/40">
                  <p className="text-xs text-muted-foreground mb-1">File Format</p>
                  <p className="font-semibold">{resumeData.format?.toUpperCase() || 'PDF'}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/40">
                  <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                  <p className="font-semibold">{new Date(resumeData.parsedAt).toLocaleDateString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/40">
                  <p className="text-xs text-muted-foreground mb-1">Parsing Status</p>
                  <Badge variant="default">Complete</Badge>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/40">
                  <p className="text-xs text-muted-foreground mb-1">Embedding Status</p>
                  <Badge variant="default">Ready</Badge>
                </div>
              </div>
            </div>

            {/* Matching Stats */}
            {resumeData.matchingScore !== undefined && (
              <div className="bg-card rounded-xl p-6 border border-border/40">
                <h4 className="font-semibold mb-4">Matching Statistics</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Resume Quality Score</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent"
                          style={{ width: `${Math.min(resumeData.matchingScore, 100)}%` }}
                        />
                      </div>
                      <span className="font-semibold">{resumeData.matchingScore}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Potential Matches: <strong>{resumeData.potentialMatches || 0}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={downloadResume}
                className="gap-2 flex-1 sm:flex-none"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                onClick={() => setShowUploadModal(true)}
                variant="outline"
                className="gap-2 flex-1 sm:flex-none"
              >
                <FileText className="h-4 w-4" />
                Replace
              </Button>
              <Button
                variant="destructive"
                onClick={deleteResume}
                disabled={deleting}
                className="gap-2 flex-1 sm:flex-none"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Tips Sidebar */}
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-4">Tips for Better Matching 💡</h4>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>✓ Include relevant keywords from your field</li>
                <li>✓ List recent projects and achievements</li>
                <li>✓ Highlight technical skills clearly</li>
                <li>✓ Use standard formatting and fonts</li>
                <li>✓ Keep it to 1-2 pages for best results</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-xl p-12 border border-border/40 text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-semibold mb-2">No Resume Uploaded</p>
          <p className="text-muted-foreground mb-6">Upload your resume to get better job matches powered by AI</p>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="gap-2 bg-gradient-to-r from-primary to-accent"
          >
            <FileText className="h-4 w-4" />
            Upload Resume Now
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResumePage;
