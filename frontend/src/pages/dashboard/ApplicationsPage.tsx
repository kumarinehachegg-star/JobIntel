import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Building2, ExternalLink, Trash2, AlertCircle, Loader2 } from 'lucide-react';

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  location: string;
  appliedAt: string;
  status: 'applied' | 'reviewed' | 'interview' | 'rejected' | 'offer';
  salary?: string;
  companyLogo?: string;
}

const ApplicationsPage = () => {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/applications', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(Array.isArray(data) ? data : []);
        setError('');
      } else {
        setError('Failed to load applications');
      }
    } catch (err) {
      console.error('Failed to fetch applications', err);
      setError('Error loading applications');
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      setDeleting(id);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setApplications((prev) => prev.filter((app) => app.id !== id));
        setError('');
      } else {
        setError('Failed to delete application');
      }
    } catch (err) {
      console.error('Failed to delete application', err);
      setError('Error deleting application');
    } finally {
      setDeleting(null);
    }
  };

  const updateApplicationStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedApp = await response.json();
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? updatedApp : app))
        );
        setError('');
      } else {
        setError('Failed to update application');
      }
    } catch (err) {
      console.error('Failed to update application', err);
      setError('Error updating application');
    }
  };

  const statusConfig: Record<string, { badge: string; color: string; icon: string }> = {
    applied: { badge: 'Applied', color: 'bg-blue-50 text-blue-900 border-blue-200', icon: '📤' },
    reviewed: { badge: 'Under Review', color: 'bg-purple-50 text-purple-900 border-purple-200', icon: '👀' },
    interview: { badge: 'Interview', color: 'bg-yellow-50 text-yellow-900 border-yellow-200', icon: '🎙️' },
    rejected: { badge: 'Rejected', color: 'bg-red-50 text-red-900 border-red-200', icon: '❌' },
    offer: { badge: 'Offer', color: 'bg-green-50 text-green-900 border-green-200', icon: '✅' },
  };

  const filteredApplications = filter === 'all'
    ? applications
    : applications.filter((app) => app.status === filter);

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === 'applied').length,
    interview: applications.filter((a) => a.status === 'interview').length,
    offer: applications.filter((a) => a.status === 'offer').length,
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-10 bg-muted rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Job Applications</h1>
        <p className="text-muted-foreground">Track and manage your job applications in real-time</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-900 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { id: 'total', label: 'Total Applications', value: stats.total, icon: '📊', color: 'from-blue-600 to-blue-400' },
          { id: 'applied', label: 'Applied', value: stats.applied, icon: '📤', color: 'from-purple-600 to-purple-400' },
          { id: 'interviews', label: 'Interviews', value: stats.interview, icon: '🎙️', color: 'from-yellow-600 to-yellow-400' },
          { id: 'offers', label: 'Offers', value: stats.offer, icon: '✅', color: 'from-green-600 to-green-400' },
        ].map((stat) => (
          <div
            key={stat.id}
            className={`bg-gradient-to-br ${stat.color} text-white rounded-xl p-6`}
          >
            <p className="text-sm opacity-90 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter and List */}
      <div className="bg-card rounded-xl border border-border/40 overflow-hidden">
        {/* Filter Bar */}
        <div className="border-b border-border/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="font-semibold">Applications</h3>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="reviewed">Under Review</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Applications List */}
        <div className="divide-y divide-border/40">
          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-2">No applications found</p>
              <p className="text-sm text-muted-foreground">Start applying to jobs to see them here</p>
            </div>
          ) : (
            filteredApplications.map((app) => {
              const config = statusConfig[app.status] || { badge: 'Applied', color: 'bg-blue-50 text-blue-900 border-blue-200', icon: '📤' };
              return (
                <div key={app.id} className="p-5 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1 w-full">
                      {/* Job Info */}
                      <div className="mb-3">
                        <h3 className="font-semibold text-lg mb-1">{app.jobTitle}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {app.companyName}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {app.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </div>
                          {app.salary && (
                            <div className="font-medium text-primary">
                              {app.salary}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status with Editable Dropdown */}
                      <div className="flex items-center gap-2">
                        <Select value={app.status} onValueChange={(newStatus) => updateApplicationStatus(app.id, newStatus)}>
                          <SelectTrigger className="w-fit">
                            <Badge className={`${config?.color || 'bg-blue-50 text-blue-900 border-blue-200'} border cursor-pointer`}>
                              {config?.icon || '📤'} {config?.badge || 'Applied'}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="applied">Applied</SelectItem>
                            <SelectItem value="reviewed">Under Review</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                            <SelectItem value="offer">Offer</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 flex-1 sm:flex-none"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteApplication(app.id)}
                        disabled={deleting === app.id}
                        className="text-destructive hover:text-destructive flex-1 sm:flex-none"
                      >
                        {deleting === app.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Application Timeline */}
      {applications.length > 0 && (
        <div className="bg-card rounded-xl p-8 border border-border/40">
          <h3 className="text-lg font-semibold mb-6">Application Timeline</h3>
          <div className="space-y-4 overflow-x-auto">
            {applications
              .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
              .slice(0, 5)
              .map((app, idx) => {
                const config = statusConfig[app.status] || { badge: 'Applied', color: 'bg-blue-50 text-blue-900 border-blue-200', icon: '📤' };
                return (
                <div key={app.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-lg flex-shrink-0`}>
                      {config.icon}
                    </div>
                    {idx !== 4 && <div className="w-0.5 h-8 bg-border my-2" />}
                  </div>
                  <div className="flex-1 pt-2 pb-4">
                    <p className="font-medium">{app.jobTitle}</p>
                    <p className="text-sm text-muted-foreground">{app.companyName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                );
              })
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
