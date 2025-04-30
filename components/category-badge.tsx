import { cn } from "@/lib/utils"

const categoryColors = {
  "Micro-escape": "bg-emerald-100 text-emerald-700",
  "Body reboot": "bg-orange-100 text-orange-700",
  "City-lens": "bg-blue-100 text-blue-700",
  "Craft burst": "bg-purple-100 text-purple-700",
  "Learning bite": "bg-amber-100 text-amber-700",
}

export default function CategoryBadge({ category, className }) {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-medium",
        categoryColors[category] || "bg-slate-100 text-slate-700",
        className,
      )}
    >
      {category}
    </span>
  )
}
