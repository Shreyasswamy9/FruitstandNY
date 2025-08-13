"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, ShoppingBag } from "lucide-react"
import { signOut } from "@/lib/actions"

interface UserMenuProps {
  user: {
    email?: string
  }
  onSignOut?: () => void
}

export default function UserMenu({ user, onSignOut }: UserMenuProps) {
  const handleSignOut = async () => {
    if (onSignOut) {
      onSignOut()
    } else {
      await signOut()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900">
          <User className="h-4 w-4 mr-2" />
          Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm text-gray-500">{user.email}</div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ShoppingBag className="h-4 w-4 mr-2" />
          Orders
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button onClick={handleSignOut} className="flex w-full items-center text-red-600 px-2 py-1.5 text-sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
