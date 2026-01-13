import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    appName: 'JobIntel',
    appUrl: 'https://jobintel.com',
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    dailyReports: true,
    autoPublish: false,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage admin settings and configuration</p>
      </div>

      {saved && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Settings saved successfully!</AlertDescription>
        </Alert>
      )}

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Application Name</label>
            <Input value={settings.appName} onChange={(e) => handleChange('appName', e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Application URL</label>
            <Input value={settings.appUrl} onChange={(e) => handleChange('appUrl', e.target.value)} />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox checked={settings.maintenanceMode} onCheckedChange={(checked) => handleChange('maintenanceMode', checked)} />
            <label className="text-sm font-medium cursor-pointer">Enable Maintenance Mode</label>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox checked={settings.emailNotifications} onCheckedChange={(checked) => handleChange('emailNotifications', checked)} />
            <label className="text-sm font-medium cursor-pointer">Email Notifications</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox checked={settings.smsNotifications} onCheckedChange={(checked) => handleChange('smsNotifications', checked)} />
            <label className="text-sm font-medium cursor-pointer">SMS Notifications</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox checked={settings.dailyReports} onCheckedChange={(checked) => handleChange('dailyReports', checked)} />
            <label className="text-sm font-medium cursor-pointer">Daily Reports</label>
          </div>
        </CardContent>
      </Card>

      {/* Publishing Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Publishing Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox checked={settings.autoPublish} onCheckedChange={(checked) => handleChange('autoPublish', checked)} />
            <label className="text-sm font-medium cursor-pointer">Auto-Publish New Jobs</label>
          </div>
        </CardContent>
      </Card>

      {/* API Settings */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys & Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">Keep your API keys confidential. Never share them publicly.</AlertDescription>
          </Alert>
          <div className="space-y-2">
            <label className="text-sm font-medium">Primary API Key</label>
            <div className="flex gap-2">
              <Input type="password" value="••••••••••••••••" readOnly className="bg-muted" />
              <Button variant="outline">Regenerate</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={handleSave} className="w-32">Save Changes</Button>
        <Button variant="outline" className="w-32">Reset to Default</Button>
      </div>
    </div>
  );
}
