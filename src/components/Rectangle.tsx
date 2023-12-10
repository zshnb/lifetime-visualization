export type RectangleProps = {
  backgroundColor?: string
}
export default function Rectangle(props: RectangleProps) {
  return (
    <div className={`w-4 h-4 border-0 rounded ${props.backgroundColor}`}></div>
  )
}