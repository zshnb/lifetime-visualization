import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";
import {FormEvent, forwardRef, Ref, useImperativeHandle, useState} from "react";
import {Sketch} from "@uiw/react-color";
import DateRangePicker from "@/components/DateRangePicker";
import {twColorToHex} from "@/utils/colorUtil";

export type CustomMilestoneDialogProps = {
  onAddMilestone: (item: Milestone) => void
}
export type Milestone = {
  label: string
  startDate?: Date
  endDate?: Date
  color: string
}
export type CustomMilestoneDialogRef = {
  open: (milestone: Partial<Milestone>) => void
}
function CustomMilestoneDialogComponent(props: CustomMilestoneDialogProps, ref: Ref<CustomMilestoneDialogRef>) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [color, setColor] = useState('#000')
  const [nameError, setNameError] = useState(false)
  const [dateRange, setDateRange] = useState<Date[]>([])

  useImperativeHandle(ref, () => ({
    open: (milestone: Partial<Milestone>) => {
      console.log('milestone', milestone)
      setOpen(true)
      milestone.label && setLabel(milestone.label)
      milestone.color && setColor(twColorToHex(milestone.color))
      setDateRange([milestone.startDate!, milestone.endDate!])
    }
  }), []);

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!label) {
      setNameError(true)
      return
    }
    if (dateRange.length !== 2) {
      return
    }

    props.onAddMilestone({
      label,
      color: color,
      startDate: dateRange[0],
      endDate: dateRange[1]
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>
        人生里程碑
      </DialogTitle>
      <DialogContent>
        <form className='flex flex-col gap-y-4 pt-2'>
          <div>
            <TextField
              label="名称"
              variant="outlined"
              required
              value={label}
              error={nameError}
              className='w-full'
              onChange={(e) => {
                setLabel(e.target.value)
              }}/>
          </div>
          <DateRangePicker dateRange={dateRange} onAccept={(range: Date[]) => setDateRange(range)}/>
          <Sketch color={color} onChange={newShade => setColor(newShade.hex)}/>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleSubmit}>添加</Button>
      </DialogActions>
    </Dialog>
  )
}

const CustomMilestoneDialog = forwardRef(CustomMilestoneDialogComponent)
export default CustomMilestoneDialog
