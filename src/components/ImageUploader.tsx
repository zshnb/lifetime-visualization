import {Button, styled} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";

export type ImageUploaderProps = {

}
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
export default function ImageUploader({}: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  return (
    <div className='flex gap-x-2'>
      {
        images.length > 0 && (
          <div className='flex gap-x-2'>
            {
              images.map((it, index) => (
                  <div
                    className='relative w-[64px] h-[64px]'
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <img src={it} className='w-full h-full'/>
                    <div className={`w-[64px] h-[64px] bg-gray-200 opacity-60 ${index === hoveredIndex ? 'flex' : 'hidden'} absolute top-0 left-0 content-center items-center`}>
                      <FontAwesomeIcon icon={faTrash} className='flex-1 cursor-pointer' onClick={() => {
                        images.splice(index, 1)
                        setImages([...images])
                      }}/>
                    </div>
                  </div>
                )
              )
            }
          </div>
        )
      }
      <Button
        component="label"
        variant="outlined" sx={{width: 64, height: 64}}
      >
        <FontAwesomeIcon icon={faPlus}/>
        <VisuallyHiddenInput type="file" onChange={(e) => {
          if (!e.target.files) {
            return
          }
          const image = e.target.files[0]
          const url = URL.createObjectURL(image)
          setImages([...images, url])
        }} />
      </Button>
    </div>
  )
}