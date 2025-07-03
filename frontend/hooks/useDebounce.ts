import { PartialBlock } from "@blocknote/core";
import { useEffect, useState } from "react";

export const useDebounce = (value:string | PartialBlock[],delay:number)=>{
    const [debouncedValue, setDebouncedValue] = useState<string | PartialBlock[]>(value);
    useEffect(() => {
      const interval = setTimeout(()=>{
        setDebouncedValue(value);
      },
    delay|| 1000)
    
      return () => {
        clearTimeout(interval);
      }
    }, [value,delay])

    return debouncedValue;
}