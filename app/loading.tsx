import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 pt-40 pb-20 sm:px-10 lg:px-14">
      {/* Hero Skeleton */}
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-4 w-[150px]" />
        <div className="space-y-4 pt-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-[80%]" />
        </div>
      </div>

      <div className="mt-24 grid items-start gap-20 lg:grid-cols-[1.1fr_1fr] lg:gap-28">
        <div className="space-y-6">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-[90%]" />
          <Skeleton className="h-6 w-[80%]" />
          <div className="flex gap-4 pt-8">
            <Skeleton className="h-14 w-[200px] rounded-full" />
            <Skeleton className="h-14 w-[140px] rounded-full" />
          </div>
        </div>
        
        {/* Phone Mockup Skeleton */}
        <div className="flex justify-center lg:justify-end">
          <Skeleton className="h-[500px] w-[260px] rounded-[2rem]" />
        </div>
      </div>
    </div>
  )
}