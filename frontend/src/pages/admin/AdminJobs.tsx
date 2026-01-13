import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Check,
  X,
  Eye,
  Edit,
  Trash2,
  Upload,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { adminJobs } from '@/data/adminMockData';
import { cn } from '@/lib/utils';
import { parseJobText, ParsedJobData } from '@/services/aiJobParser';
import { JobPreviewDialog } from '@/components/admin/JobPreviewDialog';
import { useToast } from '@/hooks/use-toast';
import { useJobsStore } from '@/store/jobsStore';

// use ParsedJobData from aiJobParser

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-blue-100 text-blue-800 border-blue-200',
  active: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  expired: 'bg-gray-100 text-gray-800 border-gray-200',
};

const sourceColors: Record<string, string> = {
  manual: 'bg-purple-100 text-purple-800',
  crawler: 'bg-teal-100 text-teal-800',
  api: 'bg-indigo-100 text-indigo-800',
};

export default function AdminJobs() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [rawJobText, setRawJobText] = useState('');
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [parsedJob, setParsedJob] = useState<ParsedJobData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { publishedJobs, publishJob } = useJobsStore();

  const [backendJobs, setBackendJobs] = useState<any[]>([]);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [loadingBackend, setLoadingBackend] = useState(false);

  const fetchBackendJobs = async () => {
    setLoadingBackend(true);
    setBackendError(null);
    try {
      const response = await fetch('/api/jobs', { cache: 'no-store' });
      if (response.ok) {
        const jobs = await response.json();
        setBackendJobs(jobs || []);
        console.debug('Admin: fetched', Array.isArray(jobs) ? jobs.length : 0, 'backend jobs');
      } else {
        setBackendJobs([]);
        setBackendError(`Status ${response.status}`);
      }
    } catch (err: any) {
      setBackendJobs([]);
      setBackendError(err?.message || String(err));
    } finally {
      setLoadingBackend(false);
    }
  };

  useEffect(() => {
    fetchBackendJobs();
  }, []);

  // Handlers for admin actions
  const handleDelete = async (id: string, source?: string) => {
    try {
      if (source === 'manual') {
        // local store
        // publishedJobs in store have numeric-ish ids (string timestamps)
        // try remove
        const { removeJob } = useJobsStore.getState();
        removeJob(id);
        toast({ title: 'Deleted locally', description: 'Job removed from local store' });
        // also refetch backend to be safe
        fetchBackendJobs();
        return;
      }

      const resp = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (resp.ok) {
        toast({ title: 'Deleted', description: 'Job deleted from backend' });
        fetchBackendJobs();
      } else {
        toast({ title: 'Delete failed', description: `Status ${resp.status}`, variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: String(err), variant: 'destructive' });
    }
  };

  const handleApprove = async (id: string, source?: string) => {
    try {
      if (source === 'manual') {
        useJobsStore.getState().updateJobStatus(id, 'active');
        toast({ title: 'Approved locally' });
        return;
      }
      const resp = await fetch(`/api/jobs/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'active' }) });
      if (resp.ok) {
        toast({ title: 'Approved' });
        fetchBackendJobs();
      } else {
        toast({ title: 'Approve failed', description: `Status ${resp.status}`, variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: String(err), variant: 'destructive' });
    }
  };

  const handleReject = async (id: string, source?: string) => {
    try {
      if (source === 'manual') {
        useJobsStore.getState().updateJobStatus(id, 'rejected');
        toast({ title: 'Rejected locally' });
        return;
      }
      const resp = await fetch(`/api/jobs/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'rejected' }) });
      if (resp.ok) {
        toast({ title: 'Rejected' });
        fetchBackendJobs();
      } else {
        toast({ title: 'Reject failed', description: `Status ${resp.status}`, variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: String(err), variant: 'destructive' });
    }
  };

  const combinedJobs = useMemo(() => {
    // map publishedJobs from store to admin row shape
    const fromPublished = publishedJobs.map((pj) => ({
      id: pj.id,
      title: pj.title,
      company: pj.company,
      status: pj.status || 'active',
      source: 'manual',
      applicants: pj.applicantsCount || 0,
      postedAt: pj.createdAt,
      deadline: pj.deadline || null,
    }));

    const fromBackend = backendJobs.map((bj: any) => ({
      id: bj._id || bj.id,
      title: bj.title,
      company: bj.meta?.company || (typeof bj.company === 'string' ? bj.company : 'Company'),
      status: bj.status || 'active',
      source: bj.source || (bj.meta?.source ? bj.meta.source : 'api'),
      applicants: bj.applicantsCount || 0,
      postedAt: bj.createdAt || bj.postedAt,
      deadline: bj.deadline || null,
    }));

    const result = [...adminJobs, ...fromPublished, ...fromBackend];
    console.debug('Admin: combined jobs counts', { mock: adminJobs.length, published: fromPublished.length, backend: fromBackend.length, total: result.length });
    return result;
  }, [publishedJobs, backendJobs]);

  const filteredJobs = combinedJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (String(job.company) || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAiParse = async () => {
    setError(null);
    setIsLoading(true);
    try {
      // Use local AI parser (frontend)
      const parsed = parseJobText(rawJobText);
      setParsedJob(parsed);
      setIsAiDialogOpen(false);
      setIsPreviewOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse job text');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishJob = async () => {
    if (!parsedJob) return;
    
    setIsLoading(true);
    try {
      // Try to publish to backend if available, otherwise save locally
      try {
        const response = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: parsedJob.title,
            company: parsedJob.company,
            description: parsedJob.description,
            location: parsedJob.location,
            isRemote: parsedJob.isRemote,
            salary: parsedJob.salary,
            stipend: parsedJob.stipend,
            techStack: parsedJob.techStack,
            tags: parsedJob.tags,
            eligibility: parsedJob.eligibility,
            experience: parsedJob.experience,
            batch: parsedJob.batch,
            applyLink: (parsedJob as any).applyLink || undefined,
            status: 'active',
            rawText: rawJobText,
          }),
        });
        if (response.ok) {
          const created = await response.json();
          console.log('Job published to backend', created._id || created.id);
          // refresh backend jobs listing in admin
          fetchBackendJobs();
          setIsPreviewOpen(false);
          setRawJobText('');
          setParsedJob(null);
          toast({
            title: 'Job Published! 🎉',
            description: `"${parsedJob.title}" has been published and is now visible in the jobs listing.`,
            duration: 4000,
          });
        } else {
          const text = await response.text().catch(() => '');
          throw new Error(`Backend returned ${response.status} ${text}`);
        }
      } catch (backendErr) {
        console.log('Backend not available or failed; not saving locally:', backendErr);
        toast({ title: 'Publish failed', description: String(backendErr), variant: 'destructive' });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish job');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to publish job',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Job Management</h1>
          <p className="text-muted-foreground">Manage and approve job listings</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI Parse
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Job Parser
                </DialogTitle>
                <DialogDescription>
                  Paste raw job text or a job link. AI will automatically extract and structure the job details.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="rawJob">Raw Job Text or URL</Label>
                  <Textarea
                    id="rawJob"
                    placeholder="Paste job description text or a careers page URL..."
                    value={rawJobText}
                    onChange={(e) => setRawJobText(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAiDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAiParse} className="gap-2" disabled={isLoading || !rawJobText.trim()}>
                  <Sparkles className="h-4 w-4" />
                  {isLoading ? 'Parsing...' : 'Parse with AI'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{combinedJobs.filter(j => j.status === 'pending').length}</div>
            <p className="text-sm text-muted-foreground">Pending Approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{combinedJobs.filter(j => j.status === 'active').length}</div>
            <p className="text-sm text-muted-foreground">Active Jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{combinedJobs.reduce((acc, j) => acc + (j.applicants || 0), 0)}</div>
            <p className="text-sm text-muted-foreground">Total Applicants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{combinedJobs.filter(j => j.source === 'crawler').length}</div>
            <p className="text-sm text-muted-foreground">From Crawlers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Jobs</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-[300px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('capitalize', statusColors[job.status])}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn('capitalize', sourceColors[job.source])}>
                        {job.source}
                      </Badge>
                    </TableCell>
                    <TableCell>{job.applicants}</TableCell>
                    <TableCell>{job.postedAt}</TableCell>
                    <TableCell>{job.deadline || '-'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {job.status === 'pending' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-green-600" onSelect={() => handleApprove(job.id, job.source)}>
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onSelect={() => handleReject(job.id, job.source)}>
                                <X className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onSelect={() => handleDelete(job.id, job.source)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Job Preview Dialog */}
      <JobPreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        parsedJob={parsedJob}
        isLoading={isLoading}
        onPublish={handlePublishJob}
      />
    </div>
  );
}
