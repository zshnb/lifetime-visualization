import {useCallback, useState} from "react";
import {Milestone} from "@/components/CustomMilestoneDialog";
import {hexColorToTw} from "@/utils/colorUtil";
import {addDays, addYears} from "date-fns";

const defaultMilestoneDurationYears = [3, 3, 6, 3, 3, 4, 3, 4]
export default function useMilestones() {
  const [unit, setUnit] = useState(12)
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      label: '出生',
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
      label: '硕士',
      color: 'bg-pink-400',
    },
    {
      label: '博士',
      color: 'bg-lime-400',
    },
    {
      label: '平凡的一天',
      color: 'bg-green-200',
    },
    {
      label: '今天',
      color: 'bg-sky-600',
    },
  ])

  const addMilestone = useCallback((milestone: Milestone) => {
    setMilestones([...milestones, {
      label: milestone.label,
      color: hexColorToTw(milestone.color),
    }])
  }, [])

  const removeMilestone = useCallback((index: number) => {
    milestones.splice(index, 1)
    setMilestones([...milestones])
  }, [])

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
  }, [])
  return {
    milestones,
    addMilestone,
    removeMilestone,
    confirmDefaultMilestone
  }
}