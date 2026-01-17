import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Lock, Bell, Eye, Trash2, LogOut, Save, Loader2, CheckCircle } from 'lucide-react';

const SettingsPage = () => {
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newJobMatches: true,
    applicationUpdates: true,
    weeklyDigest: true,
    theme: 'light',
    visibility: 'private',
    twoFactor: false,
  });

  useEffect(() => {
    fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user?.id) return;

      const response = await fetch(`/api/settings/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings({ ...settings, ...data });
      }
    } catch (err) {
      console.error('Failed to fetch settings', err);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      setSaved(false);
      const token = localStorage.getItem('token');
      if (!token || !user?.id) return;

      const response = await fetch(`/api/settings/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-900">
          <CheckCircle className="h-5 w-5" />
          Settings saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notification Settings */}
          <div className="bg-card rounded-xl p-8 border border-border/40">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent" />
              Notifications
            </h3>
            <div className="space-y-6">
              {[
                {
                  id: 'emailNotifications',
                  label: 'Email Notifications',
                  description: 'Receive updates via email',
                },
                {
                  id: 'pushNotifications',
                  label: 'Push Notifications',
                  description: 'Get browser push notifications',
                },
                {
                  id: 'newJobMatches',
                  label: 'New Job Matches',
                  description: 'Notify when new jobs match your profile',
                },
                {
                  id: 'applicationUpdates',
                  label: 'Application Updates',
                  description: 'Updates on your job applications',
                },
                {
                  id: 'weeklyDigest',
                  label: 'Weekly Digest',
                  description: 'Receive a weekly summary email',
                },
              ].map((setting) => (
                <label key={setting.id} className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div>
                    <p className="font-medium">{setting.label}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch
                    checked={settings[setting.id as keyof typeof settings] as boolean}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, [setting.id]: checked })
                    }
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-card rounded-xl p-8 border border-border/40">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Eye className="h-5 w-5 text-accent" />
              Privacy & Visibility
            </h3>
            <div className="space-y-6">
              <div>
                <Label className="mb-3 block">Profile Visibility</Label>
                <Select
                  value={settings.visibility}
                  onValueChange={(value) =>
                    setSettings({ ...settings, visibility: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private - Only visible to you</SelectItem>
                    <SelectItem value="companies">Companies Only - Visible to employers</SelectItem>
                    <SelectItem value="public">Public - Visible to everyone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-3 block">Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) =>
                    setSettings({ ...settings, theme: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <label className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch
                  checked={settings.twoFactor}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, twoFactor: checked })
                  }
                />
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <Button
              onClick={handleSaveSettings}
              disabled={loading}
              className="gap-2 bg-gradient-to-r from-primary to-accent"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="bg-card rounded-xl p-6 border border-border/40">
            <h3 className="font-semibold mb-4">Account</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Email</p>
                <p className="font-medium truncate">{user?.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Account Type</p>
                <p className="font-medium capitalize">{user?.role || 'User'}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Joined</p>
                <p className="font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-xl p-6 border border-red-200 space-y-4">
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-800">Irreversible actions</p>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>

            {/* Delete Account Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. All your data will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4 px-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-900 font-medium">
                    Type "DELETE" to confirm
                  </p>
                  <Input placeholder="Type DELETE to confirm" className="mt-2" />
                </div>
                <div className="flex gap-2 justify-end">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Security Tips */}
          <div className="bg-card rounded-xl p-6 border border-border/40">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-accent" />
              Security
            </h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>✓ Use a strong password</li>
              <li>✓ Enable two-factor auth</li>
              <li>✓ Keep email updated</li>
              <li>✓ Review active sessions</li>
              <li>✓ Monitor account activity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
