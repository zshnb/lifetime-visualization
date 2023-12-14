import {useCallback, useEffect, useState} from "react";
import {Milestone} from "@/components/CustomMilestoneDialog";
import {addYears, endOfWeek, parseISO, startOfWeek} from "date-fns";
import useStorage from "@/hooks/useStorage";
import {sortMilestones} from "@/utils/milestoneUtil";

const defaultMilestoneDurationYears = [3, 3, 6, 3, 3, 4]
export default function useMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      label: '童年',
      color: 'bg-zinc-400',
      order: 0
    },
    {
      label: '幼儿园',
      color: 'bg-red-600',
      order: 1
    },
    {
      label: '小学',
      color: 'bg-orange-400',
      order: 2
    },
    {
      label: '初中',
      color: 'bg-yellow-400',
      order: 3
    },
    {
      label: '高中',
      color: 'bg-rose-400',
      order: 4
    },
    {
      label: '大学本科',
      color: 'bg-cyan-400',
      order: 5
    },
    {
      label: '日常',
      color: 'bg-green-200',
      order: 6
    },
    {
      label: '今天',
      color: 'bg-sky-600',
      order: 7
    },
  ])

  const {save, load} = useStorage()

  const addMilestone = useCallback((milestone: Milestone) => {
    milestones.splice(milestones.length - 2, 0, milestone)
    setMilestones([...sortMilestones(milestones)])
    save({
      milestones
    })
  }, [milestones])

  const removeMilestone = useCallback((index: number) => {
    milestones.splice(index, 1)
    setMilestones([...milestones])
    save({
      milestones
    })
  }, [milestones])

  const confirmDefaultMilestone = useCallback((birthday: Date) => {
    let pastYears = 0
    const newMilestones: Milestone[] = milestones.map(((it, index) => {
      const object = {
        ...it,
        startDate: index < defaultMilestoneDurationYears.length ? addYears(birthday, pastYears) : undefined,
        endDate: index < defaultMilestoneDurationYears.length ?
          addYears(birthday, defaultMilestoneDurationYears[index] + pastYears) :
          undefined
      }
      pastYears += defaultMilestoneDurationYears[index]
      return object
    }))
    setMilestones(newMilestones)
    save({
      milestones: newMilestones
    })
  }, [])

  const isMilestoneExist = (label: string) => {
    return milestones.find(it => it.label === label) !== undefined
  }

  useEffect(() => {
    const data = load()
    if (data?.milestones) {
      const newMilestones = data.milestones
        .map(it => {
          return {
            ...it,
            startDate: it.startDate ? parseISO(it.startDate + '') : undefined,
            endDate: it.endDate ? parseISO(it.endDate + '') : undefined
          }
        })
      setMilestones(sortMilestones(newMilestones))
    }
  }, []);

  const getCoveredMilestone = (date: Date, unit: number) => {
    return milestones
      .filter(it => it.startDate !== undefined && it.endDate !== undefined)
      .filter(it => {
        switch (unit) {
          case 1: {
            const startYear = it.startDate!.getFullYear()
            const endYear = it.endDate!.getFullYear()
            return date.getFullYear() >= startYear && date.getFullYear() <= endYear
          }
          case 12: {
            const startDate = new Date(it.startDate!.getFullYear(), it.startDate!.getMonth())
            const endDate = new Date(it.endDate!.getFullYear(), it.endDate!.getMonth())
            return date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime()
          }
          case 52: {
            const startDate = endOfWeek(it.startDate!)
            const endDate = startOfWeek(it.endDate!)
            return date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime()
          }
          case 365: {
            return date.getTime() >= it.startDate!.getTime() && date.getTime() <= it.endDate!.getTime()
          }
        }
      })
  }

  return {
    milestones,
    addMilestone,
    removeMilestone,
    confirmDefaultMilestone,
    isMilestoneExist,
    getCoveredMilestone
  }
}