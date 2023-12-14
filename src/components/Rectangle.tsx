import {useMemo, useState} from "react";
import {buildLinearGradient, twColorToHex} from "@/utils/colorUtil";
import {Milestone} from "@/components/CustomMilestoneDialog";
import {format} from "date-fns";

export interface RectangleProps {
  backgroundColor?: string[] | string
  date?: Date
  unit?: number
  milestones?: Milestone[]
  onClick?: () => void
  className?: string
}

export default function Rectangle(props: RectangleProps) {
  const [hover, setHover] = useState(false)
  const style = useMemo(() => {
    if (typeof props.backgroundColor === 'object') {
      switch (props.backgroundColor.length) {
        case 1: {
          return {
            backgroundColor: props.backgroundColor[0]
          }
        }
        case 2: {
          const colors = props.backgroundColor.map(it => `${it} 50%`).join(',')
          return {
            background: `linear-gradient(to top, ${colors})`
          }
        }
        case 3: {
          const colors = props.backgroundColor
          return {
            background: `linear-gradient(to top, ${colors[0]} 33.33%, ${colors[1]} 33.33%, ${colors[1]} 66.66%, ${colors[2]} 66.66%)`
          }
        }
        case 4: {
          const colors1 = buildLinearGradient(props.backgroundColor[0], props.backgroundColor[1])
          const colors2 = buildLinearGradient(props.backgroundColor[2], props.backgroundColor[3])
          return {
            background: `linear-gradient(to right, ${colors1}), linear-gradient(to right, ${colors2})`,
            backgroundSize: '100% 50%',
            backgroundPosition: 'center top, center bottom',
            backgroundRepeat: 'no-repeat'
          }
        }
      }
    } else {
      return {
        backgroundColor: twColorToHex(props.backgroundColor as string)
      }
    }
  }, [props.backgroundColor])

  return (
    <div
      className={`relative w-4 h-4 border-0 rounded ${props.backgroundColor} ${props.className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={props.onClick}
      style={style}
    >
      {
        (props.milestones?.length || 0) > 0 && (
          <div
            className={`absolute border border-gray-300 -top-16 flex-col ${hover ? 'flex' : 'hidden'} w-[300px] p-4 rounded z-10 bg-white`}>
            <div className='flex flex-col gap-x-2'>
              {
                props.milestones!.map(it => {
                  let formatPattern = 'yyyy年MM月dd号'
                  switch (props.unit) {
                    case 1: {
                      formatPattern = 'yyyy年'
                      break
                    }
                    case 12: {
                      formatPattern = 'yyyy年MM月'
                      break
                    }
                    case 52: {
                      formatPattern = 'yyyy年MM月ww周'
                      break
                    }
                  }
                  return (
                    <div key={it.label} className='flex gap-2 items-center'>
                      <Rectangle backgroundColor={it.color}/>
                      <p>{it.label}</p>
                      <p>{format(props.date!, formatPattern)}</p>
                    </div>
                  )
                })
              }
            </div>
          </div>
        )
      }
    </div>
  )
}