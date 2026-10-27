interface Props {
  title: string
  disabled?: boolean
  onClick: () => void
}

export default function Cta({ title, disabled, onClick }: Props) {
  return (
    <button disabled={disabled} className="button" onClick={onClick}>
      {title}
    </button>
  )
}
