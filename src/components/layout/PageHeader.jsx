import { FadeIn } from "@/components/ui/motion"

export const PageHeader = ({ title, description, actions }) => {
  return (
    <FadeIn className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted sm:text-base">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </FadeIn>
  )
}
