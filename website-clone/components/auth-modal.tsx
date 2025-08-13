"use client"

import type React from "react"

import { useState } from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, X } from "lucide-react"
import { signIn, signUp } from "@/lib/actions"

function SubmitButton({ children, pending }: { children: React.ReactNode; pending: boolean }) {
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </Button>
  )
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { pending } = useFormStatus()
  const [state, formAction] = useActionState(signIn, null)

  // Handle successful login
  if (state?.success) {
    onSuccess()
  }

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{state.error}</div>
      )}

      <div className="space-y-2">
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          id="login-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="border-gray-300"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <Input id="login-password" name="password" type="password" required className="border-gray-300" />
      </div>

      <SubmitButton pending={pending}>Sign In</SubmitButton>
    </form>
  )
}

function SignUpForm() {
  const { pending } = useFormStatus()
  const [state, formAction] = useActionState(signUp, null)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{state.error}</div>
      )}

      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
          {state.success}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          id="signup-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="border-gray-300"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <Input id="signup-password" name="password" type="password" required className="border-gray-300" />
      </div>

      <SubmitButton pending={pending}>Create Account</SubmitButton>
    </form>
  )
}

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState("login")

  const handleSuccess = () => {
    onClose()
    window.location.reload() // Refresh to update auth state
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">Welcome to Fruitstand</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <LoginForm onSuccess={handleSuccess} />
          </TabsContent>

          <TabsContent value="signup" className="mt-6">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
