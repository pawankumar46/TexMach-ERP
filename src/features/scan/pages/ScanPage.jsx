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
import {
  SCAN_TASK_HINTS,
  SCAN_TASK_TYPES,
  SCRAP_DISPOSITIONS,
  SCRAP_DISPOSITION_HINTS,
  SCRAP_DISPOSITION_LABELS,
  getScanTaskLabel,
} from "@/constants/scan-tasks"

const TASK_TABS = [
  { id: "all", label: "Everything" },
  { id: SCAN_TASK_TYPES.ASSIGN_WAREHOUSE, label: "Assign to warehouse" },
  { id: SCAN_TASK_TYPES.RETAIN_IN_STORE, label: "Retain in store" },
  { id: SCAN_TASK_TYPES.SCRAP, label: "Scrape" },
  { id: SCAN_TASK_TYPES.EXCHANGE, label: "Exchange" },
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
  const [scrapDisposition, setScrapDisposition] = useState(SCRAP_DISPOSITIONS.RECOVERABLE)

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks, activeType, selectedFacilityId])

  const openScan = (task) => {
    setActiveTask(task)
    setScanValue("")
    setScrapDisposition(SCRAP_DISPOSITIONS.RECOVERABLE)
  }

  const handleComplete = async () => {
    try {
      const disposition =
        activeTask?.type === SCAN_TASK_TYPES.SCRAP ? scrapDisposition : null
      await completeTask(activeTask.id, scanValue, disposition)
      toast.success("Done. The system has recorded this component scan.")
      setActiveTask(null)
      setScanValue("")
    } catch (completeError) {
      toast.error(completeError.message)
    }
  }

  const scrapReady =
    activeTask?.type !== SCAN_TASK_TYPES.SCRAP || Boolean(scrapDisposition)

  return (
    <div>
      <PageHeader
        title="Scan a component"
        description="First scan and assign a component to a warehouse. Then retain it in store, scrape it (recoverable or final), or exchange it."
      />

      <Card className="mb-5 border-navy-100 bg-navy-50/70 p-4">
        <ol className="grid gap-2 text-sm text-navy-900 sm:grid-cols-2 lg:grid-cols-4">
          <li>
            <span className="font-semibold">1. Assign to warehouse</span>
            <p className="text-xs text-muted">Scan the part and put it on a venue bin.</p>
          </li>
          <li>
            <span className="font-semibold">2. Retain in store</span>
            <p className="text-xs text-muted">Keep the component available in the store.</p>
          </li>
          <li>
            <span className="font-semibold">3. Scrape</span>
            <p className="text-xs text-muted">Recoverable scrape or final scrape.</p>
          </li>
          <li>
            <span className="font-semibold">4. Exchange</span>
            <p className="text-xs text-muted">Swap / replace the component.</p>
          </li>
        </ol>
      </Card>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {TASK_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveType(tab.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
              activeType === tab.id
                ? "bg-navy-800 text-white"
                : "border border-line bg-white text-navy-800"
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
          description="There are no components waiting to be scanned for this venue."
        />
      ) : null}

      {!loading && !error && tasks.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {tasks.map((task) => {
            const facility = getFacilityById(task.facilityId)

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
                  <p className="truncate font-semibold text-navy-900">{task.componentName}</p>
                  <p className="font-mono text-xs text-navy-700">{task.componentId}</p>
                  <p className="text-xs text-muted">
                    {task.variantName} · for {task.productName}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted">{SCAN_TASK_HINTS[task.type]}</p>
                  <p className="mt-1 text-xs text-muted">
                    {facility?.name} · bin {task.bin} · {task.reference}
                  </p>
                  {task.status !== "completed" ? (
                    <Button size="sm" className="mt-3" onClick={() => openScan(task)}>
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
        title="Scan this component"
        description={
          activeTask
            ? `${SCAN_TASK_HINTS[activeTask.type]} Expected code: ${activeTask.barcode}.`
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
              disabled={!scanValue || !scrapReady}
            >
              Done, I scanned it
            </Button>
          </div>
        }
      >
        {activeTask ? (
          <div className="mb-4 rounded-xl border border-line bg-slate-50 p-3 text-sm">
            <p className="font-semibold text-navy-900">{activeTask.componentName}</p>
            <p className="font-mono text-xs text-muted">{activeTask.componentId}</p>
            <p className="mt-1 text-xs text-muted">
              {activeTask.variantName} · {activeTask.productName}
            </p>
          </div>
        ) : null}

        {activeTask?.type === SCAN_TASK_TYPES.SCRAP ? (
          <fieldset className="mb-4 space-y-2">
            <legend className="mb-1.5 text-sm font-medium text-slate-700">Scrape type</legend>
            {[SCRAP_DISPOSITIONS.RECOVERABLE, SCRAP_DISPOSITIONS.FINAL].map((option) => (
              <label
                key={option}
                className={`flex cursor-pointer gap-3 rounded-xl border px-3 py-2.5 ${
                  scrapDisposition === option
                    ? "border-navy-600 bg-navy-50"
                    : "border-line bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="scrap-disposition"
                  className="mt-1"
                  checked={scrapDisposition === option}
                  onChange={() => setScrapDisposition(option)}
                />
                <span>
                  <span className="block text-sm font-semibold text-navy-900">
                    {SCRAP_DISPOSITION_LABELS[option]}
                  </span>
                  <span className="block text-xs text-muted">{SCRAP_DISPOSITION_HINTS[option]}</span>
                </span>
              </label>
            ))}
          </fieldset>
        ) : null}

        <Label htmlFor="scan">Component code</Label>
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
