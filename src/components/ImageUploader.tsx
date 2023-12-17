import {Button, styled} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExpand, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import FullScreenImageViewMemo, {FullScreenImageViewRef} from "@/components/FullScreenImageView";
import {getBase64} from "@/utils/imageUtil";

export type ImageUploaderProps = {
  existImages: string[]
  onUploadImage: (image: string) => void
  fullScreenImageViewRef: FullScreenImageViewRef | null
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
export default function ImageUploader({existImages, onUploadImage, fullScreenImageViewRef}: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(existImages)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  return (
    <div className='flex gap-x-2'>
      {
        images.length > 0 && (
          <div className='flex gap-x-2 flex-wrap'>
            {
              images.map((it, index) => (
                  <div
                    className='relative w-[64px] h-[64px]'
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <img src={it} className='w-full h-full'/>
                    <div className={`w-[64px] h-[64px] bg-gray-200 opacity-60 ${index === hoveredIndex ? 'flex' : 'hidden'} absolute top-0 left-0 content-center items-center`}>
                      <FontAwesomeIcon icon={faExpand} className='flex-1 cursor-pointer' onClick={() => {
                        fullScreenImageViewRef?.open(it)
                      }}/>
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
        <VisuallyHiddenInput type="file" onChange={async (e) => {
          if (!e.target.files) {
            return
          }
          const file = e.target.files[0]
          const base64 = await getBase64(file)
          setImages([...images, base64])
          onUploadImage(base64)
        }} />
      </Button>
      <FullScreenImageViewMemo/>
    </div>
  )
}