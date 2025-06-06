"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Coins, ArrowUpRight, Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data for the charts
const dailyRewards = [
  { day: "Mon", amount: 2.4 },
  { day: "Tue", amount: 3.1 },
  { day: "Wed", amount: 2.8 },
  { day: "Thu", amount: 3.5 },
  { day: "Fri", amount: 4.2 },
  { day: "Sat", amount: 3.9 },
  { day: "Sun", amount: 3.2 },
]

const monthlyRewards = [
  { month: "Jan", amount: 85 },
  { month: "Feb", amount: 92 },
  { month: "Mar", amount: 105 },
  { month: "Apr", amount: 110 },
  { month: "May", amount: 125 },
  { month: "Jun", amount: 118 },
]

const transactions = [
  {
    id: "tx1",
    date: "2023-04-18",
    time: "14:32",
    type: "Reward",
    amount: 3.5,
    status: "Confirmed",
  },
  {
    id: "tx2",
    date: "2023-04-17",
    time: "09:15",
    type: "Reward",
    amount: 4.2,
    status: "Confirmed",
  },
  {
    id: "tx3",
    date: "2023-04-16",
    time: "22:45",
    type: "Reward",
    amount: 3.8,
    status: "Confirmed",
  },
  {
    id: "tx4",
    date: "2023-04-15",
    time: "18:20",
    type: "Reward",
    amount: 2.9,
    status: "Confirmed",
  },
  {
    id: "tx5",
    date: "2023-04-14",
    time: "11:05",
    type: "Reward",
    amount: 3.1,
    status: "Confirmed",
  },
]

export function RewardHistory() {
  const [timeframe, setTimeframe] = useState("daily")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reward History</CardTitle>
            <CardDescription>Track your node operation rewards</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-primary">
              <Coins className="h-5 w-5" />
              <span className="font-bold">245.8 PUB</span>
            </div>
            <Button variant="outline" size="sm">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              Withdraw
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="chart" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="space-y-4">
            <div className="flex justify-end">
              <TabsList>
                <TabsTrigger
                  value="daily"
                  onClick={() => setTimeframe("daily")}
                  className={timeframe === "daily" ? "bg-primary text-primary-foreground" : ""}
                >
                  Daily
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  onClick={() => setTimeframe("monthly")}
                  className={timeframe === "monthly" ? "bg-primary text-primary-foreground" : ""}
                >
                  Monthly
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeframe === "daily" ? dailyRewards : monthlyRewards}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={timeframe === "daily" ? "day" : "month"} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">Total Rewards</div>
                <div className="text-2xl font-bold">245.8 PUB</div>
                <div className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +12.5% from last month
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">Estimated Monthly</div>
                <div className="text-2xl font-bold">120 PUB</div>
                <div className="text-xs text-muted-foreground mt-1">Based on current performance</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div className="font-medium">{tx.date}</div>
                        <div className="text-xs text-muted-foreground">{tx.time}</div>
                      </TableCell>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell className="text-right font-medium">{tx.amount} PUB</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          {tx.status}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export History
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
