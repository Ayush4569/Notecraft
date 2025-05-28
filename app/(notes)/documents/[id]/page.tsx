interface ParamsType {
  params : Promise<{id:string}>
}
export default async function ({params}:ParamsType) {
  
  const id = (await (params)).id
  return (
    <div>
    </div>
  )
}

