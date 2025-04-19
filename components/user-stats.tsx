import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Download, Upload, Coins } from "lucide-react"

export function UserStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Statistics</CardTitle>
        <CardDescription>Usage and rewards information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Connected Time</span>
            </div>
            <span className="text-sm">14h 32m</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Download className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Downloaded</span>
            </div>
            <span className="text-sm">2.4 GB</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Upload className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Uploaded</span>
            </div>
            <span className="text-sm">0.8 GB</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Coins className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Tokens Earned</span>
            </div>
            <span className="text-sm">12.5 PUB</span>
          </div>

          <div className="pt-4">
            <div className="text-xs text-muted-foreground mb-1">Data Usage</div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[35%]"></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">3.2 GB of 10 GB</span>
              <span className="text-xs font-medium">35%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
