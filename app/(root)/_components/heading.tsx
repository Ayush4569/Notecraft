'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const heading = () => {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas, Documents, & Plans. Unified. Welcome to 
         {" "}<span className="underline">Notecraft</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Notecraft is the connected workspace for your ideas, documents, and plans.
      </h3>
      <Button >
        Join Notecraft
        <ArrowRight className="h-6 w-6 ml-2"/>
      </Button>
    </div>
  )
}

export default heading
