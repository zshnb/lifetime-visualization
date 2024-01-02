import {ChangeEvent} from "react";

export type TextFieldInputProps = {
  label: string
  value: string | number
  onChange: (e: ChangeEvent<HTMLInputElement>)  => void
}
export default function TextFieldInput({label, value, onChange}: TextFieldInputProps) {
  return (
    <div className="flex items-center bg-white rounded-[20px]">
      <input
        type="text"
        className="grow border-0 px-10 py-4 text-[#333333] text-xl focus:outline-0 w-32 rounded-[20px]"
        value={value}
        onChange={onChange}
      />
      <div className="inline-block w-[2px] h-4 bg-[#D7D3C8]"/>
      <span className="px-10 py-4 text-[#BDBDBD] text-xl">{label}</span>
    </div>
  )
}