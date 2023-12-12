import {JSX, useState} from "react";

export type RectangleProps = {
  backgroundColor?: string
  date?: string
  stage?: JSX.Element
  onClick?: () => void
}
export default function Rectangle(props: RectangleProps) {
  const [hover, setHover] = useState(false)
  return (
    <>
      <div className={`relative w-4 h-4 border-0 rounded ${props.backgroundColor}`}
           onMouseEnter={() => setHover(true)}
           onMouseLeave={() => setHover(false)}
           onClick={props.onClick}
      >
        {
          props.stage && (
            <div
              className={`absolute border border-gray-300 -top-16 flex-col ${hover ? 'flex' : 'hidden'} w-[300px] p-4 rounded z-10 bg-white`}>
              <div className='flex gap-2'>
                <p>{props.stage}</p>
                <p>今天是{props.date}</p>
              </div>
            </div>
          )
        }
      </div>
    </>
  )
}