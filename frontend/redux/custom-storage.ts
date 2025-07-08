import createWebStorage from "redux-persist/lib/storage/createWebStorage"

const createNoopStorage = () => {
  return {
    getItem: (_key: string) => Promise.resolve(null),
    setItem: (_key: string, value: any) => Promise.resolve(value),
    removeItem: (_key: string) => Promise.resolve(),
  }
}

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage()

export default storage