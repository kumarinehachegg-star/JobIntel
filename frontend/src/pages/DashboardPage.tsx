import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '@/store/authStore';
import { useApplicationStore } from '@/store/applicationStore';
import { ResumeUploadModal } from '@/components/ResumeUploadModal';
import {
  Briefcase,
  TrendingUp,
  Bell,
  Settings,
  Bookmark,
  FileText,
  Crown,
  MessageCircle,
  Mail,
  Send,
  Building2,
  MapPin,
  Clock,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  Calendar,
  Target,
  Zap,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Add extra safety check for notificationPreferences
  const notifPrefs = user.notificationPreferences || {
    email: true,
    whatsapp: false,
    telegram: false,
    newJobMatch: true,
    deadlineReminder: true,
    applicationUpdate: true,
    referralUpdate: false,
  };

  // Real-time data: fetch from backend and stay in sync with app store
  const backendBase = (import.meta as any).env?.VITE_API_URL || '';
  const [matchedJobs, setMatchedJobs] = useState<any[]>([]);
  const [profileFields, setProfileFields] = useState<any[]>([]);
  const appStore = useApplicationStore();
  const [recentApplications, setRecentApplications] = useState<any[]>(Object.values(appStore.applications || {}));
  // Edit profile modal state (profile only)
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState<any>({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    batch: (user as any).batch || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  // Skills modal state
  const [editSkillsOpen, setEditSkillsOpen] = useState(false);
  const [skillsForm, setSkillsForm] = useState<string[]>(user.skills || []);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [savingSkills, setSavingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [resumeUploadOpen, setResumeUploadOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'interview':
        return <Badge variant="success">Interview</Badge>;
      case 'in-review':
        return <Badge variant="info">In Review</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'offered':
        return <Badge variant="premium">Offered</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const stats = [
    { label: 'Job Matches', value: matchedJobs.length, icon: Target, color: 'text-primary' },
    { label: 'Applications', value: recentApplications.length, icon: Briefcase, color: 'text-accent' },
    { label: 'Interviews', value: 0, icon: Calendar, color: 'text-success' },
    { label: 'Saved Jobs', value: 0, icon: Bookmark, color: 'text-warning' },
  ];

  // Fetch matched jobs from backend (top matches). Keep lightweight and update periodically.
  useEffect(() => {
    let mounted = true;
    const fetchMatches = async () => {
      try {
        const base = backendBase ? backendBase.replace(/\/$/, '') : '';
        const url = base ? `${base}/api/jobs?status=active` : '/api/jobs?status=active';
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return;
        const jobs = await res.json();
        if (!mounted) return;
        setMatchedJobs(Array.isArray(jobs) ? jobs.slice(0, 3) : []);
      } catch (e) {
        console.warn('failed to fetch matched jobs', e);
      }
    };
    fetchMatches();
    const iv = setInterval(fetchMatches, 15000);
    return () => { mounted = false; clearInterval(iv); };
  }, [backendBase, user]);

  // Fetch user's applications from backend and keep in sync with application store (SSE updates)
  useEffect(() => {
    let mounted = true;
    const fetchApps = async () => {
      if (!user || !user.id) return;
      try {
        const base = backendBase ? backendBase.replace(/\/$/, '') : '';
        const url = base ? `${base}/api/applications?userId=${user.id}` : `/api/applications?userId=${user.id}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return;
        const apps = await res.json();
        if (!mounted) return;
        setRecentApplications(Array.isArray(apps) ? apps : []);
      } catch (e) {
        console.warn('failed to fetch recent applications', e);
      }
    };
    fetchApps();
    const iv = setInterval(fetchApps, 15000);
    return () => { mounted = false; clearInterval(iv); };
  }, [backendBase, user]);

  // Keep in-sync with application store (SSE may update appStore.application map)
  useEffect(() => {
    setRecentApplications(Object.values(appStore.applications || {}));
  }, [appStore.applications]);

  // Load available skills when skills modal opens
  useEffect(() => {
    if (!editSkillsOpen) return;
    let mounted = true;
    const fetchSkills = async () => {
      try {
        const base = backendBase ? backendBase.replace(/\/$/, '') : '';
        const url = base ? `${base}/api/skills` : '/api/skills';
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return;
        const skills = await res.json();
        if (!mounted) return;
        setAvailableSkills(Array.isArray(skills) ? skills : []);
      } catch (e) {
        console.warn('failed to fetch skills', e);
      }
    };
    fetchSkills();
    return () => { mounted = false; };
  }, [editSkillsOpen, backendBase]);

  // Load profile fields when profile modal opens (or on mount)
  useEffect(() => {
    let mounted = true;
    const fetchFields = async () => {
      try {
        const base = backendBase ? backendBase.replace(/\/$/, '') : '';
        const url = base ? `${base}/api/profile-fields` : '/api/profile-fields';
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return;
        const fields = await res.json();
        if (!mounted) return;
        setProfileFields(Array.isArray(fields) ? fields : []);
      } catch (e) {
        console.warn('failed to fetch profile fields', e);
      }
    };
    fetchFields();
    return () => { mounted = false; };
  }, [backendBase]);

  // keep profile form and skills form in sync with current user
  useEffect(() => {
    // initialize profile form with admin-defined profile fields if available
    const baseForm: any = {
      name: user.name || '',
      email: user.email || '',
      phone: (user as any).phone || '',
      batch: (user as any).batch || '',
    };
    (profileFields || []).forEach((f: any) => {
      baseForm[f.key] = (user as any)[f.key] ?? '';
    });
    setProfileForm(baseForm);
    setSkillsForm(Array.from(new Set(user.skills || [])));
  }, [user, profileFields]);

  const toggleSkill = (skill: string) => {
    setSkillsForm((prev) => {
      const s = new Set(prev || []);
      if (s.has(skill)) s.delete(skill); else s.add(skill);
      return Array.from(s);
    });
  };

  const addCustomSkill = () => {
    const sk = String(newSkill || '').trim();
    if (!sk) return;
    setNewSkill('');
    setAvailableSkills((prev) => Array.from(new Set([sk, ...prev])));
    setSkillsForm((prev) => Array.from(new Set([sk, ...(prev || [])])));
  };

  const saveProfile = async () => {
    if (!user || !user.id) return;
    setSavingProfile(true);
    try {
      const base = backendBase ? backendBase.replace(/\/$/, '') : '';
      const url = base ? `${base}/api/users/${user.id}` : `/api/users/${user.id}`;
      // send dynamic form values (only include keys present in profileForm)
      const body: any = {};
      Object.keys(profileForm || {}).forEach((k) => { body[k] = profileForm[k]; });
      const res = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        const updated = await res.json();
        useAuthStore.getState().updateUser({ ...updated });
        setEditProfileOpen(false);
      } else {
        console.warn('failed to save profile', await res.text());
      }
    } catch (e) {
      console.error('saveProfile error', e);
    } finally {
      setSavingProfile(false);
    }
  };

  // React to realtime updates for skills or profile fields
  useEffect(() => {
    const handler = (e: any) => {
      const payload = e?.detail;
      if (!payload) return;
      if (payload.type === 'skills') {
        const url = backendBase ? `${backendBase.replace(/\/$/, '')}/api/skills` : '/api/skills';
        fetch(url).then((r) => r.ok && r.json()).then((s) => setAvailableSkills(Array.isArray(s) ? s : [])).catch(() => {});
      }
      if (payload.type === 'profile_fields') {
        // refetch profile fields and reinitialize form
        const url = backendBase ? `${backendBase.replace(/\/$/, '')}/api/profile-fields` : '/api/profile-fields';
        fetch(url).then((r) => r.ok && r.json()).then((f) => { setProfileFields(Array.isArray(f) ? f : []); }).catch(() => {});
      }
    };
    window.addEventListener('realtime:update', handler as EventListener);
    return () => window.removeEventListener('realtime:update', handler as EventListener);
  }, [backendBase, editSkillsOpen, profileFields]);

  const saveSkills = async () => {
    if (!user || !user.id) return;
    setSavingSkills(true);
    try {
      const base = backendBase ? backendBase.replace(/\/$/, '') : '';
      const url = base ? `${base}/api/users/${user.id}` : `/api/users/${user.id}`;
      const body = { skills: skillsForm };
      const res = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        const updated = await res.json();
        useAuthStore.getState().updateUser({ ...updated });
        setEditSkillsOpen(false);
      } else {
        console.warn('failed to save skills', await res.text());
      }
    } catch (e) {
      console.error('saveSkills error', e);
    } finally {
      setSavingSkills(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Header Section */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border-b border-border/40">
        <div className="container mx-auto px-6 py-10">
          {/* Top Row: Header & Actions */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Welcome back, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-base text-muted-foreground">
                Here's your job search overview at a glance
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {user.tier === 'free' && (
                <Link to="/pricing">
                  <Button variant="premium" className="gap-2 shadow-md hover:shadow-lg transition-shadow">
                    <Crown className="h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                </Link>
              )}
              <Badge 
                variant={user.tier === 'premium' ? 'premium' : user.tier === 'ultra' ? 'premium' : 'default'} 
                className="px-4 py-2 text-sm font-medium"
              >
                {user.tier === 'free' ? '🔓 Free' : user.tier === 'premium' ? '⭐ Premium' : '👑 Ultra'}
              </Badge>
            </div>
          </div>

          {/* Stats Grid - Enhanced */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-gradient-to-br from-card to-card/50 rounded-xl p-6 border border-border/60 hover:border-border hover:shadow-md transition-all duration-300 animate-fade-in backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-${stat.color === 'text-primary' ? 'primary' : stat.color === 'text-accent' ? 'accent' : 'success'}/10`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Completion - Enhanced */}
            <div className="bg-gradient-to-br from-card to-card/50 rounded-xl p-7 border border-border/60 hover:border-border transition-all">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
                    <Target className="h-5 w-5 text-accent" />
                    Profile Strength
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Complete your profile to improve job matching
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setEditProfileOpen(true)}
                  className="hover:bg-primary/10"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <Progress value={user.profileCompletion || 0} className="h-3 rounded-full" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{user.profileCompletion || 0}% Complete</span>
                  <span className="text-xs text-muted-foreground">Keep improving!</span>
                </div>
              </div>
            </div>

            {/* Edit Profile Dialog */}
            <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <Label>Name</Label>
                    <Input value={profileForm.name} onChange={(e: any) => setProfileForm((p: any) => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={profileForm.email} onChange={(e: any) => setProfileForm((p: any) => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={profileForm.phone} onChange={(e: any) => setProfileForm((p: any) => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Batch</Label>
                    <Input value={profileForm.batch} onChange={(e: any) => setProfileForm((p: any) => ({ ...p, batch: e.target.value }))} />
                  </div>

                  {/* Render admin-defined profile fields */}
                  {(profileFields || []).map((f: any) => (
                    <div key={f.key}>
                      <Label>{f.label}</Label>
                      {f.type === 'select' ? (
                        <select
                          className="w-full p-2 border rounded"
                          value={profileForm[f.key] ?? ''}
                          onChange={(e: any) => setProfileForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                        >
                          <option value="">Select…</option>
                          {(f.options || []).map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          value={profileForm[f.key] ?? ''}
                          onChange={(e: any) => setProfileForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditProfileOpen(false)}>Cancel</Button>
                  <Button onClick={saveProfile} disabled={savingProfile}>{savingProfile ? 'Saving...' : 'Save Profile'}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Skills Dialog */}
            <Dialog open={editSkillsOpen} onOpenChange={setEditSkillsOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Edit Skills</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <Label className="mb-2">Select skills (tags)</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(skillsForm || []).map((sk) => (
                        <Badge key={sk} variant="secondary" onClick={() => toggleSkill(sk)}>{sk}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <Input placeholder="Add custom skill" value={newSkill} onChange={(e:any) => setNewSkill(e.target.value)} />
                      <Button size="sm" onClick={addCustomSkill}>Add</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-auto">
                      {availableSkills.map((sk) => (
                        <label key={sk} className="flex items-center gap-2">
                          <Checkbox checked={(skillsForm || []).includes(sk)} onCheckedChange={() => toggleSkill(sk)} />
                          <span className="text-sm">{sk}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditSkillsOpen(false)}>Cancel</Button>
                  <Button onClick={saveSkills} disabled={savingSkills}>{savingSkills ? 'Saving...' : 'Save Skills'}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Top Job Matches - Enhanced */}
            <div className="bg-gradient-to-br from-card to-card/50 rounded-xl p-7 border border-border/60">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  Top Job Matches
                </h2>
                <Link to="/jobs">
                  <Button variant="outline" size="sm" className="gap-1">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {matchedJobs.slice(0, 3).map((job, index) => (
                  <div
                    key={job.id || job._id || `match-${index}`}
                    className="group p-5 rounded-xl bg-muted/50 hover:bg-muted border border-transparent hover:border-border/40 transition-all duration-300 animate-fade-in cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <Link to={`/jobs/${job.id || job._id}`}> 
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {job.title || job.name || 'Untitled Job'}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground line-clamp-1">{job.company?.name || job.meta?.company || 'Company'}</p>
                          </div>
                          <Badge variant="success" className="flex-shrink-0 whitespace-nowrap">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {job.matchScore}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(job.postedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
                      <Button variant="accent" size="sm" className="mt-3">
                        Apply
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Applications - Enhanced */}
            <div className="bg-gradient-to-br from-card to-card/50 rounded-xl p-7 border border-border/60">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Recent Applications
                </h2>
                <Link to="/applications">
                  <Button variant="outline" size="sm" className="gap-1">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {recentApplications && recentApplications.length > 0 ? (
                  recentApplications.slice(0, 5).map((app, index) => (
                    <div
                      key={app._id || app.id || `app-${index}`}
                      className="group p-5 rounded-xl bg-muted/50 hover:bg-muted border border-transparent hover:border-border/40 transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground line-clamp-1">{app.job?.title || 'Untitled Job'}</h3>
                          <p className="text-sm text-muted-foreground">{app.job?.company?.name || 'Company'}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getStatusBadge(app.status)}
                          {app.autoApplied && (
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <Zap className="h-3 w-3" />
                              Auto
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground font-medium mb-2">No applications yet</p>
                    <p className="text-sm text-muted-foreground">Start applying to jobs to see them here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Notification Preferences - Enhanced */}
            <div className="bg-gradient-to-br from-card to-card/50 rounded-xl p-7 border border-border/60">
              <h2 className="font-semibold mb-6 flex items-center gap-2">
                <Bell className="h-5 w-5 text-accent" />
                Notification Channels
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-green-500/15 flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <Label htmlFor="whatsapp" className="font-medium cursor-pointer">WhatsApp</Label>
                  </div>
                  <Switch
                    id="whatsapp"
                    checked={notifPrefs.whatsapp}
                    disabled={user.tier === 'free'}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-500/15 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <Label htmlFor="email" className="font-medium cursor-pointer">Email</Label>
                  </div>
                  <Switch
                    id="email"
                    checked={notifPrefs.email}
                    disabled={user.tier === 'free'}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-sky-500/15 flex items-center justify-center">
                      <Send className="h-4 w-4 text-sky-600" />
                    </div>
                    <Label htmlFor="telegram" className="font-medium cursor-pointer">Telegram</Label>
                  </div>
                  <Switch
                    id="telegram"
                    checked={notifPrefs.telegram}
                    disabled={user.tier === 'free'}
                  />
                </div>
                {user.tier === 'free' && (
                  <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <p className="text-xs text-amber-900 dark:text-amber-200 font-medium">
                      💎 Upgrade to Premium to enable notifications
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Skills - Enhanced */}
            <div className="bg-gradient-to-br from-card to-card/50 rounded-xl p-7 border border-border/60">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Your Skills
              </h2>
              <div className="flex flex-wrap gap-2 mb-4 min-h-10">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1.5 font-medium">
                      ✓ {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No skills added yet</p>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full font-medium hover:bg-primary/5"
                onClick={() => setEditSkillsOpen(true)}
              >
                + Add More Skills
              </Button>
            </div>

            {/* Quick Actions - Enhanced */}
            <div className="bg-gradient-to-br from-card to-card/50 rounded-xl p-7 border border-border/60">
              <h2 className="font-semibold mb-6 flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link to="/jobs">
                  <Button variant="outline" className="w-full justify-start font-medium hover:bg-primary/10 transition-colors">
                    <Briefcase className="h-4 w-4 mr-3" />
                    Browse Jobs
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start font-medium hover:bg-accent/10 transition-colors"
                  onClick={() => setResumeUploadOpen(true)}
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Upload Resume
                </Button>
                <Link to="/settings">
                  <Button variant="outline" className="w-full justify-start font-medium hover:bg-secondary/10 transition-colors">
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Button>
                </Link>
              </div>
            </div>

            {/* Upgrade CTA - Enhanced */}
            {user.tier !== 'ultra' && (
              <div className="relative overflow-hidden rounded-xl p-7 border border-primary/30 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-50" />
                <div className="relative z-10">
                  <h3 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    {user.tier === 'free' ? '🔓 Unlock Premium' : '👑 Go Ultra'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    {user.tier === 'free'
                      ? 'Get AI matching, instant notifications, and early job access.'
                      : 'Enable auto-apply, AI cover letters, and priority support.'}
                  </p>
                  <Link to="/pricing" className="block">
                    <Button className="w-full bg-gradient-to-r from-primary to-accent text-white font-medium shadow-md hover:shadow-lg transition-shadow">
                      {user.tier === 'free' ? 'Upgrade to Premium' : 'Go Ultra'}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resume Upload Modal */}
      <ResumeUploadModal 
        open={resumeUploadOpen} 
        onOpenChange={setResumeUploadOpen}
      />
    </div>
  );
};

export default DashboardPage;
