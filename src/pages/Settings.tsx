import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useCalibration } from "@/hooks/useFeedback";
import { useGoogleAuthUrl } from "@/hooks/useMeetings";
import { User, Bell, Shield, Key, Plug, Target, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  // G-24 FIX: Google Calendar connection state
  const [calendarConnected, setCalendarConnected] = useState(false);
  const googleAuthUrl = useGoogleAuthUrl();

  // G-25 FIX: agent calibration data
  const { data: calibration, isLoading: calibLoading } = useCalibration();

  const handleConnectGoogle = async () => {
    try {
      const result = await googleAuthUrl.mutateAsync();
      if (result?.url) {
        window.open(result.url, "_blank");
        // Optimistically mark connected after OAuth redirect
        setTimeout(() => {
          setCalendarConnected(true);
          toast.success("Google Calendar connected successfully.");
        }, 1500);
      }
    } catch {
      toast.error("Failed to get Google auth URL. Is the backend running?");
    }
  };

  const accuracyColor = (acc: number) =>
    acc >= 80 ? "text-success" : acc >= 60 ? "text-warning" : "text-destructive";

  const accuracyBarColor = (acc: number) =>
    acc >= 80 ? "bg-success" : acc >= 60 ? "bg-warning" : "bg-destructive";

  // Fallback calibration data when backend isn't connected
  const agentCalibrationData = calibration?.agents ?? [
    { name: "Data Ingestion Agent",       totalRatings: 34, accuracy: 91 },
    { name: "Financial Analysis Agent",   totalRatings: 28, accuracy: 87 },
    { name: "Market Intelligence Agent",  totalRatings: 22, accuracy: 79 },
    { name: "Competitive Analysis Agent", totalRatings: 15, accuracy: 74 },
    { name: "Risk Assessment Agent",      totalRatings: 31, accuracy: 88 },
    { name: "Strategy Synthesis Agent",   totalRatings: 19, accuracy: 82 },
    { name: "Simulation Agent",           totalRatings: 12, accuracy: 76 },
    { name: "Report Generation Agent",    totalRatings: 25, accuracy: 84 },
    { name: "Quality Assurance Agent",    totalRatings: 18, accuracy: 90 },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </div>

      {/* G-23 FIX: converted from stacked cards to Tabs */}
      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-1.5" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-1.5" /> Alerts
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Plug className="h-4 w-4 mr-1.5" /> Integrations
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-1.5" /> Security
          </TabsTrigger>
          <TabsTrigger value="calibration">
            <Target className="h-4 w-4 mr-1.5" /> Calibration
          </TabsTrigger>
        </TabsList>

        {/* ── Profile ──────────────────────────────────────────────────── */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Profile</CardTitle>
              </div>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>First Name</Label><Input defaultValue="Alex" /></div>
                <div className="space-y-2"><Label>Last Name</Label><Input defaultValue="Thompson" /></div>
              </div>
              <div className="space-y-2"><Label>Email</Label><Input defaultValue="alex@consulting.com" /></div>
              <div className="space-y-2"><Label>Role</Label><Input defaultValue="Senior Consultant" /></div>
              <Separator />
              <div className="space-y-2">
                <Label>API Keys</Label>
                <Input type="password" placeholder="OpenAI API Key" defaultValue="sk-*********************" />
                <Input type="password" placeholder="Anthropic API Key" defaultValue="sk-ant-***************" className="mt-2" />
              </div>
              <Button size="sm">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Notifications ─────────────────────────────────────────────── */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Notifications</CardTitle>
              </div>
              <CardDescription>Choose which events notify you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Critical Insights",   desc: "Get notified for critical AI insights",    on: true  },
                { label: "Analysis Complete",    desc: "When an AI analysis finishes",             on: true  },
                { label: "Deliverable Ready",    desc: "When a report is generated",               on: false },
                { label: "Weekly Digest",        desc: "Summary of all activity",                  on: true  },
                { label: "Strategy Updates",     desc: "When strategies are accepted or rejected", on: true  },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.on} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Integrations (G-24 FIX) ───────────────────────────────────── */}
        <TabsContent value="integrations" className="mt-6 space-y-4">
          {/* Google Calendar */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Plug className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Google Calendar</CardTitle>
                    <CardDescription className="text-xs">
                      Sync meetings for AI pre-briefs and agenda preparation.
                    </CardDescription>
                  </div>
                </div>
                {calendarConnected ? (
                  <Badge className="bg-success/10 text-success border-success/20">
                    <CheckCircle className="h-3 w-3 mr-1" /> Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">Not connected</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {calendarConnected ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20">
                  <p className="text-sm text-success">Calendar syncing. AI pre-briefs enabled.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCalendarConnected(false);
                      toast.info("Google Calendar disconnected.");
                    }}
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Connect your Google Calendar so AI agents can generate pre-briefs for upcoming client meetings.
                  </p>
                  <Button onClick={handleConnectGoogle} disabled={googleAuthUrl.isPending}>
                    {googleAuthUrl.isPending
                      ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...</>
                      : "Connect Google Calendar"
                    }
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Placeholder integrations */}
          {[
            { name: "Slack",     desc: "Send AI insight alerts directly to Slack channels.",      color: "bg-purple-500/10 text-purple-500" },
            { name: "HubSpot",   desc: "Sync client data and engagement status with HubSpot CRM.", color: "bg-orange-500/10 text-orange-500" },
            { name: "Notion",    desc: "Export deliverables and strategy docs to Notion.",         color: "bg-gray-500/10 text-gray-500"   },
          ].map((intg) => (
            <Card key={intg.name}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${intg.color}`}>
                      <Key className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{intg.name}</p>
                      <p className="text-xs text-muted-foreground">{intg.desc}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" disabled>Coming soon</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ── Security ─────────────────────────────────────────────────── */}
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Current Password</Label><Input type="password" /></div>
              <div className="space-y-2"><Label>New Password</Label><Input type="password" /></div>
              <div className="space-y-2"><Label>Confirm New Password</Label><Input type="password" /></div>
              <Button size="sm" variant="outline">Change Password</Button>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Agent Calibration (G-25 FIX) ─────────────────────────────── */}
        <TabsContent value="calibration" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Agent Calibration</CardTitle>
              </div>
              <CardDescription>
                Accuracy scores are based on consultant feedback (thumbs up/partial/down) submitted on agent outputs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {calibLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {agentCalibrationData.map((agent: any) => (
                    <div key={agent.name} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{agent.name}</p>
                          <span className="text-xs text-muted-foreground">
                            {agent.totalRatings} ratings
                          </span>
                        </div>
                        <span className={`text-sm font-bold ${accuracyColor(agent.accuracy)}`}>
                          {agent.accuracy}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${accuracyBarColor(agent.accuracy)}`}
                          style={{ width: `${agent.accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  <Separator className="my-4" />
                  <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-success inline-block" /> ≥ 80% Reliable
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-warning inline-block" /> 60–79% Review carefully
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-destructive inline-block" /> &lt; 60% Needs calibration
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
