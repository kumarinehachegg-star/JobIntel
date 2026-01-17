import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  User,
  FileText,
  Zap,
  Settings,
  Briefcase,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  color: string;
}

export const DashboardLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      color: 'text-blue-600',
    },
    {
      label: 'Profile',
      icon: User,
      path: '/dashboard/profile',
      color: 'text-purple-600',
    },
    {
      label: 'Resume',
      icon: FileText,
      path: '/dashboard/resume',
      color: 'text-amber-600',
    },
    {
      label: 'Skills',
      icon: Zap,
      path: '/dashboard/skills',
      color: 'text-yellow-600',
    },
    {
      label: 'Browse Jobs',
      icon: Briefcase,
      path: '/jobs',
      color: 'text-green-600',
    },
    {
      label: 'My Applications',
      icon: FileText,
      path: '/dashboard/applications',
      color: 'text-pink-600',
    },
    {
      label: 'Notifications',
      icon: Bell,
      path: '/dashboard/notifications',
      color: 'text-red-600',
    },
    {
      label: 'Settings',
      icon: Settings,
      path: '/dashboard/settings',
      color: 'text-gray-600',
    },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Desktop */}
      <div
        className={`hidden md:flex flex-col bg-gradient-to-b from-card to-card/50 border-r border-border/40 transition-all duration-300 ${
          sidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-border/40">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                JobIntel
              </h1>
              <p className="text-xs text-muted-foreground">AI Job Matching</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={active ? 'default' : 'ghost'}
                  className={`w-full justify-start transition-all ${
                    active
                      ? 'bg-primary/20 text-primary hover:bg-primary/30'
                      : 'hover:bg-muted'
                  } ${sidebarOpen ? 'px-4' : 'px-2'}`}
                  size={sidebarOpen ? 'default' : 'icon'}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''} ${item.color}`} />
                  {sidebarOpen && <span>{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Collapse/Expand Button */}
        <div className="px-3 py-4 border-t border-border/40">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full hover:bg-muted"
          >
            {sidebarOpen ? (
              <ChevronDown className="h-5 w-5 rotate-90" />
            ) : (
              <ChevronDown className="h-5 w-5 -rotate-90" />
            )}
          </Button>
        </div>

        {/* Logout */}
        <div className="px-3 pb-4">
          <Button
            variant="outline"
            className={`w-full transition-all ${sidebarOpen ? '' : 'p-0'}`}
            size={sidebarOpen ? 'default' : 'icon'}
            onClick={logout}
            title={!sidebarOpen ? 'Logout' : undefined}
          >
            <LogOut className={`h-5 w-5 ${sidebarOpen ? 'mr-2' : ''}`} />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border/40 flex items-center px-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <h1 className="text-lg font-bold ml-4">JobIntel</h1>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 left-0 right-0 z-40 bg-card border-r border-border/40 overflow-y-auto">
          <nav className="space-y-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={active ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      active ? 'bg-primary/20 text-primary' : ''
                    }`}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${item.color}`} />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:mt-0 mt-16">
        {/* Top Header */}
        <div className="hidden md:flex items-center justify-between h-16 px-8 bg-gradient-to-r from-card/50 to-card/30 border-b border-border/40">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {navItems.find((item) => isActive(item.path))?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
