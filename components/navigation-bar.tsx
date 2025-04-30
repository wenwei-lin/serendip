"use client"

import { Calendar, User, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function NavigationBar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Tonight",
      href: "/tonight",
      icon: Calendar,
    },
    {
      name: "Spark",
      href: "/",
      icon: Sparkles,
      special: true,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center py-2 px-4 text-xs",
              pathname === item.href ? "text-rose-500" : "text-slate-500 hover:text-slate-900",
              item.special && "relative -mt-5",
            )}
          >
            {item.special ? (
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 flex items-center justify-center text-white">
                <item.icon className="h-6 w-6" />
              </div>
            ) : (
              <item.icon className="h-6 w-6 mb-1" />
            )}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
