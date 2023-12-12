'use client'
import Rectangle from "@/components/Rectangle";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInDays,
  differenceInMonths, differenceInWeeks,
  differenceInYears,
  format, min
} from "date-fns";
import {
  createTheme,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select, Stack,
  TextField, ThemeProvider, useMediaQuery
} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from '@fortawesome/free-brands-svg-icons'
import {useDebouncedCallback} from "use-debounce";
import {
  Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem,
  TimelineOppositeContent, TimelineSeparator
} from "@mui/lab";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {
  primarySchoolYear,
  juniorSchoolYear,
  highSchoolYear,
  bachelorSchoolYear,
  masterSchoolYear,
  doctorSchoolYear,
  technicalCollegeYear,
  kindergartenYear
} from "@/app/constant";
import CustomMilestoneDialog, {CustomMilestoneDialogRef, Milestone} from "@/components/CustomMilestoneDialog";
import useMilestones from "@/hooks/useMilestones";
import {twColorToHex} from "@/utils/colorUtil";

export default function Home() {
  const [maxYear, setMaxYear] = useState(80)
  const [birthday, setBirthday] = useState<Date | undefined>(new Date(1996, 4, 24))
  const [degree, setDegree] = useState<number | undefined>()
  const [unit, setUnit] = useState(12)
  const [validDate, setValidDate] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  const handleChangeBirthday = useDebouncedCallback((value) => {
    if (value) {
      setBirthday(value)
      try {
        format(value, 'yyyy-MM-dd')
        setValidDate(true)
      } catch (e) {
        setValidDate(false)
      }
    }
  }, 500)

  const liveDays = useMemo(() => {
    let days = 0
    if (validDate && birthday) {
      const date = min([new Date(), addYears(birthday, maxYear)])
      switch (unit) {
        case 365: {
          days = differenceInDays(date, birthday)
          break
        }
        case 52: {
          days = differenceInWeeks(date, birthday)
          break
        }
        case 12: {
          days = differenceInMonths(date, birthday)
          break
        }
        case 1: {
          days = differenceInYears(date, birthday)
          break
        }
      }
    }
    return days;
  }, [unit, validDate, birthday, maxYear])

  const technicalCollegeStage = useMemo(() => {
    return {
      start: (primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear) * unit,
      end: (primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear + technicalCollegeYear) * unit - 1,
      backgroundColor: 'bg-purple-400',
      label: '大学专科',
      years: primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear
    }
  }, [unit])

  const bachelorSchoolStage = useMemo(() => {
    return {
      start: (primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear) * unit,
      end: (primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear + bachelorSchoolYear) * unit - 1,
      backgroundColor: 'bg-cyan-400',
      label: '大学本科',
      years: primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear
    }
  }, [unit])

  const masterSchoolStage = useMemo(() => {
    return {
      start: (primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear + bachelorSchoolYear) * unit,
      end: (primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear + bachelorSchoolYear + masterSchoolYear) * unit - 1,
      backgroundColor: 'bg-pink-400',
      label: '硕士',
      years: primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear + bachelorSchoolYear
    }
  }, [unit])

  const doctorSchoolStage = useMemo(() => {
    return {
      start: (primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear + bachelorSchoolYear + masterSchoolYear) * unit,
      end: (primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear + bachelorSchoolYear + masterSchoolYear + doctorSchoolYear) * unit - 1,
      backgroundColor: 'bg-lime-400',
      label: '博士',
      years: primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear + bachelorSchoolYear + masterSchoolYear
    }
  }, [unit])
  const stageWithIndex = useMemo(() => {
    const base = [
      {
        start: 0,
        end: kindergartenYear * unit - 1,
        backgroundColor: 'bg-zinc-400',
        label: '出生',
        years: 0
      },
      {
        start: kindergartenYear * unit,
        end: primarySchoolYear * unit - 1,
        backgroundColor: 'bg-red-600',
        label: '幼儿园',
        years: kindergartenYear
      },
      {
        start: primarySchoolYear * unit,
        end: (primarySchoolYear + primarySchoolYear) * unit - 1,
        backgroundColor: 'bg-orange-400',
        label: '小学',
        years: primarySchoolYear
      },
      {
        start: (primarySchoolYear + primarySchoolYear) * unit,
        end: (primarySchoolYear + primarySchoolYear + juniorSchoolYear) * unit - 1,
        backgroundColor: 'bg-yellow-400',
        label: '初中',
        years: primarySchoolYear + primarySchoolYear
      },
      {
        start: (primarySchoolYear + primarySchoolYear + juniorSchoolYear) * unit,
        end: (primarySchoolYear + primarySchoolYear + juniorSchoolYear + highSchoolYear) * unit - 1,
        backgroundColor: 'bg-rose-400',
        label: '高中',
        years: primarySchoolYear + primarySchoolYear + juniorSchoolYear
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
      end: liveDays - 1,
      backgroundColor: 'bg-green-200',
      label: '平凡的一天',
      years: -1
    })
    base.push({
      start: liveDays,
      end: liveDays,
      backgroundColor: 'bg-sky-600',
      label: '今天',
      years: -1
    })
    return base
  }, [unit, degree, liveDays])

  const getBackgroundColor = useCallback((day: number) => {
    // 今天
    if (day === liveDays) {
      return 'bg-sky-600'
    }
    // 未来
    if (day > liveDays) {
      return 'bg-slate-200'
    }

    for (const obj of stageWithIndex) {
      if (day >= obj.start && day <= obj.end) {
        return obj.backgroundColor
      }
    }

    return 'bg-green-200'
  }, [stageWithIndex, liveDays])

  const {milestones, addMilestone} = useMilestones()

  const array = useMemo(() => {
    return Array.from({length: unit * maxYear}, (v, k) => k)
  }, [unit, maxYear])

  const rectangles = useMemo(() => {
    return array.map((it) => {
      const backgroundColor = getBackgroundColor(it)
      let date
      if (validDate && birthday) {
        switch (unit) {
          case 365: {
            date = addDays(birthday, it)
            break
          }
          case 52: {
            date = addWeeks(birthday, it)
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
        date={validDate ? (date && format(date, 'yyyy-MM-dd')) : undefined}
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
  }, [getBackgroundColor, array, unit, validDate, birthday, stageWithIndex])

  const aliveDisplay = useMemo(() => {
    if (validDate && birthday) {
      const date = min([new Date(), addYears(birthday, maxYear)])
      switch (unit) {
        case 365: {
          const diff = differenceInDays(date, birthday)
          return <p>已存活{diff}天</p>
        }
        case 52: {
          const diff = differenceInWeeks(date, birthday)
          return <p>已存活{diff}周</p>
        }
        case 12: {
          const diff = differenceInMonths(date, birthday)
          return <p>已存活{diff}月</p>
        }
        case 1: {
          const diff = differenceInYears(date, birthday)
          return <p>已存活{diff}年</p>
        }
      }
    }
  }, [unit, validDate, birthday, maxYear])

  const remainDisplay = useMemo(() => {
    if (validDate && birthday) {
      const date = min([new Date(), addYears(birthday, maxYear)])
      switch (unit) {
        case 365: {
          const diff = differenceInDays(date, birthday)
          return <p>剩余{Math.max(maxYear * unit - diff, 0)}天</p>
        }
        case 52: {
          const diff = differenceInWeeks(date, birthday)
          return <p>剩余{Math.max(maxYear * unit - diff, 0)}周</p>
        }
        case 12: {
          const diff = differenceInMonths(date, birthday)
          return <p>剩余{Math.max(maxYear * unit - diff, 0)}月</p>
        }
        case 1: {
          const diff = differenceInYears(date, birthday)
          return <p>剩余{Math.max(maxYear * unit - diff, 0)}年</p>
        }
      }
    }
  }, [unit, validDate, birthday, maxYear])

  const timelineItems = useMemo(() => {
    if (validDate) {
      return stageWithIndex.filter(it => it.years >= 0)
        .map(it => {
          return {
            startDate: format(addDays(birthday!, it.years * 365), 'yyyy-MM-dd'),
            label: it.label,
            backgroundColor: it.backgroundColor
          }
        })
    } else {
      return []
    }
  }, [stageWithIndex, validDate, birthday])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    const maxYear = params.get('maxYear')
    if (maxYear) {
      setMaxYear(parseInt(maxYear))
    }
    const unit = params.get('unit')
    if (unit) {
      setUnit(parseInt(unit))
    }

  }, []);

  const customMilestoneRef = useRef<CustomMilestoneDialogRef>(null)
  return (
    <ThemeProvider theme={theme}>
      <header className='px-20 pt-2 flex justify-between items-center'>
        <p className='text-3xl'>人生进度表</p>
        <a className='no-underline' href='https://github.com/zshnb/lifetime-visualization' target='_blank'>
          <FontAwesomeIcon icon={faGithub} fontSize={30}/>
        </a>
      </header>
      <main className='p-20 flex flex-col overflow-x-hidden'>
        <div className='pb-4 flex flex-col gap-2'>
          <div className='flex flex-col items-start gap-y-2 w-1/4'>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker format='yyyy-MM-dd' className='w-full' label='生日' value={birthday}
                          onChange={handleChangeBirthday}/>
            </LocalizationProvider>
            <TextField
              label="预计寿命"
              variant="outlined"
              className='w-full'
              value={maxYear}
              type='number'
              onChange={(e) => {
                setMaxYear(parseInt(e.target.value))
                router.push(pathname + '?' + createQueryString('maxYear', e.target.value))
              }}/>
            <FormControl fullWidth>
              <InputLabel>最高学历</InputLabel>
              <Select value={degree} onChange={(e) => setDegree(e.target.value as number)} label="最高学历">
                <MenuItem value={1}>专科</MenuItem>
                <MenuItem value={2}>本科</MenuItem>
                <MenuItem value={3}>硕士</MenuItem>
                <MenuItem value={4}>博士</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>显示粒度</FormLabel>
              <RadioGroup row value={unit} onChange={(e) => {
                setUnit(parseInt(e.target.value))
                router.push(pathname + '?' + createQueryString('unit', e.target.value))
              }}>
                <FormControlLabel value={365} control={<Radio/>} label="日"/>
                <FormControlLabel value={52} control={<Radio/>} label="周"/>
                <FormControlLabel value={12} control={<Radio/>} label="月"/>
                <FormControlLabel value={1} control={<Radio/>} label="年"/>
              </RadioGroup>
            </FormControl>
          </div>
          <div className='flex items-center gap-8 flex-wrap'>
            {
              milestones.map(it => (
                <div className='flex gap-1 items-center cursor-pointer' onClick={() => {
                  customMilestoneRef.current?.open({
                    name: it.label,
                    color: it.backgroundColor,
                    unit: it.unit,
                    duration: it.duration,
                    startDate: birthday
                  })
                }} key={it.label}>
                  <Rectangle backgroundColor={it.backgroundColor} key={it.label}/>
                  <p>{it.label}</p>
                </div>
              ))
            }
          </div>
          {
            validDate && birthday && (
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
        <Stack direction='row' gap={2}>
          {
            timelineItems.length > 0 && (
              <div className='basis-80'>
                <Timeline position="right">
                  {
                    timelineItems.map((it) => (
                      <TimelineItem>
                        <TimelineOppositeContent color="text.secondary">
                          {it.startDate}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot
                            sx={{color: twColorToHex(it.backgroundColor), backgroundColor: twColorToHex(it.backgroundColor)}}/>
                          <TimelineConnector/>
                        </TimelineSeparator>
                        <TimelineContent>{it.label}</TimelineContent>
                      </TimelineItem>
                    ))
                  }
                </Timeline>
              </div>
            )
          }
          <div className='flex flex-wrap gap-1 basis-40 grow content-start'>
            {rectangles}
          </div>
        </Stack>
      </main>
      <CustomMilestoneDialog ref={customMilestoneRef} onAddMilestone={(milestone: Milestone) => {
        addMilestone(milestone)
      }}/>
    </ThemeProvider>
  )
}
