import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function Documents() {
  return (
    <div className='px-2 py-4 h-full w-full flex flex-col justify-center items-center gap-y-4 '>
      <Image
       src='/unboxing.svg'
       alt='unboxing'
       width={300}
       height={300}
      />
      <h2 className='text-xl font-medium'>Welcome to your workspace</h2>
      <Button>
        <PlusCircleIcon className='h-4 w-4'/>
        Create a note
      </Button>
    </div>
  )
}
