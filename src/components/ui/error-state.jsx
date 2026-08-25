import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export const ErrorState = ({ title = "Unable to load data", message, onRetry }) => {
  return (
    <Card className="flex flex-col items-center px-6 py-12 text-center">
      <AlertCircle className="mb-3 h-8 w-8 text-red-600" aria-hidden="true" />
      <h3 className="text-lg font-semibold text-navy-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted">{message || "Please try again."}</p>
      {onRetry ? (
        <Button className="mt-5" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </Card>
  )
}
