import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState(user || {});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token || !user?.id) return;

      const response = await fetch(`/api/users/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token || !user?.id) return;

      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        const data = await response.json();
        updateUser(data);
        setSuccess(true);
        setEditing(false);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Failed to save profile');
      }
    } catch (err) {
      setError('Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  const profileFields = [
    { label: 'Full Name', key: 'name', icon: User },
    { label: 'Email', key: 'email', icon: Mail },
    { label: 'Phone', key: 'phone', icon: Phone },
    { label: 'Location', key: 'location', icon: MapPin },
    { label: 'Batch/Year', key: 'batch', icon: Calendar },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile Information</h1>
          <p className="text-muted-foreground">Manage your personal and professional details</p>
        </div>
        <Button
          onClick={() => (editing ? handleSave() : setEditing(true))}
          disabled={loading}
          className="gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {editing ? 'Saving...' : 'Loading...'}
            </>
          ) : (
            <>
              {editing ? (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </>
              )}
            </>
          )}
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          Profile updated successfully!
        </div>
      )}

      {/* Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Avatar & Basic Info */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/5 rounded-xl p-8 border border-border/40">
          <div className="flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-4xl">
              {profile?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <h2 className="text-2xl font-bold mb-2">{profile?.name}</h2>
            <Badge className="mb-4">
              {user?.tier === 'free' ? '🔓 Free' : user?.tier === 'premium' ? '⭐ Premium' : '👑 Ultra'}
            </Badge>
            <p className="text-sm text-muted-foreground mb-4">
              Member since {new Date(profile?.createdAt).toLocaleDateString()}
            </p>
            <div className="text-sm space-y-2">
              <p className="text-muted-foreground">
                <strong>Tier:</strong> {user?.tier || 'Unknown'}
              </p>
              <p className="text-muted-foreground">
                <strong>Account Status:</strong> Active
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl p-8 border border-border/40">
            <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profileFields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.key} className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-semibold">
                      <Icon className="h-4 w-4 text-accent" />
                      {field.label}
                    </Label>
                    {editing ? (
                      <Input
                        value={profile?.[field.key as keyof typeof profile] || ''}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            [field.key]: e.target.value,
                          })
                        }
                        className="rounded-lg"
                      />
                    ) : (
                      <div className="p-3 rounded-lg bg-muted/50 border border-border/40">
                        <p className="text-sm font-medium">
                          {profile?.[field.key as keyof typeof profile] || 'Not provided'}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-card rounded-xl p-8 border border-border/40">
            <h3 className="text-xl font-semibold mb-6">Additional Information</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>👤 Profile Completion:</strong> {user?.profileCompletion || 0}%
                </p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm text-green-900">
                  <strong>📧 Email Verified:</strong> Yes
                </p>
              </div>
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-sm text-amber-900">
                  <strong>🔒 Last Updated:</strong> {new Date(profile?.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
