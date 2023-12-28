export function twColorToHex(twColor: string) {
  switch (twColor) {
    case "bg-zinc-400":
      return "#a1a1aa"
    case "bg-rose-400":
      return "#fb7185"
    case "bg-yellow-400":
      return "#facc15"
    case "bg-slate-200":
      return "#e2e8f0"
    case "bg-orange-400":
      return "#fb923c"
    case "bg-green-200":
      return "#bbf7d0"
    case "bg-red-600":
      return "#dc2626"
    case "bg-pink-400":
      return "#f472b6"
    case "bg-cyan-400":
      return "#22d3ee"
    case "bg-lime-400":
      return "#a3e635"
    case "bg-sky-600":
      return "#0284c7"
    case "bg-purple-400":
      return "#c084fc"
    case 'bg-white':
      return '#fff'
    default:
      return twColor
  }
}

export function hexColorToTw(color: string) {
  return `bg-[${color}]`
}

export function buildLinearGradient(color1: string, color2: string) {
  let ratio = 0
  const array: string[] = []
  array.push(color1, color2)
  return array.map(it => {
    const str = `${it} ${ratio}%, ${it} ${ratio + 50}%`
    ratio += 50
    return str
  }).join(',')
}