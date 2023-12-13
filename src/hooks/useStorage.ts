import {Milestone} from "@/components/CustomMilestoneDialog";
import {merge} from 'lodash'

export type StorageSchema = {
  user?: {
    birthday?: number
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
      const merged = merge(existData, schema)
      console.log('merged', merged)
      window.localStorage.setItem(key, JSON.stringify(merged))
    } else {
      window.localStorage.setItem(key, JSON.stringify(schema))
    }
  }

  const load = () => {
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