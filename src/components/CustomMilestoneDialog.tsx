import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, FormControl, FormControlLabel,
  FormLabel, Radio, RadioGroup,
  TextField
} from "@mui/material";
import {FormEvent, useState} from "react";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {Sketch} from "@uiw/react-color";

export type CustomMilestoneDialogProps = {
  onAddMilestone: (item: Milestone) => void
}
export type Milestone = {
  name: string
  unit: number
  duration: number
  startDate: Date
  color: string
}
export default function CustomMilestoneDialog(props: CustomMilestoneDialogProps) {
  const [open, setOpen] = useState(true)
  const [name, setName] = useState('')
  const [unit, setUnit] = useState(1)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [duration, setDuration] = useState(1)
  const [color, setColor] = useState('#000')
  const [nameError, setNameError] = useState(false)
  const [dateError, setDateError] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name) {
      setNameError(true)
      return
    }
    if (!date) {
      setDateError(true)
      return
    }

    props.onAddMilestone({
      name,
      unit,
      duration,
      startDate: date,
      color
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>
        人生里程碑
      </DialogTitle>
      <DialogContent>
        <form className='flex flex-col gap-y-2 pt-2 w-1/2'>
          <div>
            <TextField
              label="名称"
              variant="outlined"
              required
              value={name}
              error={nameError}
              className='w-full'
              onChange={(e) => {
                setName(e.target.value)
              }}/>
          </div>
          <FormControl>
            <FormLabel>显示粒度</FormLabel>
            <RadioGroup row value={unit} onChange={(e) => {
              setUnit(parseInt(e.target.value))
            }}>
              <FormControlLabel value={365} control={<Radio/>} label="日"/>
              <FormControlLabel value={52} control={<Radio/>} label="周"/>
              <FormControlLabel value={12} control={<Radio/>} label="月"/>
              <FormControlLabel value={1} control={<Radio/>} label="年"/>
            </RadioGroup>
          </FormControl>
          <div>
            <TextField
              label="持续时间"
              required
              variant="outlined"
              className='w-full'
              type='number'
              value={duration}
              onChange={(e) => {
                setDuration(Math.max(1, parseInt(e.target.value)))
              }}/>
          </div>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              format='yyyy-MM-dd'
              className='w-full'
              label='日期'
              value={date}
              onChange={value => {
                if (value) {
                  setDate(value)
                }
              }}/>
          </LocalizationProvider>
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