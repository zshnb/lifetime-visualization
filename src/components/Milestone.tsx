import Rectangle from "@/components/Rectangle";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";
import React, {RefObject, useState} from "react";
import {CustomMilestoneDialogRef, Milestone} from "@/components/CustomMilestoneDialog";
import useMilestones from "@/hooks/useMilestones";
import Image from "next/image";

export type MilestoneProps = {
  customMilestoneRef: RefObject<CustomMilestoneDialogRef | null>
  milestone: Milestone
  index: number
}

function MilestoneComponent({customMilestoneRef, milestone, index}: MilestoneProps) {
  const {removeMilestone} = useMilestones()
  const {label, color, startDate, site} = milestone
  const [hover, setHover] = useState(false)
  return (
    <div className='flex flex-col min-w-[138px] items-center'>
      <div
        className='w-fit shrink-0 bg-white border border-solid border-[#D7D3C8] rounded-[14px] px-6 py-[10px] shadow-[0_2px_0_0_#D7D3C8] z-10 relative'
        key={label}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className='cursor-pointer flex gap-2 justify-center items-center' onClick={() => {
          customMilestoneRef.current?.open(milestone)
        }}>
          <Rectangle className='cursor-pointer' backgroundColor={color} key={label}/>
          <p>{label}</p>
        </div>
        {
          startDate && (
            <FontAwesomeIcon
              className={`${hover ? 'inline' : 'hidden'} absolute top-[14px] right-2 cursor-pointer`}
              icon={faClose}
              onClick={() => removeMilestone(index)}/>
          )
        }
      </div>
      <div className='flex flex-col items-center gap-y-1 mt-3'>
        <p className='text-[#726647] text-base font-semibold'>1996-05-24</p>
        <div className='inline-block w-[1px] h-4 bg-[#D7D3C8]'></div>
        <p className='text-[#726647] text-base font-semibold'>1996-05-24</p>
        {
          site && (
            <>
              <Image src='/lifetime/site.svg' alt='site' width={14} height={19}/>
              <p className='text-[#726647] text-base font-semibold'>{site}</p>
            </>
          )
        }
      </div>
    </div>
  )
}

const MilestoneRectangle = React.memo(MilestoneComponent)
export default MilestoneRectangle