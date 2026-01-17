import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Target,
  Briefcase,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Clock,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const OverviewPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobMatchTrend, setJobMatchTrend] = useState<any[]>([]);
  const [applicationStatus, setApplicationStatus] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchAllData();
  }, [user]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      // Fetch user stats
      const statsRes = await fetch('/api/analytics/user-stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }

      // Fetch job match trends
      const trendsRes = await fetch('/api/analytics/job-match-trends', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (trendsRes.ok) {
        const data = await trendsRes.json();
        setJobMatchTrend(Array.isArray(data) ? data : []);
      }

      // Fetch application status distribution
      const statusRes = await fetch('/api/analytics/application-status', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (statusRes.ok) {
        const data = await statusRes.json();
        setApplicationStatus(Array.isArray(data) ? data : []);
      }

      // Fetch recent activity
      const activityRes = await fetch('/api/activity/recent', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (activityRes.ok) {
        const data = await activityRes.json();
        setRecentActivity(Array.isArray(data) ? data.slice(0, 5) : []);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Profile Strength',
      value: stats.profileStrength || 0,
      unit: '%',
      icon: Target,
      color: 'text-blue-600',
      trend: stats.profileTrend || '+0%',
    },
    {
      label: 'Job Matches',
      value: stats.totalMatches || 0,
      unit: '',
      icon: Briefcase,
      color: 'text-green-600',
      trend: stats.matchesTrend || '+0 this week',
    },
    {
      label: 'Applications',
      value: stats.totalApplications || 0,
      unit: '',
      icon: CheckCircle2,
      color: 'text-purple-600',
      trend: stats.applicationsTrend || '+0 pending',
    },
    {
      label: 'Interview Calls',
      value: stats.interviews || 0,
      unit: '',
      icon: Calendar,
      color: 'text-amber-600',
      trend: stats.interviewsTrend || '0 scheduled',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-transparent rounded-xl p-8 border border-border/40 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-900">
          {error}
        </div>
      )}

      {/* Premium Status Section */}
      <div className={`rounded-xl p-1 border ${
        user?.tier === 'premium' || user?.tier === 'ultra'
          ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200'
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${
              user?.tier === 'premium' || user?.tier === 'ultra'
                ? 'bg-amber-200'
                : 'bg-blue-200'
            }`}>
              <Star className={`h-6 w-6 ${
                user?.tier === 'premium' || user?.tier === 'ultra'
                  ? 'text-amber-600'
                  : 'text-blue-600'
              }`} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {user?.tier === 'premium' ? '⭐ Premium Member' : user?.tier === 'ultra' ? '👑 Ultra Member' : '🔓 Free Plan'}
              </h2>
              <p className="text-sm text-gray-600">
                {user?.tier === 'premium' ? 'Enjoy unlimited job matches and priority support' : user?.tier === 'ultra' ? 'Exclusive access to all premium features' : 'Upgrade to unlock premium features and boost your job search'}
              </p>
            </div>
          </div>
          {user?.tier !== 'premium' && user?.tier !== 'ultra' && (
            <Link to="/pricing">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold">
                Upgrade Now
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-transparent rounded-xl p-4 border border-border/40">
        <h1 className="text-2xl font-bold mb-1">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Here's your job search analytics and performance overview. Keep improving your profile to get better matches!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-card rounded-xl p-6 border border-border/40 hover:border-border/60 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${card.color}/10`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <Badge variant="secondary" className="text-xs">
                  This week
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{card.value}</span>
                  <span className="text-muted-foreground">{card.unit}</span>
                </div>
                <p className="text-xs text-green-600 font-medium">{card.trend}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Matches Trend */}
        {jobMatchTrend.length > 0 && (
          <div className="bg-card rounded-xl p-6 border border-border/40">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Job Matches Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={jobMatchTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="date" stroke="currentColor" className="text-muted-foreground" />
                <YAxis stroke="currentColor" className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="matches"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Application Status Distribution */}
        {applicationStatus.length > 0 && (
          <div className="bg-card rounded-xl p-6 border border-border/40">
            <h3 className="text-lg font-semibold mb-4">Application Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applicationStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {applicationStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Activity Section */}
      {recentActivity.length > 0 && (
        <div className="bg-card rounded-xl p-6 border border-border/40">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <span className="text-2xl">{activity.icon || '📌'}</span>
                <div className="flex-1">
                  <p className="font-medium">{activity.action || activity.title}</p>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  )}
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {activity.time || new Date(activity.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentActivity.length === 0 && !loading && (
        <div className="bg-card rounded-xl p-12 border border-border/40 text-center">
          <p className="text-muted-foreground">No recent activity yet. Start exploring jobs and applying!</p>
        </div>
      )}
    </div>
  );
};

export default OverviewPage;
