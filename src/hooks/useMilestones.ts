import {useCallback, useEffect, useState} from "react";
import {Milestone} from "@/components/CustomMilestoneDialog";
import {endOfMonth, endOfWeek, parseISO, startOfWeek} from "date-fns";
import useStorage from "@/hooks/useStorage";
import {sortMilestones} from "@/utils/milestoneUtil";

const defaultMilestoneDurationYears = [3, 3, 6, 3, 3, 4]
export default function useMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      label: '童年',
      color: 'bg-zinc-400',
      images: [],
      default: true
    },
    {
      label: '幼儿园',
      color: 'bg-red-600',
      images: [],
      default: true
    },
    {
      label: '小学',
      color: 'bg-orange-400',
      images: [],
      default: true
    },
    {
      label: '初中',
      color: 'bg-yellow-400',
      images: [],
      default: true
    },
    {
      label: '高中',
      color: 'bg-rose-400',
      images: [],
      default: true
    },
    {
      label: '大学本科',
      color: 'bg-cyan-400',
      images: [],
      default: true
    },
    {
      label: '日常',
      color: 'bg-green-200',
      images: [],
      default: true
    }
  ])

  const {save, load} = useStorage()

  const addMilestone = useCallback((milestone: Milestone) => {
    milestones.splice(milestones.length - 1, 0, milestone)
    setMilestones([...sortMilestones(milestones)])
    save({
      milestones
    })
  }, [milestones])

  const updateMilestone = (oldLabel: string, milestone: Milestone) => {
    const index = milestones.findIndex(it => it.label === oldLabel)
    milestones[index] = milestone
    setMilestones([...sortMilestones(milestones)])
    save({
      milestones
    })
  }

  const removeMilestone = useCallback((index: number) => {
    milestones.splice(index, 1)
    setMilestones([...milestones])
    save({
      milestones
    })
  }, [milestones])

  /*
  * when change birthday, calculate milestone's start/end date
  * */
  const confirmMilestoneDate = (birthday: Date) => {
    const data = load()
    let pastYears = 0
    const month = birthday.getMonth()
    const extraSchoolGapYear = month < 8 ? 0 : 1 // 9.1 is school's enter date, if born after this date, need enter school next year
    const newMilestones: Milestone[] = (data?.milestones || milestones)
      .filter(it => it.default)
      .map(((it, index) => {
        let startDate
        if (index === 0) {
          startDate = birthday
        } else {
          startDate = index < defaultMilestoneDurationYears.length ?
            new Date(birthday.getFullYear() + pastYears + extraSchoolGapYear, 8, 1) : undefined
        }
        const object = {
          ...it,
          startDate,
          endDate: index < defaultMilestoneDurationYears.length ?
            new Date(birthday.getFullYear() + defaultMilestoneDurationYears[index] + pastYears + extraSchoolGapYear, 5, 1) :
            undefined
        }
        pastYears += defaultMilestoneDurationYears[index]
        return object
      }))
    setMilestones([...sortMilestones(newMilestones)])
    save({
      milestones: newMilestones
    })
  }

  const isMilestoneExist = (label: string) => {
    return milestones.find(it => it.label === label) !== undefined
  }

  useEffect(() => {
    const data = load()
    if (data?.milestones) {
      const newMilestones = data.milestones
        .map((it: Milestone) => {
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
            const endDate = endOfMonth(it.endDate!)
            return date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime()
          }
          case 52: {
            const startDate = startOfWeek(it.startDate!)
            const endDate = endOfWeek(it.endDate!)
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
    updateMilestone,
    removeMilestone,
    confirmMilestoneDate,
    isMilestoneExist,
    getCoveredMilestone
  }
}