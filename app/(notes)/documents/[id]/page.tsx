interface ParamsType {
  params : Promise<{id:string}>
}
export default async function ({params}:{params:Promise<{id:string}>}) {
  
  const id = (await (params)).id
  return (
    <div>
        doc page
    </div>
  )
}

