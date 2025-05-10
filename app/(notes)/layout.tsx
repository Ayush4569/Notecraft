import { Sidebar } from "./_components/sidebar";

export default function ({children}:{children:React.ReactNode}){
   return (
    <div className="flex h-full w-full">
    <Sidebar/>
    {children}
    </div>
   )
}