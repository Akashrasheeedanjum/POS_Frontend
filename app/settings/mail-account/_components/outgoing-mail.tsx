"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Lock, Send, Server, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function OutgoingMail() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

  }

  return (
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-6 w-6" />
            <CardTitle className="text-xl font-semibold">Outgoing Mail Account</CardTitle>
          </div>
          <CardDescription className="text-rose-100">Configure your outgoing email server settings</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-rose-500" />
                  <Label htmlFor="smtp" className="font-medium">
                    SMTP (outgoing mail)
                  </Label>
                </div>
                <Input
                  id="smtp"
                  placeholder="smtp.example.com"
                  required
                  className="border-rose-100 focus-visible:ring-rose-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-rose-500" />
                  <Label htmlFor="port" className="font-medium">
                    Port
                  </Label>
                </div>
                <Input id="port" placeholder="587" required className="border-rose-100 focus-visible:ring-rose-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-rose-500" />
                  <Label htmlFor="email" className="font-medium">
                    Email user
                  </Label>
                </div>
                <Input
                  id="email"
                  placeholder="user@example.com"
                  required
                  className="border-rose-100 focus-visible:ring-rose-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-rose-500" />
                  <Label htmlFor="password" className="font-medium">
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="border-rose-100 focus-visible:ring-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tls" className="font-medium">
                  TLS Connection
                  <span className="ml-2 text-xs text-muted-foreground">Server requires secure connection</span>
                </Label>
                <Select defaultValue="implicit">
                  <SelectTrigger id="tls" className="border-rose-100 focus-visible:ring-rose-500">
                    <SelectValue placeholder="Select TLS option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="implicit">Use Implicit TLS</SelectItem>
                    <SelectItem value="starttls">Use STARTTLS</SelectItem>
                    <SelectItem value="none">No encryption</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tlsMethod" className="font-medium">
                  TLS Method
                </Label>
                <Select defaultValue="tlsv1">
                  <SelectTrigger id="tlsMethod" className="border-rose-100 focus-visible:ring-rose-500">
                    <SelectValue placeholder="Select TLS version" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tlsv1">TLSv1</SelectItem>
                    <SelectItem value="tlsv1.1">TLSv1.1</SelectItem>
                    <SelectItem value="tlsv1.2">TLSv1.2</SelectItem>
                    <SelectItem value="tlsv1.3">TLSv1.3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-rose-500" />
                <Label htmlFor="replyEmail" className="font-medium">
                  Reply Email address
                </Label>
              </div>
              <Input
                id="replyEmail"
                placeholder="reply@example.com"
                className="border-rose-100 focus-visible:ring-rose-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-rose-500" />
                <Label htmlFor="reportEmail" className="font-medium">
                  Destination email address for Z Report
                </Label>
              </div>
              <Input
                id="reportEmail"
                placeholder="reports@example.com"
                className="border-rose-100 focus-visible:ring-rose-500"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end border-t p-6 bg-gray-50 dark:bg-transparent ">
            <Button
              type="submit"
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Testing...
                </>
              ) : (
                <>Test</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
  )
}

