import {useState} from "react";
import {Stack} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {isAfter, isBefore, isValid, parse} from "date-fns";

export type DateRangePickerProps = {
  onAccept: (range: Date[]) => void
}
export default function DateRangePicker({onAccept}: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>()
  const [endDate, setEndDate] = useState<Date | null>()

  const [startDateError, setStartDateError] = useState('')
  const [endDateError, setEndDateError] = useState('')
  return (
    <Stack direction='row' gap={2} alignItems='center'>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label='开始时间'
          format='yyyy-MM-dd'
          value={startDate}
          slotProps={{
            textField: {
              helperText: startDateError,
            },
          }}
          onChange={(value) => {
            setStartDate(value)
            if (isValid(value)) {
              if (endDate && isValid(endDate)) {
                if (isBefore(value!, endDate)) {
                  setStartDateError('')
                  onAccept([startDate!, endDate])
                } else {
                  setStartDateError('开始时间不能晚于结束时间')
                }
              }
            } else {
              setStartDateError('请输入合法日期')
            }
          }}
          sx={{flex: 1}}
        />
      </LocalizationProvider>
      <p>-</p>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label='结束时间'
          format='yyyy-MM-dd'
          value={endDate}
          slotProps={{
            textField: {
              helperText: endDateError,
            },
          }}
          onChange={(value) => {
            setEndDate(value)
            if (isValid(value)) {
              if (startDate && isValid(startDate)) {
                if (isAfter(value!, startDate)) {
                  setEndDateError('')
                  onAccept([startDate, endDate!])
                } else {
                  setEndDateError('结束时间不能早于开始时间')
                }
              }
            } else {
              setEndDateError('请输入合法日期')
            }
          }}
          sx={{flex: 1}}
        />
      </LocalizationProvider>
    </Stack>
  )
}