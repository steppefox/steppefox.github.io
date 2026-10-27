interface Props {
  notifications: boolean
  onClick: () => void
}

export default function Notifications({ notifications, onClick }: Props) {
  return (
    <div className="notifications">
      {!notifications && (
        <div>
          <span onClick={onClick} className="link">
            Enable notifications
          </span>
          <span className="spacer">|</span>
        </div>
      )}
    </div>
  )
}
