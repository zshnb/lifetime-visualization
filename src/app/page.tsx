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
  startOfWeek, toDate
} from "date-fns";
import {
  createTheme, Divider,
  ThemeProvider,
  useMediaQuery
} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from '@fortawesome/free-brands-svg-icons'
import {useDebouncedCallback} from "use-debounce";
import CustomMilestoneDialog, {CustomMilestoneDialogRef, Milestone} from "@/components/CustomMilestoneDialog";
import useMilestones from "@/hooks/useMilestones";
import {twColorToHex} from "@/utils/colorUtil";
import useStorage from "@/hooks/useStorage";
import FullScreenImageViewMemo, {FullScreenImageViewRef} from "@/components/FullScreenImageView";
import {Tabs} from "@mui/base";
import TabsList from "@/components/tabs/TabsList";
import Tab from "@/components/tabs/Tab";
import MilestoneRectangle from "@/components/Milestone";
import Image from "next/image";
import TextFieldInput from "@/components/TextFieldInput";

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
  const {milestones, addMilestone, updateMilestone, confirmMilestoneDate, getCoveredMilestone, removeMilestone} = useMilestones()

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

  const todayIndex = useMemo(() => {
    if (birthday) {
      const date = new Date()
      switch (unit) {
        case 365: {
          return differenceInDays(date, birthday)
        }
        case 52: {
          const rightDate = new Date(birthday.getFullYear(), birthday.getMonth(), startOfWeek(birthday).getDay())
          return differenceInWeeks(date, rightDate)
        }
        case 12: {
          const rightDate = new Date(birthday.getFullYear(), birthday.getMonth(), 1)
          return differenceInMonths(date, rightDate)
        }
        case 1: {
          const rightDate = new Date(birthday.getFullYear(), 0, 1)
          return differenceInYears(date, rightDate)
        }
        default: {
          return 0
        }
      }
    } else {
      return 0
    }
  }, [unit, birthday])

  const getBackgroundColors = useCallback((day: number) => {
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
    if (day === todayIndex) {
      return ['#FFF', '#FF4A4A']
    }

    // 未来
    if (day > todayIndex) {
      return twColorToHex('bg-white')
    }

    return 'rgba(255,56,205,0.3)'
  }, [birthday, unit, getCoveredMilestone, todayIndex])


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

  const fullScreenImageViewRef = useRef<FullScreenImageViewRef>(null)
  return (
    <ThemeProvider theme={theme}>
      <header className='pt-20 flex flex-col justify-center items-center mb-12 gap-y-[20px]'>
        <p className='text-2xl text-center text-[#CAC6B4]'>rén shēng shí guāng zhóu</p>
        <div className='relative'>
          <Image src='/title.svg' alt='title' width={400} height={75}/>
          <a className='no-underline absolute top-11 right-[-2.5rem]' href='https://github.com/zshnb/lifetime-visualization'
             target='_blank'>
            <FontAwesomeIcon icon={faGithub} fontSize={26} color={'#CAC6B4'}/>
          </a>
        </div>
      </header>
      <main className='py-7 flex flex-col overflow-x-hidden'>
        <div className='pb-4 flex flex-col gap-y-[48px]'>
          <div className='flex flex-col md:flex-row justify-center gap-[40px] w-[90%] md:w-full m-4 md:m-0'>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                sx={{
                  "& fieldset": {border: 'none'},
                  '& input': {fontSize: '20px', padding: '16.5px 40px'}
                }}
                format='yyyy-MM-dd'
                className='basis-1/6 grow-0 bg-white rounded-[20px] text-[#333333]'
                value={birthday}
                onChange={handleChangeBirthday}/>
            </LocalizationProvider>
            <TextFieldInput label='人生长度' value={maxYear} onChange={(e) => {
              const maxYear = Math.min(parseInt(e.target.value === '' ? '80' : e.target.value), 120)
              setMaxYear(maxYear)
              save({
                user: {
                  maxYear
                }
              })
            }}/>
          </div>
          <div className='flex items-start gap-8 flex-nowrap overflow-x-auto px-20 py-4 relative'>
            <div className='self-start min-w-[50px] mt-[-8px]'>
              <Image src='/cake.svg' alt='cake' width={50} height={50}/>
            </div>
            {
              milestones.map((it, index) => {
                return <MilestoneRectangle
                  key={it.label}
                  customMilestoneRef={customMilestoneRef}
                  milestone={it}
                  index={index}
                  removeMilestone={removeMilestone}
                />
              })
            }
            <div
              className='flex shrink-0 gap-2 justify-center items-center self-start min-w-[116px] bg-[#E8E3D3] rounded-[14px] px-6 py-[10px] shadow-[0_2px_0_0_#D7D3C8] text-[#726647] cursor-pointer z-10'
              onClick={() => {
                customMilestoneRef.current?.open({})
              }}
            >
              <Image src='/plus.svg' alt='cake' width={21} height={22}/>
              <p>添加人生节点</p>
            </div>
            <Divider className={`absolute top-10 left-0 w-full bg-[#D7D3C8] h-[2px]`} style={{width: `${100 + milestones.length * 3}%`}}/>
          </div>
        </div>
        <div className='px-[204px] flex justify-between items-center mb-[30px]'>
          <Tabs className='w-[270px]' value={unit} defaultValue={unit} onChange={(event, value) => {
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
          <div className='flex gap-x-2 items-center pr-8'>
            <Rectangle backgroundColor={['#FFF', '#FF4A4A']}/>
            <p className='text-sm text-[#333]'>今天</p>
          </div>
        </div>
        <div className='px-[205px] flex flex-wrap gap-[10px] basis-40 grow content-start'>
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
