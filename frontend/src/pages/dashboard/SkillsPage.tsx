import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Zap, Plus, Trash2, Save, Loader2 } from 'lucide-react';

const SkillsPage = () => {
  const { user, updateUser } = useAuthStore();
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAvailableSkills();
  }, []);

  const fetchAvailableSkills = async () => {
    try {
      const response = await fetch('/api/skills');
      if (response.ok) {
        const data = await response.json();
        setAvailableSkills(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch skills', err);
    }
  };

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token || !user?.id) return;

      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skills }),
      });

      if (response.ok) {
        const data = await response.json();
        updateUser(data);
        setEditing(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Failed to save skills');
      }
    } catch (err) {
      console.error('Failed to save skills', err);
      setError('Error saving skills');
    } finally {
      setLoading(false);
    }
  };

  const skillCategories = {
    'Programming Languages': ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go', 'Rust'],
    'Frontend': ['React', 'Vue.js', 'Angular', 'HTML/CSS', 'Tailwind CSS', 'Next.js'],
    'Backend': ['Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'FastAPI'],
    'Databases': ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch'],
    'Tools & Platforms': ['Git', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure'],
  };

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          ✓ Skills saved successfully!
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Skills & Expertise</h1>
          <p className="text-muted-foreground">Manage your technical skills to improve job matching</p>
        </div>
        {!editing ? (
          <Button onClick={() => setEditing(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Edit Skills
          </Button>
        ) : (
          <Button
            onClick={handleSave}
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
                Save Skills
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Skills Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Skills */}
          <div className="bg-card rounded-xl p-8 border border-border/40">
            <h3 className="text-lg font-semibold mb-6">Your Skills ({skills.length})</h3>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-3 mb-6">
                {skills.map((skill) => (
                  <div key={skill} className="group">
                    <Badge
                      variant="secondary"
                      className="px-4 py-2 flex items-center gap-2 cursor-default"
                    >
                      <span>✓ {skill}</span>
                      {editing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="opacity-60 hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mb-6 italic">No skills added yet</p>
            )}

            {editing && (
              <div className="space-y-4 pt-4 border-t border-border/40">
                <div>
                  <Label className="mb-2 block">Add Custom Skill</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Machine Learning, UI Design..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                    />
                    <Button onClick={addCustomSkill} size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Available Skills by Category */}
          {editing && (
            <div className="bg-card rounded-xl p-8 border border-border/40">
              <h3 className="text-lg font-semibold mb-6">Suggested Skills</h3>
              <div className="space-y-6">
                {Object.entries(skillCategories).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h4 className="font-semibold mb-3 text-accent">{category}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categorySkills.map((skill) => (
                        <label key={skill} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                          <Checkbox
                            checked={skills.includes(skill)}
                            onCheckedChange={() => toggleSkill(skill)}
                          />
                          <span className="text-sm">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skills Impact */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/5 rounded-xl p-6 border border-border/40">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              Skills Impact
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Skills</p>
                <p className="text-3xl font-bold text-primary">{skills.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <p className="text-sm font-medium">+{Math.min(skills.length * 2, 50)}% match improvement</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-card rounded-xl p-6 border border-border/40">
            <h3 className="font-semibold mb-4">📈 Recommendations</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-blue-900 font-medium">+3 More Skills</p>
                <p className="text-xs text-blue-800">Add 3 more skills to reach expert level</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-green-900 font-medium">Trending Skills</p>
                <p className="text-xs text-green-800">React, Python, Cloud Computing</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-card rounded-xl p-6 border border-border/40">
            <h3 className="font-semibold mb-4">💡 Tips</h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Add skills that match job requirements</li>
              <li>• Include certifications and specializations</li>
              <li>• Update regularly with new learnings</li>
              <li>• Prioritize in-demand technologies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
