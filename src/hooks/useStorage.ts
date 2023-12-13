import {Milestone} from "@/components/CustomMilestoneDialog";

export type StorageSchema = {
  user?: {
    birthday?: string
    maxYear?: number
    unit?: number
  },
  milestones?: Milestone[]
}
const key = 'lifetime__db'
export default function useStorage() {
  const save = (schema: StorageSchema) => {
    const existData = load()
    if (existData) {
      const merged = Object.assign(existData, schema)
      window.localStorage.setItem(key, JSON.stringify(merged))
    } else {
      window.localStorage.setItem(key, JSON.stringify(schema))
    }
  }

  const load = (): StorageSchema | undefined => {
    const data = window.localStorage.getItem(key)
    if (data) {
      return JSON.parse(data) as StorageSchema
    } else {
      return undefined
    }
  }

  return {
    save,
    load
  }
}