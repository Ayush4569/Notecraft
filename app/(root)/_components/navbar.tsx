'use client'
import React from 'react'
import Logo from './logo'
import { ModeToggle } from '@/components/mode-toggle'
import { cn } from '@/lib/utils'
import { useScroll } from '@/hooks/useScroll'

const navbar = () => {
    const scrolled = useScroll()
  return (
    <div className={cn('w-full z-50 bg-background p-4 flex items-center justify-between fixed top-0 dark:bg-[#1f1f1f]',scrolled && 'border-b shadow-sm')}>
      <Logo/>
      <div className='flex items-center gap-x-2 justify-between '>
       <ModeToggle />
      </div>
    </div>
  )
}

export default navbar
