import { useState, useEffect } from "react";

export const useScroll = () => {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {

    if (window.scrollY > window.screenTop) {
      setScrolled(true)
    }
    else { 
      setScrolled(false)
     }
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return scrolled
}