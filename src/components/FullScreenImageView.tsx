import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";
import React, {forwardRef, Ref, useImperativeHandle, useState} from "react";

export type FullScreenImageViewRef = {
  open: (image: string) => void
}

function FullScreenImageView(props: {}, ref: Ref<FullScreenImageViewRef>) {
  const [image, setImage] = useState('')
  const [show, setShow] = useState(false)
  useImperativeHandle(ref, () => {
    return {
      open: (image: string) => {
        setImage(image)
        setShow(true)
      }
    }
  }, [])
  return (
    <div className={`w-[100vw] h-[100vh] bg-gray-200 ${show ? 'flex' : 'hidden'} absolute top-0 left-0 flex-col items-center z-[2000]`}>
      <div className='w-3/4 text-right'>
        <FontAwesomeIcon icon={faClose} className='cursor-pointer' onClick={() => {
          setShow(false)
          setImage('')
        }}/>
      </div>
      <div className='w-[45%]'>
        <img src={image}/>
      </div>
    </div>
  )
}

const FullScreenImageViewMemo = React.memo(forwardRef(FullScreenImageView))
export default FullScreenImageViewMemo