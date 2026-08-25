import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ScanLine } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input, Label } from "@/components/ui/input"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { TableSkeleton } from "@/components/ui/loading-skeleton"
import { ProductImage } from "@/components/inventory/ProductImage"
import { Dialog } from "@/components/ui/dialog"
import { useScanStore } from "@/store/useScanStore"
import { useFacilityStore } from "@/store/useFacilityStore"
import { getFacilityById } from "@/data/facilities"
import { SCAN_TASK_HINTS, SCAN_TASK_TYPES, getScanTaskLabel } from "@/constants/scan-tasks"

const TASK_TABS = [
  { id: "all", label: "Everything" },
  { id: SCAN_TASK_TYPES.GRN, label: "New arrivals" },
  { id: SCAN_TASK_TYPES.PUTAWAY, label: "Put away" },
  { id: SCAN_TASK_TYPES.PICKING, label: "Going out" },
  { id: SCAN_TASK_TYPES.CYCLE_COUNT, label: "Stock check" },
]

export const ScanPage = () => {
  const tasks = useScanStore((state) => state.tasks)
  const loading = useScanStore((state) => state.loading)
  const error = useScanStore((state) => state.error)
  const activeType = useScanStore((state) => state.activeType)
  const setActiveType = useScanStore((state) => state.setActiveType)
  const fetchTasks = useScanStore((state) => state.fetchTasks)
  const completeTask = useScanStore((state) => state.completeTask)
  const completingId = useScanStore((state) => state.completingId)
  const selectedFacilityId = useFacilityStore((state) => state.selectedFacilityId)
  const [activeTask, setActiveTask] = useState(null)
  const [scanValue, setScanValue] = useState("")

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks, activeType, selectedFacilityId])

  const handleComplete = async () => {
    try {
      await completeTask(activeTask.id, scanValue)
      toast.success("Done. The system has recorded this scan.")
      setActiveTask(null)
      setScanValue("")
    } catch (completeError) {
      toast.error(completeError.message)
    }
  }

  return (
    <div>
      <PageHeader
        title="Scan a machine"
        description="Point a handheld scanner at the barcode on the machine. That tells the system it arrived, it was put on a shelf, it went out to a customer, or it is still in the store."
      />
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {TASK_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveType(tab.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
              activeType === tab.id ? "bg-navy-800 text-white" : "bg-white text-navy-800 border border-line"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? <TableSkeleton /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={fetchTasks} /> : null}
      {!loading && !error && !tasks.length ? (
        <EmptyState
          icon={ScanLine}
          title="Nothing to scan"
          description="There are no machines waiting to be scanned at this store."
        />
      ) : null}

      {!loading && !error && tasks.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {tasks.map((task) => {
            const facility = getFacilityById(task.facilityId)
            const qtyLabel = task.expectedQty === 1 ? "1 machine" : `${task.expectedQty} machines`

            return (
              <Card key={task.id} className="flex gap-4">
                <ProductImage src={task.image} alt="" className="h-20 w-20 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <Badge tone="navy">{getScanTaskLabel(task.type)}</Badge>
                    <Badge tone={task.status === "completed" ? "green" : "amber"}>
                      {task.status === "completed" ? "Finished" : "Not scanned yet"}
                    </Badge>
                  </div>
                  <p className="truncate font-semibold text-navy-900">{task.productName}</p>
                  <p className="text-xs leading-5 text-muted">{SCAN_TASK_HINTS[task.type]}</p>
                  <p className="mt-1 text-xs text-muted">
                    {qtyLabel} · {facility?.name} · shelf {task.bin}
                  </p>
                  {task.status !== "completed" ? (
                    <Button
                      size="sm"
                      className="mt-3"
                      onClick={() => {
                        setActiveTask(task)
                        setScanValue("")
                      }}
                    >
                      Scan now
                    </Button>
                  ) : null}
                </div>
              </Card>
            )
          })}
        </div>
      ) : null}

      <Dialog
        open={Boolean(activeTask)}
        onClose={() => setActiveTask(null)}
        title="Scan this machine"
        description={
          activeTask
            ? `${SCAN_TASK_HINTS[activeTask.type]} The code on the machine should be ${activeTask.barcode}.`
            : ""
        }
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="secondary" onClick={() => setScanValue(activeTask?.barcode ?? "")}>
              I don’t have a scanner — fill the code
            </Button>
            <Button
              onClick={handleComplete}
              loading={Boolean(completingId)}
              disabled={!scanValue}
            >
              Done, I scanned it
            </Button>
          </div>
        }
      >
        <Label htmlFor="scan">Machine code</Label>
        <Input
          id="scan"
          value={scanValue}
          onChange={(event) => setScanValue(event.target.value)}
          placeholder="Scan the barcode, or type the code"
          autoFocus
        />
      </Dialog>
    </div>
  )
}
