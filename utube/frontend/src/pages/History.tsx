import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { fetchHistory } from "../features/watchHistory/watchHistorySlice"

export default function History() {

  const dispatch = useAppDispatch()

  const { history, loading } = useAppSelector(
    (state) => state.history
  )

  useEffect(() => {
    dispatch(fetchHistory())
  }, [dispatch])

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">
        Watch History
      </h1>

      {history.map((h: any) => (
        <div key={h._id} className="border p-2 mb-2">

          <h2>{h.videoId?.title}</h2>
          <p>{h.videoId?.creatorId?.name}</p>

        </div>
      ))}

    </div>
  )
}