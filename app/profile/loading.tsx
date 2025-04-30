import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-indigo-50">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
        <p className="text-sm text-slate-600">Loading profile...</p>
      </div>
    </div>
  )
}
