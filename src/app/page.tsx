'use client'
import Rectangle from "@/components/Rectangle";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {JSX, useCallback, useEffect, useMemo, useState} from "react";
import {addDays, addMonths, addYears, differenceInDays, differenceInMonths, differenceInYears, format} from "date-fns";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField
} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from '@fortawesome/free-brands-svg-icons'

const kindergartenYear = 3
const primarySchoolYear = 6
const juniorSchoolYear = 3
const highSchoolYear = 3
const technicalCollegeYear = 3
const bachelorSchoolYear = 4
const masterSchoolYear = 3
const doctorSchoolYear = 4
const rectangleTypes = [
  {
    label: '出生',
    backgroundColor: 'bg-zinc-400'
  },
  {
    label: '幼儿园',
    backgroundColor: 'bg-red-600'
  },
  {
    label: '小学',
    backgroundColor: 'bg-orange-400'
  },
  {
    label: '初中',
    backgroundColor: 'bg-yellow-400'
  },
  {
    label: '高中',
    backgroundColor: 'bg-rose-400'
  },
  {
    label: '大学专科',
    backgroundColor: 'bg-purple-400'
  },
  {
    label: '大学本科',
    backgroundColor: 'bg-cyan-400'
  },
  {
    label: '硕士',
    backgroundColor: 'bg-pink-400'
  },
  {
    label: '博士',
    backgroundColor: 'bg-lime-400'
  },
  {
    label: '平凡的一天',
    backgroundColor: 'bg-green-200'
  },
  {
    label: '今天',
    backgroundColor: 'bg-sky-600'
  },
]

