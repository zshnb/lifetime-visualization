import {useCallback, useState} from "react";
import {Milestone} from "@/components/CustomMilestoneDialog";
import {hexColorToTw} from "@/utils/colorUtil";

export default function useMilestones() {
  const [unit, setUnit] = useState(12)
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      label: '出生',
      color: 'bg-zinc-400',
      duration: 3,
      unit: 1,
    },
    {
      label: '幼儿园',
      color: 'bg-red-600',
      duration: 3,
      unit: 1,
    },
    {
      label: '小学',
      color: 'bg-orange-400',
      duration: 6,
      unit: 1,
    },
    {
      label: '初中',
      color: 'bg-yellow-400',
      duration: 3,
      unit: 1,
    },
    {
      label: '高中',
      color: 'bg-rose-400',
      duration: 3,
      unit: 1,
    },
    {
      label: '大学本科',
      color: 'bg-cyan-400',
      duration: 4,
      unit: 1,
    },
    {
      label: '硕士',
      color: 'bg-pink-400',
      duration: 3,
      unit: 1,
    },
    {
      label: '博士',
      color: 'bg-lime-400',
      duration: 4,
      unit: 1,
    },
    {
      label: '平凡的一天',
      color: 'bg-green-200',
      duration: -1,
      unit: 1
    },
    {
      label: '今天',
      color: 'bg-sky-600',
      duration: -1,
      unit: 1
    },
  ])

  const addMilestone = useCallback((milestone: Milestone) => {
    setMilestones([...milestones, {
      label: milestone.label,
      color: hexColorToTw(milestone.color),
      duration: milestone.duration,
      unit: milestone.unit
    }])
  }, [])
  return {
    milestones,
    addMilestone
  }
}