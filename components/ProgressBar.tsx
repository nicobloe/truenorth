interface ProgressBarProps {
  percentage: number
  color?: string
}

export function ProgressBar({ percentage, color = "bg-stone-500" }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <div className={`${color} h-2.5 transition-all duration-300`} style={{ width: `${percentage}%` }}></div>
    </div>
  )
}