export default function Home() {
  const [maxYear, setMaxYear] = useState(10)
  const [birthday, setBirthday] = useState<Date | null>(null)
  const [degree, setDegree] = useState(0)
  const [personDays, setPersonDays] = useState(0)
  const [array, setArray] = useState(Array.from({ length: 365 * maxYear }, (v, k) => k))
  const [unit, setUnit] = useState(365)

  const technicalCollegeStage = useMemo(() => {
    return {
      start: (primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear) * unit,
      end: (primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear + technicalCollegeYear) * unit - 1,
      backgroundColor: 'bg-purple-400',
      label: '大学专科'
    }
  }, [unit])

  const bachelorSchoolStage = useMemo(() => {
    return {
      start: (primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear) * unit,
      end: (primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear + bachelorSchoolYear) * unit - 1,
      backgroundColor: 'bg-cyan-400',
      label: '大学本科'
    }
  }, [unit])

  const masterSchoolStage = useMemo(() => {
    return {
      start: (primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear + bachelorSchoolYear) * unit,
      end: (primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear + bachelorSchoolYear + masterSchoolYear) * unit - 1,
      backgroundColor: 'bg-pink-400',
      label: '硕士'
    }
  }, [unit])

  const doctorSchoolStage = useMemo(() => {
    return {
      start: (primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear + bachelorSchoolYear + masterSchoolYear) * unit,
      end: (primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear + bachelorSchoolYear + masterSchoolYear + doctorSchoolYear) * unit - 1,
      backgroundColor: 'bg-lime-400',
      label: '博士'
    }
  }, [unit])
  const stageWithIndex = useMemo(() => {
    const base = [
      {
        start: 0,
        end: kindergartenYear * unit - 1,
        backgroundColor: 'bg-zinc-400',
        label: '出生'
      },
      {
        start: kindergartenYear * unit,
        end: primarySchoolYear * unit - 1,
        backgroundColor: 'bg-red-600',
        label: '幼儿园'
      },
      {
        start: primarySchoolYear * unit,
        end: (primarySchoolYear + primarySchoolYear) * unit - 1,
        backgroundColor: 'bg-orange-400',
        label: '小学'
      },
      {
        start: (primarySchoolYear + primarySchoolYear) * unit,
        end: (primarySchoolYear + primarySchoolYear + juniorSchoolYear) * unit - 1,
        backgroundColor: 'bg-yellow-400',
        label: '初中'
      },
      {
        start: (primarySchoolYear + primarySchoolYear + juniorSchoolYear) * unit,
        end:  (primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear) * unit - 1,
        backgroundColor: 'bg-rose-400',
        label: '高中'
      },
    ]
    switch (degree) {
      case 1: {
        base.push(technicalCollegeStage)
        break
      }
      case 2: {
        base.push(bachelorSchoolStage)
        break
      }
      case 3: {
        base.push(bachelorSchoolStage, masterSchoolStage)
        break
      }
      case 4: {
        base.push(bachelorSchoolStage, masterSchoolStage, doctorSchoolStage)
        break
      }
    }
    const lastItem = base[base.length - 1]
    base.push({
      start: lastItem.end,
      end: personDays - 1,
      backgroundColor: 'bg-green-200',
      label: '平凡的一天'
    })
    base.push({
      start: personDays,
      end: personDays,
      backgroundColor: 'bg-sky-600',
      label: '今天'
    })
    return base
  }, [unit, degree, personDays])


  const getBackgroundColor = useCallback((day: number) => {
    // 今天
    if (day === personDays) {
      return 'bg-sky-600'
    }
    // 未来
    if (day > personDays) {
      return 'bg-slate-200'
    }

    for (const obj of stageWithIndex) {
      if (day >= obj.start && day <= obj.end) {
        return obj.backgroundColor
      }
    }

    return 'bg-green-200'
  }, [personDays, stageWithIndex])

  const rectangles = useMemo(() => {
    return array.map((it) => {
      const backgroundColor = getBackgroundColor(it)
      let date
      if (birthday) {
        switch (unit) {
          case 365: {
            date = addDays(birthday, it)
            break
          }
          case 12: {
            date = addMonths(birthday, it)
            break
          }
          case 1: {
            date = addYears(birthday, it)
            break
          }
        }
      }

      const stage = stageWithIndex.find(item => it >= item.start && it <= item.end)
      return <Rectangle
        key={it}
        date={date && format(date, 'yyyy-MM-dd')}
        backgroundColor={backgroundColor}
        stage={
          stage && (
            <div className='flex gap-1 items-center'>
              <Rectangle backgroundColor={stage.backgroundColor}/>
              <p>{stage.label}</p>
            </div>
          )
        }
      />
    })
  }, [getBackgroundColor, array, unit])

  useEffect(() => {
    if (birthday) {
      let days = 0
      let unitDisplay
      switch (unit) {
        case 365: {
          days = differenceInDays(new Date(), birthday)
          unitDisplay = '天'
          break
        }
        case 12: {
          days = differenceInMonths(new Date(), birthday)
          unitDisplay = '月'
          break
        }
        case 1: {
          days = differenceInYears(new Date(), birthday)
          unitDisplay = '年'
          break
        }
      }
      setAliveDisplay(<p>已存活{days}{unitDisplay}</p>)
      setRemainDisplay(<p>剩余{maxYear * unit - days}{unitDisplay}</p>)
      setPersonDays(days)
    }
  }, [birthday, unit, maxYear])

  const [aliveDisplay, setAliveDisplay] = useState<JSX.Element>()
  const [remainDisplay, setRemainDisplay] = useState<JSX.Element>()

  useEffect(() => {
    setArray(Array.from({ length: unit * maxYear }, (v, k) => k))
    if (birthday) {
      switch (unit) {
        case 365: {
          const diff = differenceInDays(new Date(), birthday)
          setPersonDays(diff)
          setAliveDisplay(<p>已存活{diff}天</p>)
          setRemainDisplay(<p>剩余{maxYear * unit - diff}天</p>)
          break
        }
        case 12: {
          const diff = differenceInMonths(new Date(), birthday)
          setPersonDays(diff)
          setAliveDisplay(<p>已存活{diff}月</p>)
          setRemainDisplay(<p>剩余{maxYear * unit - diff}月</p>)
          break
        }
        case 1: {
          const diff = differenceInYears(new Date(), birthday)
          setPersonDays(diff)
          setAliveDisplay(<p>已存活{diff}年</p>)
          setRemainDisplay(<p>剩余{maxYear * unit - diff}年</p>)
          break
        }
      }
    }
  }, [unit, maxYear]);

  return (
    <>
      <header className='px-20 pt-2 flex justify-between items-center'>
        <p className='text-3xl'>人生进度表</p>
        <a className='no-underline' href='https://github.com/zshnb/lifetime-visualization' target='_blank'>
          <FontAwesomeIcon icon={faGithub} fontSize={30}/>
        </a>
      </header>
      <main className='p-20 flex flex-col'>
        <div className='pb-4 flex flex-col gap-2'>
          <div className='flex flex-col items-start gap-y-2 w-1/4'>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker className='w-full' label='生日' value={birthday} onChange={(value) => {
                setBirthday(value)
              }}/>
            </LocalizationProvider>
            <TextField
              label="预计寿命"
              variant="outlined"
              className='w-full'
              value={maxYear}
              type='number'
              onChange={(e) => setMaxYear(parseInt(e.target.value))} />
            <FormControl fullWidth>
              <InputLabel>最高学历</InputLabel>
              <Select value={degree} onChange={(e) => setDegree(e.target.value as number)}>
                <MenuItem value={1}>专科</MenuItem>
                <MenuItem value={2}>本科</MenuItem>
                <MenuItem value={3}>硕士</MenuItem>
                <MenuItem value={4}>博士</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>显示粒度</FormLabel>
              <RadioGroup row value={unit} onChange={(e) => setUnit(parseInt(e.target.value))}>
                <FormControlLabel value={365} control={<Radio/>} label="日"/>
                <FormControlLabel value={12} control={<Radio/>} label="月"/>
                <FormControlLabel value={1} control={<Radio/>} label="年"/>
              </RadioGroup>
            </FormControl>
          </div>
          <div className='flex items-center gap-2'>
            {
              rectangleTypes.map(it => (
                <div className='flex gap-1 items-center'>
                  <Rectangle backgroundColor={it.backgroundColor} key={it.label}/>
                  <p>{it.label}</p>
                </div>
              ))
            }
          </div>
          {
            birthday && (
              <div className='flex gap-x-2'>
                <p>你的生日：{format(birthday, 'yyyy-MM-dd')}</p>
                <p>预计寿命：{maxYear}岁</p>
                <p>{aliveDisplay}</p>
                <p>{remainDisplay}</p>
                <p className='font-bold'>祝大家长命百岁</p>
              </div>
            )
          }
        </div>
        <div className='flex flex-wrap gap-1'>
          {rectangles}
        </div>
      </main>
    </>
  )
}
