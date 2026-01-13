import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ParsedJobData } from '@/services/aiJobParser';
import { Briefcase, MapPin, Zap, AlertCircle } from 'lucide-react';

interface JobPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parsedJob: ParsedJobData | null;
  isLoading?: boolean;
  onPublish: () => void;
}

export const JobPreviewDialog = ({
  open,
  onOpenChange,
  parsedJob,
  isLoading = false,
  onPublish,
}: JobPreviewDialogProps) => {
  if (!parsedJob) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Job Preview</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            No job data to display
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Job Preview</DialogTitle>
          <DialogDescription>Review the parsed job details before publishing</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Job Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{parsedJob.title}</h2>
                  <p className="text-lg text-muted-foreground">{parsedJob.company}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{parsedJob.location}</span>
                    {parsedJob.isRemote && (
                      <Badge variant="secondary" className="text-xs">Remote</Badge>
                    )}
                  </div>
                  {parsedJob.stipend && (
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-semibold">{parsedJob.stipend}</span>
                    </div>
                  )}
                  {parsedJob.salary && (
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-semibold">{parsedJob.salary}</span>
                    </div>
                  )}
                  {parsedJob.applyLink && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Application Link</p>
                      <a href={parsedJob.applyLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline break-all">{parsedJob.applyLink}</a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {parsedJob.experience && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Experience Level</p>
                  <p className="text-sm">{parsedJob.experience}</p>
                </div>
              )}

              {parsedJob.eligibility && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Eligibility</p>
                  <p className="text-sm">{parsedJob.eligibility}</p>
                </div>
              )}

              {parsedJob.batch && parsedJob.batch.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Batch</p>
                  <div className="flex gap-2">
                    {parsedJob.batch.map(b => (
                      <Badge key={b} variant="outline">{b}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tech Stack */}
          {parsedJob.techStack.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tech Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {parsedJob.techStack.map(tech => (
                    <Badge key={tech} variant="secondary">{tech}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {parsedJob.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {parsedJob.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-4">{parsedJob.description}</p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onPublish} disabled={isLoading}>
            {isLoading ? 'Publishing...' : 'Publish Job'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
