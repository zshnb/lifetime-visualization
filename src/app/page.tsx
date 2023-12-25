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
  createTheme, Divider,
  Stack,
  TextField,
  ThemeProvider,
  useMediaQuery
} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from '@fortawesome/free-brands-svg-icons'
import {faClose, faTag, faLocationDot, faCalendar, faPlus} from '@fortawesome/free-solid-svg-icons'
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
import {Tabs} from "@mui/base";
import TabsList from "@/components/tabs/TabsList";
import Tab from "@/components/tabs/Tab";

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
        components: {
          MuiTextField: {
            styleOverrides: {
              root: {
                input: {
                  color: 'black'
                }
              }
            }
          }
        }
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
    // 未来
    if (day > liveDays) {
      return twColorToHex('bg-white')
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
    // 今天
    if (day === liveDays) {
      return ['#FFF', '#FF4A4A']
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
  const hoveredIndexRef = useRef<number | null>(null)

  const fullScreenImageViewRef = useRef<FullScreenImageViewRef>(null)
  return (
    <ThemeProvider theme={theme}>
      <header className='pt-20 flex flex-col justify-center items-center'>
        <p className='text-2xl text-center text-[#CAC6B4]'>rén shēng shí guāng zhóu</p>
        <div className='flex ml-4'>
          <p className='text-[50px] text-center font-extralight'>人生时光轴</p>
          <a className='no-underline self-end mb-4 ml-2' href='https://github.com/zshnb/lifetime-visualization' target='_blank'>
            <FontAwesomeIcon icon={faGithub} fontSize={30}/>
          </a>
        </div>
      </header>
      <main className='py-7 px-20 flex flex-col overflow-x-hidden'>
        <div className='pb-4 flex flex-col gap-2'>
          <div className='flex flex-col md:flex-row justify-center gap-4 w-full'>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                sx={{
                  "& fieldset": { border: 'none' },
                }}
                format='yyyy-MM-dd'
                className='basis-1/5 grow-0 bg-white rounded-[20px]'
                label='生日'
                value={birthday}
                onChange={handleChangeBirthday}/>
            </LocalizationProvider>
            <TextField
              label="期望寿命"
              variant="outlined"
              className='basis-1/7 grow-0 bg-white rounded-[20px]'
              sx={{
                "& fieldset": { border: 'none' },
              }}
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
          </div>
          <div className='flex items-center gap-8 flex-nowrap overflow-x-auto mx-[-3rem] p-1 relative'>
            {
              milestones.map((it, index) => {
                return (
                  <div
                    className='shrink-0 min-w-[116px] bg-white border border-solid border-[#D7D3C8] rounded-[14px] px-6 py-[10px] shadow-[0_2px_0_0_#D7D3C8] z-10 relative'
                    key={it.label}
                    onMouseEnter={() => hoveredIndexRef.current = index}
                    onMouseLeave={() => hoveredIndexRef.current = null}
                  >
                    <div className='cursor-pointer flex gap-2 justify-center items-center' onClick={() => {
                      customMilestoneRef.current?.open(it)
                    }}>
                      <Rectangle className='cursor-pointer' backgroundColor={it.color} key={it.label}/>
                      <p>{it.label}</p>
                    </div>
                    {
                      it.startDate && (
                        <FontAwesomeIcon className={`${hoveredIndexRef.current === index ? 'inline' : 'hidden'} absolute top-[14px] right-2 cursor-pointer`} icon={faClose}
                                         onClick={() => removeMilestone(index)}/>
                      )
                    }
                  </div>
                )
              })
            }
            <div
              className='flex shrink-0 gap-2 justify-center items-center min-w-[116px] bg-[#E8E3D3] rounded-[14px] px-6 py-[10px] shadow-[0_2px_0_0_#D7D3C8] text-[#726647] cursor-pointer z-10'
              onClick={() => {
                customMilestoneRef.current?.open({})
              }}
            >
              <FontAwesomeIcon icon={faPlus}/>
              <p>添加人生节点</p>
            </div>
            <Divider className='absolute top-7 left-0 w-full bg-[#726647]'/>
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
        <div className='flex justify-between items-center mb-[30px]'>
          <Tabs value={unit} defaultValue={unit} onChange={(event, value) => {
            setUnit(value as number)
            save({
              user: {
                unit: value as number
              }
            })
          }}>
            <TabsList>
              <Tab value={1}>年</Tab>
              <Tab value={12}>月</Tab>
              <Tab value={52}>周</Tab>
              <Tab value={365}>日</Tab>
            </TabsList>
          </Tabs>
          <div className='flex gap-x-2 items-center'>
            <Rectangle backgroundColor={['#FFF', '#FF4A4A']}/>
            <p className='text-sm text-[#333]'>今天</p>
          </div>
        </div>
        <div className='flex flex-wrap gap-1 basis-40 grow content-start'>
          {rectangles}
        </div>
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
