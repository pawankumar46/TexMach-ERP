import { Inbox } from "lucide-react"
import { Card } from "@/components/ui/card"

export const EmptyState = ({ icon: Icon = Inbox, title, description, action }) => {
  return (
    <Card className="flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy-700">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-navy-900">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  )
}
