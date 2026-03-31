import { Link, useLocation } from "react-router-dom"
import { Home, History, Bell, LayoutDashboard, Video, Upload } from "lucide-react"
import { cn } from "../lib/utils"
import { ScrollArea } from "./ui/scroll-area"
import { Button } from "./ui/button"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "History", href: "/history", icon: History },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <div className="fixed left-0 top-0 h-screen w-64 border-r bg-background">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Video className="h-6 w-6 text-red-600" />
        <span className="text-xl font-bold">VideoHub</span>
      </div>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-4 space-y-4">
          {/* Upload Button */}
          <Link to="/upload">
            <Button className="w-full gap-2" size="lg">
              <Upload className="h-5 w-5" />
              Upload Video
            </Button>
          </Link>

          {/* Navigation */}
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </ScrollArea>
    </div>
  )
}
