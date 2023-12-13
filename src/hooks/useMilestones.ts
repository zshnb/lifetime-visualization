import {useCallback, useEffect, useState} from "react";
import {Milestone} from "@/components/CustomMilestoneDialog";
import {addYears, parseISO} from "date-fns";
import useStorage from "@/hooks/useStorage";
import {sortMilestones} from "@/utils/milestoneUtil";

const defaultMilestoneDurationYears = [3, 3, 6, 3, 3, 4]
export default function useMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      label: '童年',
      color: 'bg-zinc-400',
    },
    {
      label: '幼儿园',
      color: 'bg-red-600',
    },
    {
      label: '小学',
      color: 'bg-orange-400',
    },
    {
      label: '初中',
      color: 'bg-yellow-400',
    },
    {
      label: '高中',
      color: 'bg-rose-400',
    },
    {
      label: '大学本科',
      color: 'bg-cyan-400',
    },
    {
      label: '日常',
      color: 'bg-green-200',
    },
    {
      label: '今天',
      color: 'bg-sky-600',
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
  return {
    milestones,
    addMilestone,
    removeMilestone,
    confirmDefaultMilestone,
    isMilestoneExist
  }
}