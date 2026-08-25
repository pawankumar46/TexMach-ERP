import { useState } from "react"
import { Package } from "lucide-react"
import { cn } from "@/lib/utils"

export const ProductImage = ({ src, alt, className }) => {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-navy-50 text-navy-700",
          className,
        )}
      >
        <Package className="h-6 w-6" aria-hidden="true" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("object-cover", className)}
      onError={() => setFailed(true)}
    />
  )
}
