import {useCallback, useState} from "react";
import {Milestone} from "@/components/CustomMilestoneDialog";
import {hexColorToTw} from "@/utils/colorUtil";

export default function useMilestones() {
  const [unit, setUnit] = useState(12)
  const [milestones, setMilestones] = useState([
    {
      label: '出生',
      backgroundColor: 'bg-zinc-400',
      duration: 3,
      unit: 1,
    },
    {
      label: '幼儿园',
      backgroundColor: 'bg-red-600',
      duration: 3,
      unit: 1,
    },
    {
      label: '小学',
      backgroundColor: 'bg-orange-400',
      duration: 6,
      unit: 1,
    },
    {
      label: '初中',
      backgroundColor: 'bg-yellow-400',
      duration: 3,
      unit: 1,
    },
    {
      label: '高中',
      backgroundColor: 'bg-rose-400',
      duration: 3,
      unit: 1,
    },
    {
      label: '大学专科',
      backgroundColor: 'bg-purple-400',
      duration: 3,
      unit: 1,
    },
    {
      label: '大学本科',
      backgroundColor: 'bg-cyan-400',
      duration: 4,
      unit: 1,
    },
    {
      label: '硕士',
      backgroundColor: 'bg-pink-400',
      duration: 3,
      unit: 1,
    },
    {
      label: '博士',
      backgroundColor: 'bg-lime-400',
      duration: 4,
      unit: 1,
    },
    {
      label: '平凡的一天',
      backgroundColor: 'bg-green-200',
      duration: undefined,
      unit: 1
    },
    {
      label: '今天',
      backgroundColor: 'bg-sky-600',
      duration: undefined,
      unit: 1
    },
  ])

  const addMilestone = useCallback((milestone: Milestone) => {
    setMilestones([...milestones, {
      label: milestone.name,
      backgroundColor: hexColorToTw(milestone.color),
      duration: milestone.duration,
      unit: milestone.unit
    }])
  }, [])
  return {
    milestones,
    addMilestone
  }
}