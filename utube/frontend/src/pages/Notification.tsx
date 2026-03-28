import { useAppSelector } from "../redux/hooks"

export default function Notifications() {

  const { notifications } = useAppSelector(
    (state) => state.notification
  )

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">
        Notifications
      </h1>

      {notifications.map((n) => (
        <div key={n._id} className="border p-2 mb-2">
          {n.message}
        </div>
      ))}

    </div>
  )
}