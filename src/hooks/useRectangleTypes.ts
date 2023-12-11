import {useCallback, useState} from "react";
import {Milestone} from "@/components/CustomMilestoneDialog";

export default function useRectangleTypes() {
  const unit = useState(12)
  const [rectangleTypes, setRectangleTypes] = useState([
    {
      label: '出生',
      backgroundColor: 'bg-zinc-400'
    },
    {
      label: '幼儿园',
      backgroundColor: 'bg-red-600'
    },
    {
      label: '小学',
      backgroundColor: 'bg-orange-400'
    },
    {
      label: '初中',
      backgroundColor: 'bg-yellow-400'
    },
    {
      label: '高中',
      backgroundColor: 'bg-rose-400'
    },
    {
      label: '大学专科',
      backgroundColor: 'bg-purple-400'
    },
    {
      label: '大学本科',
      backgroundColor: 'bg-cyan-400'
    },
    {
      label: '硕士',
      backgroundColor: 'bg-pink-400'
    },
    {
      label: '博士',
      backgroundColor: 'bg-lime-400'
    },
    {
      label: '平凡的一天',
      backgroundColor: 'bg-green-200'
    },
    {
      label: '今天',
      backgroundColor: 'bg-sky-600'
    },
  ])

  const addMilestone = useCallback((milestone: Milestone) => {
    setRectangleTypes([...rectangleTypes, {
      label: milestone.name,
      backgroundColor: milestone.color
    }])
  }, [])
  return {
    rectangleTypes,
    addMilestone
  }
}