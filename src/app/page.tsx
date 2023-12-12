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
import CustomMilestoneDialog, {CustomMilestoneDialogRef, Milestone} from "@/components/CustomMilestoneDialog";
import useMilestones from "@/hooks/useMilestones";
import {twColorToHex} from "@/utils/colorUtil";

export default function Home() {
  const [maxYear, setMaxYear] = useState(80)
  const [birthday, setBirthday] = useState<Date | undefined>(undefined)
  const [unit, setUnit] = useState(12)
  const [validDate, setValidDate] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const array = useMemo(() => {
    return Array.from({length: unit * maxYear}, (v, k) => k)
  }, [unit, maxYear])

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
  const {milestones, addMilestone} = useMilestones()

  const stages = useMemo(() => {
    let start = 0
    const base = milestones
      .filter(it => it.duration > 0)
      .map((milestone: Milestone) => {
        const object = {
          start,
          end: start + milestone.duration * unit - 1,
          label: milestone.label,
          years: milestone.duration,
          color: milestone.color
        }
        start += milestone.duration * unit
        return object
      })
    const lastItem = base[base.length - 1]
    base.push({
      start: lastItem.end,
      end: liveDays - 1,
      color: 'bg-green-200',
      label: '平凡的一天',
      years: -1
    })
    base.push({
      start: liveDays,
      end: liveDays,
      color: 'bg-sky-600',
      label: '今天',
      years: -1
    })
    return base
  }, [unit, liveDays, milestones])

  const getBackgroundColor = useCallback((day: number) => {
    // 今天
    if (day === liveDays) {
      return 'bg-sky-600'
    }
    // 未来
    if (day > liveDays) {
      return 'bg-slate-200'
    }

    for (const obj of stages) {
      if (day >= obj.start && day <= obj.end) {
        return obj.color
      }
    }

    return 'bg-green-200'
  }, [stages, liveDays])


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

      const stage = stages.find(item => item.color === backgroundColor)
      return <Rectangle
        key={it}
        date={validDate ? (date && format(date, 'yyyy-MM-dd')) : undefined}
        backgroundColor={backgroundColor}
        stage={
          stage && (
            <div className='flex gap-1 items-center'>
              <Rectangle backgroundColor={stage.color}/>
              <p>{stage.label}</p>
            </div>
          )
        }
      />
    })
  }, [getBackgroundColor, array, unit, validDate, birthday, stages])

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
      let accumulate = 0
      return stages.filter(it => it.years >= 0)
        .map(it => {
          const object = {
            startDate: format(addYears(birthday!, accumulate), 'yyyy-MM-dd'),
            label: it.label,
            color: it.color
          }
          accumulate += it.years
          return object
        })
    } else {
      return []
    }
  }, [stages, validDate, birthday])

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
                    label: it.label,
                    color: it.color,
                    unit: it.unit,
                    duration: it.duration,
                    startDate: birthday
                  })
                }} key={it.label}>
                  <Rectangle backgroundColor={it.color} key={it.label}/>
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
                            sx={{color: twColorToHex(it.color), backgroundColor: twColorToHex(it.color)}}/>
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
