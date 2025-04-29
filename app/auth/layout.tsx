import React from "react"

const Authlayout:React.FC<{children:React.ReactNode}> = ({children}) => {
  return (
    <div className="h-full flex items-center justify-center bg-sky-500">
       {children}
    </div>
  )
}

export default Authlayout
