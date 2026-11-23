import { useId } from 'react'
import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'

export type DropdownOption<T extends string = string> = readonly [value: T, label: string]

type Props<T extends string> = {
  label: string
  options: readonly DropdownOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
  showLabel?: boolean
}

export function Dropdown<T extends string>({ label, options, value, onChange, className, showLabel = true }: Props<T>) {
  const id = useId()

  return <div className={className ? `dropdown ${className}` : 'dropdown'}>
    <span id={id} className={showLabel ? 'dropdown-label' : 'sr-only'}>{label}</span>
    <Select.Root value={'option:' + value} onValueChange={next => {
      const selected = options.find(([key]) => 'option:' + key === next)
      if (selected) onChange(selected[0])
    }}>
      <Select.Trigger className="dropdown-trigger" aria-labelledby={id}>
        <Select.Value placeholder="Selecciona una opción" />
        <Select.Icon asChild><ChevronDown size={16} aria-hidden="true" /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="dropdown-menu" position="popper" align="start" sideOffset={4} collisionPadding={12}>
          <Select.Viewport className="dropdown-options">
            {options.map(([key, text]) => <Select.Item className="dropdown-option" value={'option:' + key} key={key}>
              <Select.ItemText>{text}</Select.ItemText>
              <Select.ItemIndicator><Check size={15} aria-hidden="true" /></Select.ItemIndicator>
            </Select.Item>)}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </div>
}
