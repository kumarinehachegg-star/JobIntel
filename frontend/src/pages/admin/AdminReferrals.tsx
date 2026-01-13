import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  BadgeCheck,
  AlertCircle,
  MoreHorizontal,
  Eye,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { adminReferrals, referralStats } from '@/data/referralMockData';
import { cn } from '@/lib/utils';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="h-3 w-3" /> },
  'in-progress': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <ArrowUpRight className="h-3 w-3" /> },
  submitted: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: <FileText className="h-3 w-3" /> },
  accepted: { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="h-3 w-3" /> },
  rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="h-3 w-3" /> },
  completed: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: <BadgeCheck className="h-3 w-3" /> },
};

const pieData = [
  { name: 'Completed', value: referralStats.completedReferrals, color: '#10b981' },
  { name: 'In Progress', value: 34, color: '#3b82f6' },
  { name: 'Pending', value: referralStats.pendingReferrals, color: '#f59e0b' },
  { name: 'Rejected', value: 10, color: '#ef4444' },
];

const monthlyData = [
  { month: 'Jan', referrals: 12, revenue: 48000 },
  { month: 'Feb', referrals: 18, revenue: 72000 },
  { month: 'Mar', referrals: 24, revenue: 96000 },
  { month: 'Apr', referrals: 21, revenue: 84000 },
  { month: 'May', referrals: 28, revenue: 112000 },
  { month: 'Jun', referrals: 32, revenue: 128000 },
];

export default function AdminReferrals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredReferrals = adminReferrals.filter((referral) => {
    const matchesSearch =
      referral.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.referrer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.seeker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || referral.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Referral Management</h1>
          <p className="text-muted-foreground">Manage employee referrals and commissions</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Total Referrals</span>
            </div>
            <div className="mt-2 text-3xl font-bold text-foreground">
              {referralStats.totalReferrals}
            </div>
            <p className="text-sm text-green-600">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-muted-foreground">Success Rate</span>
            </div>
            <div className="mt-2 text-3xl font-bold text-foreground">
              {referralStats.successRate}%
            </div>
            <p className="text-sm text-green-600">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-amber-600" />
              <span className="text-sm text-muted-foreground">Total Revenue</span>
            </div>
            <div className="mt-2 text-3xl font-bold text-foreground">
              {formatCurrency(referralStats.totalRevenue)}
            </div>
            <p className="text-sm text-green-600">+24% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-muted-foreground">Verified Referrers</span>
            </div>
            <div className="mt-2 text-3xl font-bold text-foreground">
              {referralStats.verifiedReferrers}
            </div>
            <p className="text-sm text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Referral Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="referrals" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referral Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referrals Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Referrals</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-[250px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search referrals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job</TableHead>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Seeker</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{referral.jobTitle}</p>
                        <p className="text-sm text-muted-foreground">{referral.company}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            {referral.referrer.name}
                            {referral.referrer.verified && (
                              <BadgeCheck className="h-4 w-4 text-blue-500" />
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">{referral.referrer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{referral.seeker.name}</p>
                        <p className="text-sm text-muted-foreground">{referral.seeker.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('capitalize gap-1', statusConfig[referral.status]?.color)}
                      >
                        {statusConfig[referral.status]?.icon}
                        {referral.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(referral.price)}
                    </TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {formatCurrency(referral.commission)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </TableCell>
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
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Contact
                          </DropdownMenuItem>
                          {referral.proofUrl && (
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              View Proof
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {referral.status === 'pending' && (
                            <>
                              <DropdownMenuItem className="text-green-600">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {referral.status === 'accepted' && (
                            <DropdownMenuItem className="text-emerald-600">
                              <BadgeCheck className="mr-2 h-4 w-4" />
                              Mark Completed
                            </DropdownMenuItem>
                          )}
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

      {/* Commission Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Commission Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">Platform Commission</p>
              <p className="text-2xl font-bold text-foreground">10%</p>
              <p className="text-xs text-muted-foreground">Of referral price</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">Avg. Referral Price</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(referralStats.avgReferralPrice)}</p>
              <p className="text-xs text-muted-foreground">Across all referrals</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">Total Commissions Earned</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(referralStats.totalCommissions)}</p>
              <p className="text-xs text-muted-foreground">This month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
