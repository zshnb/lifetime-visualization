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
import useMilestones from "@/hooks/useMilestones";

export type CustomMilestoneDialogProps = {
  onAddMilestone: (item: Milestone) => void
}
export type Milestone = {
  label: string
  startDate?: Date
  endDate?: Date
  color: string
  order?: number
}
export type CustomMilestoneDialogRef = {
  open: (milestone: Partial<Milestone>) => void
}
function CustomMilestoneDialogComponent(props: CustomMilestoneDialogProps, ref: Ref<CustomMilestoneDialogRef>) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [color, setColor] = useState('#000')
  const [labelError, setLabelError] = useState(false)
  const [labelHelperText, setLabelHelperText] = useState('')
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

  const resetForm = () => {
    setLabel('')
    setLabelError(false)
    setLabelHelperText('')
  }

  const handleClose = () => {
    setOpen(false)
    resetForm()
  }

  const {isMilestoneExist}  = useMilestones()
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!label) {
      setLabelError(true)
      setLabelHelperText('请输入里程碑名称')
      return
    }
    if (dateRange.length !== 2) {
      return
    }
    if (isMilestoneExist(label)) {
      setLabelError(true)
      setLabelHelperText('里程碑已存在')
      return
    }

    props.onAddMilestone({
      label,
      color: color,
      startDate: dateRange[0],
      endDate: dateRange[1]
    })
    setOpen(false)
    resetForm()
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
              error={labelError}
              helperText={labelHelperText}
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
