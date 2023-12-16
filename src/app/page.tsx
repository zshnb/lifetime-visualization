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
  differenceInMonths,
  differenceInWeeks,
  differenceInYears, format,
  isBefore, min, toDate
} from "date-fns";
import {
  createTheme,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  ThemeProvider,
  useMediaQuery
} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from '@fortawesome/free-brands-svg-icons'
import {faClose, faTag, faLocationDot, faCalendar} from '@fortawesome/free-solid-svg-icons'
import {useDebouncedCallback} from "use-debounce";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator
} from "@mui/lab";
import CustomMilestoneDialog, {CustomMilestoneDialogRef, Milestone} from "@/components/CustomMilestoneDialog";
import useMilestones from "@/hooks/useMilestones";
import {twColorToHex} from "@/utils/colorUtil";
import useStorage from "@/hooks/useStorage";
import FullScreenImageViewMemo, {FullScreenImageViewRef} from "@/components/FullScreenImageView";
import Script from "next/script";

type TimelineItemType = Pick<Milestone, 'label' | 'color' | 'startDate' | 'site'>
export default function Home() {
  const [maxYear, setMaxYear] = useState(80)
  const [birthday, setBirthday] = useState<Date | undefined>(undefined)
  const [unit, setUnit] = useState(12)
  const [validDate, setValidDate] = useState(false)

  const {save, load} = useStorage()

  const array = useMemo(() => {
    return Array.from({length: unit * maxYear}, (v, k) => k)
  }, [unit, maxYear])

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const {milestones, addMilestone, updateMilestone, removeMilestone, confirmMilestoneDate, getCoveredMilestone} = useMilestones()

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  const handleChangeBirthday = useDebouncedCallback((value: Date | null) => {
    if (value) {
      setBirthday(value)
      try {
        format(value, 'yyyy-MM-dd')
        setValidDate(true)
        confirmMilestoneDate(value)
        save({
          user: {
            birthday: value.getTime()
          }
        })
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

  const getBackgroundColors = useCallback((day: number) => {
    // 今天
    if (day === liveDays) {
      return twColorToHex('bg-sky-600')
    }
    // 未来
    if (day > liveDays) {
      return twColorToHex('bg-slate-200')
    }

    if (birthday) {
      let date = new Date()
      switch (unit) {
        case 365: {
          date = addDays(birthday, day)
          break
        }
        case 52: {
          date = addWeeks(birthday, day)
          break
        }
        case 12: {
          date = addMonths(birthday, day)
          break
        }
        case 1: {
          date = addYears(birthday, day)
          break
        }
      }
      const colors = getCoveredMilestone(date, unit)
        .map(it => twColorToHex(it.color))
      if (colors.length) {
        return colors
      }
    }

    return twColorToHex('bg-green-200')
  }, [liveDays, birthday, unit, getCoveredMilestone])


  const rectangles = useMemo(() => {
    return array.map((it) => {
      let date: Date = new Date()
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
      const backgroundColor = getBackgroundColors(it)

      const validMilestones = getCoveredMilestone(date, unit)
      return <Rectangle
        key={it}
        date={validDate ? date : undefined}
        unit={unit}
        onClick={() => {
          customMilestoneRef.current?.open({
            startDate: date,
            endDate: date
          })
        }}
        backgroundColor={backgroundColor}
        milestones={validMilestones}
      />
    })
  }, [getBackgroundColors, array, unit, validDate, birthday, getCoveredMilestone])

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

  const timelineItems: TimelineItemType[] = useMemo(() => {
    if (validDate) {
      return milestones.filter(it => it.startDate !== undefined && isBefore(it.startDate, new Date()))
        .map(it => {
          return {
            startDate: it.startDate,
            label: it.label,
            color: it.color,
            site: it.site
          }
        })
    } else {
      return []
    }
  }, [validDate, milestones])

  useEffect(() => {
    const data = load()
    if (data?.user) {
      if (data.user.birthday) {
        setBirthday(toDate(data.user.birthday))
        setValidDate(true)
      }
      data.user.maxYear && setMaxYear(data.user.maxYear)
      data.user.unit && setUnit(data.user.unit)
    }
  }, [])

  const customMilestoneRef = useRef<CustomMilestoneDialogRef>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const fullScreenImageViewRef = useRef<FullScreenImageViewRef>(null)
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
                const maxYear = Math.min(parseInt(e.target.value), 120)
                setMaxYear(maxYear)
                save({
                  user: {
                    maxYear
                  }
                })
              }}/>
            <FormControl>
              <FormLabel>显示粒度</FormLabel>
              <RadioGroup row value={unit} onChange={(e) => {
                setUnit(parseInt(e.target.value))
                save({
                  user: {
                    unit: parseInt(e.target.value)
                  }
                })
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
              milestones.map((it, index) => {
                return (
                  <div
                    className='flex gap-1 items-center'
                    key={it.label}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Rectangle className='cursor-pointer' backgroundColor={it.color} key={it.label} onClick={() => {
                      if (it.startDate) {
                        customMilestoneRef.current?.open(it)
                      }
                    }}/>
                    <p>{it.label}</p>
                    {
                      it.startDate && (
                        <FontAwesomeIcon className={`${hoveredIndex === index ? 'inline' : 'hidden'}`} icon={faClose}
                                         onClick={() => removeMilestone(index)}/>
                      )
                    }
                  </div>
                )
              })
            }
          </div>
          {
            validDate && birthday && (
              <div className='flex gap-x-2'>
                <p>你的生日：{format(birthday, 'yyyy-MM-dd')}</p>
                <p>预计寿命：{maxYear}岁</p>
                <p>{aliveDisplay}</p>
                <p>{remainDisplay}</p>
                <p className='font-bold'>祝你长命百岁</p>
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
                          {it.startDate && format(it.startDate, 'yyyy-MM-dd')}
                          <FontAwesomeIcon icon={faCalendar} style={{marginLeft: '0.5rem'}}/>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot
                            sx={{color: twColorToHex(it.color), backgroundColor: twColorToHex(it.color)}}/>
                          <TimelineConnector/>
                        </TimelineSeparator>
                        <TimelineContent>
                          <div className='flex gap-2 items-center'>
                            <FontAwesomeIcon icon={faTag} style={{color: '#666666'}}/>
                            <p>{it.label}</p>
                          </div>
                          {
                            it.site && (
                              <div className='flex gap-2 items-center'>
                                <FontAwesomeIcon icon={faLocationDot} style={{color: '#666666'}}/>
                                <p>{it.site}</p>
                              </div>
                            )
                          }
                        </TimelineContent>
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
      <CustomMilestoneDialog
        ref={customMilestoneRef}
        fullScreenImageViewRef={fullScreenImageViewRef.current}
        onAddMilestone={(milestone: Milestone) => addMilestone(milestone)}
        onUpdateMilestone={(oldLabel: string, milestone: Milestone) => updateMilestone(oldLabel, milestone)}
      />
      <FullScreenImageViewMemo ref={fullScreenImageViewRef}/>
    </ThemeProvider>
  )
}
