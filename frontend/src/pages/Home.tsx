import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { logoutUser } from "../features/auth/authSlice"
import { useNavigate } from "react-router-dom"

export default function Home() {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { user, isAuthenticated } = useAppSelector(
    (state) => state.auth
  )

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate("/login")
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Home Page
      </h1>

      {isAuthenticated && (
        <div className="mb-4">
          <p>Welcome, {user?.name}</p>
          <p>Email: {user?.email}</p>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

    </div>
  )
}