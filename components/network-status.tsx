import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, Signal, Activity } from "lucide-react"

export function NetworkStatus() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Network Status</CardTitle>
          <CardDescription>Current connection information</CardDescription>
        </div>
        <Badge className="bg-green-500">Connected</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wifi className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Connected to</span>
            </div>
            <span className="text-sm">ThePublic-Node-42</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Signal className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Signal Strength</span>
            </div>
            <div className="flex items-center">
              <div className="w-1 h-3 bg-primary mx-0.5 rounded-sm"></div>
              <div className="w-1 h-4 bg-primary mx-0.5 rounded-sm"></div>
              <div className="w-1 h-5 bg-primary mx-0.5 rounded-sm"></div>
              <div className="w-1 h-6 bg-primary mx-0.5 rounded-sm"></div>
              <div className="w-1 h-7 bg-muted mx-0.5 rounded-sm"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Speed</span>
            </div>
            <span className="text-sm">85 Mbps</span>
          </div>

          <div className="pt-4">
            <div className="text-xs text-muted-foreground mb-1">Connection Security</div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[95%]"></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">Blockchain Secured</span>
              <span className="text-xs font-medium">95%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
