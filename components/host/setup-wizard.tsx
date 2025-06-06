"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedInput } from "@/components/ui/animated-input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useWallet } from "@/hooks/use-wallet"
import { ArrowLeft, ArrowRight, Download, Wallet, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedIcon } from "@/components/ui/animated-icon"

export function SetupWizard() {
  const { connected } = useWallet()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    nodeType: "standard",
    deviceType: "",
    nodeName: "",
    location: "",
    bandwidth: "",
    termsAccepted: false,
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return formData.nodeType !== ""
      case 2:
        return formData.deviceType !== "" && formData.nodeName !== ""
      case 3:
        return formData.location !== "" && formData.bandwidth !== ""
      case 4:
        return formData.termsAccepted && connected
      default:
        return false
    }
  }

  return (
    <Card className="glass-card overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 animated-gradient"></div>
      <CardHeader>
        <CardTitle>Node Setup Wizard</CardTitle>
        <CardDescription>Follow these steps to set up your node</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{getStepName(currentStep)}</span>
          </div>
          <motion.div
            initial={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5 }}
          >
            <Progress value={progress} className="h-2" />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 py-4"
            >
              <h3 className="text-lg font-medium">Select Node Type</h3>
              <RadioGroup
                value={formData.nodeType}
                onValueChange={(value) => handleInputChange("nodeType", value)}
                className="space-y-4"
              >
                <motion.div
                  className="flex items-start space-x-3 space-y-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <RadioGroupItem value="standard" id="standard" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="standard" className="font-medium">
                      Standard Node
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Basic node setup for home users. Shares your WiFi connection with nearby users. Earns standard
                      rewards based on usage.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start space-x-3 space-y-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <RadioGroupItem value="premium" id="premium" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="premium" className="font-medium">
                      Premium Node
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enhanced node with higher bandwidth allocation and priority in the network. Requires staking 100
                      PUB tokens. Earns 2x rewards.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start space-x-3 space-y-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <RadioGroupItem value="validator" id="validator" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="validator" className="font-medium">
                      Validator Node
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Full validator node that participates in network consensus and governance. Requires staking 1000
                      PUB tokens. Earns highest rewards.
                    </p>
                  </div>
                </motion.div>
              </RadioGroup>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 py-4"
            >
              <h3 className="text-lg font-medium">Device Configuration</h3>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Label htmlFor="device-type">Device Type</Label>
                <Select value={formData.deviceType} onValueChange={(value) => handleInputChange("deviceType", value)}>
                  <SelectTrigger id="device-type">
                    <SelectValue placeholder="Select your device type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="raspberry-pi">Raspberry Pi</SelectItem>
                    <SelectItem value="mini-pc">Mini PC</SelectItem>
                    <SelectItem value="router">Router</SelectItem>
                    <SelectItem value="desktop">Desktop Computer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Label htmlFor="node-name">Node Name</Label>
                <AnimatedInput
                  id="node-name"
                  placeholder="Enter a name for your node"
                  value={formData.nodeName}
                  onChange={(e) => handleInputChange("nodeName", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This name will be visible to users connecting to your node
                </p>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 py-4"
            >
              <h3 className="text-lg font-medium">Network Settings</h3>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Label htmlFor="location">Location</Label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select your location precision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="precise">Precise (Exact coordinates)</SelectItem>
                    <SelectItem value="approximate">Approximate (Neighborhood level)</SelectItem>
                    <SelectItem value="city">City only</SelectItem>
                    <SelectItem value="hidden">Hidden (Not shown on map)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Controls how precisely your node location is shown on the network map
                </p>
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Label htmlFor="bandwidth">Bandwidth Allocation</Label>
                <Select value={formData.bandwidth} onValueChange={(value) => handleInputChange("bandwidth", value)}>
                  <SelectTrigger id="bandwidth">
                    <SelectValue placeholder="Select bandwidth allocation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25% of available bandwidth</SelectItem>
                    <SelectItem value="50">50% of available bandwidth</SelectItem>
                    <SelectItem value="75">75% of available bandwidth</SelectItem>
                    <SelectItem value="100">100% of available bandwidth</SelectItem>
                    <SelectItem value="custom">Custom limit</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How much of your internet bandwidth to share with the network
                </p>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 py-4"
            >
              <h3 className="text-lg font-medium">Finalize Setup</h3>

              <div className="space-y-4">
                <motion.div
                  className="flex items-start space-x-3 space-y-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => handleInputChange("termsAccepted", checked === true)}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="terms" className="font-medium">
                      Terms & Conditions
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I agree to the{" "}
                      <a href="#" className="text-primary underline">
                        Terms of Service
                      </a>{" "}
                      and
                      <a href="#" className="text-primary underline">
                        {" "}
                        Privacy Policy
                      </a>
                      . I understand that I am responsible for ensuring compliance with my ISP's terms of service
                      regarding bandwidth sharing.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="p-4 border rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AnimatedIcon icon={<Wallet className="h-5 w-5 text-primary" />} effect="pulse" />
                    <h4 className="font-medium">Connect Wallet</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your Solana wallet to receive node operation rewards
                  </p>

                  {connected ? (
                    <motion.div
                      className="flex items-center gap-2 text-green-500"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Wallet Connected</span>
                    </motion.div>
                  ) : (
                    <AnimatedButton variant="outline" className="w-full" disabled>
                      Connect Wallet
                    </AnimatedButton>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex justify-between">
        <AnimatedButton variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </AnimatedButton>

        {currentStep < totalSteps ? (
          <AnimatedButton onClick={handleNext} disabled={!isStepComplete()}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </AnimatedButton>
        ) : (
          <AnimatedButton onClick={() => (window.location.href = "/host/dashboard")} disabled={!isStepComplete()}>
            <Download className="mr-2 h-4 w-4" /> Download Node Software
          </AnimatedButton>
        )}
      </CardFooter>
    </Card>
  )
}

function getStepName(step: number): string {
  switch (step) {
    case 1:
      return "Node Type"
    case 2:
      return "Device Configuration"
    case 3:
      return "Network Settings"
    case 4:
      return "Finalize Setup"
    default:
      return ""
  }
}
