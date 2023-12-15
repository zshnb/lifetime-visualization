import {useEffect, useState} from "react";
import {Stack} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {isAfter, isBefore, isValid} from "date-fns";
import {flushSync} from "react-dom";

export type DateRangePickerProps = {
  onAccept: (range: Date[]) => void
  dateRange: Date[]
}
export default function DateRangePicker({onAccept, dateRange}: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>(dateRange[0])
  const [endDate, setEndDate] = useState<Date | null>(dateRange[1])

  const [startDateError, setStartDateError] = useState('')
  const [endDateError, setEndDateError] = useState('')

  useEffect(() => {
    if (isValid(startDate) && isValid(endDate)) {
      if (startDate && endDate && startDate.getTime() <= endDate.getTime()) {
        setStartDateError('')
        setEndDateError('')
        onAccept([startDate, endDate])
      } else {
        setStartDateError('开始时间不能晚于结束时间')
        setEndDateError('结束时间不能早于开始时间')
      }
    }
  }, [startDate, endDate])
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
            if (!isValid(value)) {
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
            if (!isValid(value)) {
              setEndDateError('请输入合法日期')
            }
          }}
          sx={{flex: 1}}
        />
      </LocalizationProvider>
    </Stack>
  )
}