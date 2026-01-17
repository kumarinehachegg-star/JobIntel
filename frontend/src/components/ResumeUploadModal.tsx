import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { Loader2, Upload, CheckCircle2, AlertCircle, FileText, Briefcase, TrendingUp } from 'lucide-react';

interface Job {
  _id: string;
  title: string;
  company?: string;
  location?: string;
  matchScore?: number;
  description?: string;
}

interface ResumeUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResumeUploadModal = ({ open, onOpenChange }: ResumeUploadModalProps) => {
  const { user } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [matches, setMatches] = useState<Job[]>([]);
  const [resumeStatus, setResumeStatus] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF or DOCX file');
        return;
      }
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get token from auth store
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      // Upload resume
      const formData = new FormData();
      formData.append('resume', file);

      const uploadResponse = await fetch('/api/resume/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        let errorMessage = 'Failed to upload resume';
        try {
          const contentType = uploadResponse.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            const errorData = await uploadResponse.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else {
            errorMessage = `Server error: ${uploadResponse.status} ${uploadResponse.statusText}`;
          }
        } catch (e) {
          errorMessage = `Server error: ${uploadResponse.status} ${uploadResponse.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const uploadResult = await uploadResponse.json();
      setSuccess(true);
      setResumeStatus(uploadResult);

      // Fetch matching jobs
      const matchesResponse = await fetch('/api/resume/matching-jobs', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (matchesResponse.ok) {
        const matchesData = await matchesResponse.json();
        setMatches(Array.isArray(matchesData) ? matchesData : matchesData.matches || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload resume');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setMatches([]);
    setResumeStatus(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload Your Resume
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!success ? (
            <>
              {/* Upload Section */}
              <div className="space-y-4">
                <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <Label htmlFor="resume-file" className="text-sm font-medium text-gray-700 block mb-2">
                    Choose your resume (PDF or DOCX)
                  </Label>
                  <Input
                    id="resume-file"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="text-sm"
                  />
                  {file && (
                    <p className="mt-3 text-sm text-green-600 font-medium">
                      ✓ {file.name} selected
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Error</p>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-sm text-blue-900 mb-2">How it works:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Upload your resume (PDF or DOCX)</li>
                    <li>✓ AI analyzes your skills and experience</li>
                    <li>✓ Get matched with relevant job openings</li>
                    <li>✓ See match scores for each job</li>
                  </ul>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={handleClose} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Resume
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              {/* Success Section */}
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Resume uploaded successfully!</p>
                    <p className="text-sm text-green-700 mt-1">
                      We found {matches.length} matching job{matches.length !== 1 ? 's' : ''} for you.
                    </p>
                  </div>
                </div>

                {/* Resume Status */}
                {resumeStatus && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <h4 className="font-medium text-sm">Resume Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Status</p>
                        <Badge className="mt-1 bg-green-100 text-green-800">
                          {resumeStatus.status || 'Processed'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-gray-600">Parsed At</p>
                        <p className="font-medium text-sm mt-1">
                          {resumeStatus.parsedAt ? new Date(resumeStatus.parsedAt).toLocaleDateString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Matching Jobs */}
                {matches.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Your Matching Jobs
                    </h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {matches.slice(0, 10).map((job) => (
                        <div
                          key={job._id}
                          className="border rounded-lg p-3 hover:bg-gray-50 transition"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{job.title}</h5>
                              {job.company && (
                                <p className="text-xs text-gray-600 mt-1">
                                  <Building2 className="h-3 w-3 inline mr-1" />
                                  {job.company}
                                </p>
                              )}
                              {job.location && (
                                <p className="text-xs text-gray-600">
                                  📍 {job.location}
                                </p>
                              )}
                            </div>
                            {job.matchScore && (
                              <div className="text-right">
                                <Badge
                                  className={
                                    job.matchScore >= 80
                                      ? 'bg-green-100 text-green-800'
                                      : job.matchScore >= 70
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }
                                >
                                  {Math.round(job.matchScore)}%
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {matches.length > 10 && (
                        <p className="text-xs text-gray-500 text-center py-2">
                          +{matches.length - 10} more matches
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      No matching jobs found yet. Check back soon as new jobs are posted!
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button onClick={handleClose} className="bg-blue-600 hover:bg-blue-700">
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
