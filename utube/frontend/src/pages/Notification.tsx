import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "../redux/hooks"
import { fetchNotifications, markAsRead, markAllRead } from "../features/notification/notificationSlice"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Bell, Video, ThumbsUp, MessageCircle, UserPlus, Settings } from "lucide-react"
import { Button } from "../components/ui/button"

export default function Notifications() {
  const dispatch = useAppDispatch()
  const { notifications, loading } = useAppSelector((state) => state.notification)

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "NEW_VIDEO":
        return <Video className="h-5 w-5 text-blue-500" />
      case "NEW_LIKE":
        return <ThumbsUp className="h-5 w-5 text-red-500" />
      case "NEW_COMMENT":
        return <MessageCircle className="h-5 w-5 text-green-500" />
      case "NEW_SUBSCRIBER":
        return <UserPlus className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const notifDate = new Date(date)
    const diffMs = now.getTime() - notifDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return notifDate.toLocaleDateString()
  }

  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      dispatch(markAsRead(notificationId))
    }
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllRead())
  }

  const importantNotifications = notifications.filter((n) => !n.isRead)
  const otherNotifications = notifications.filter((n) => n.isRead)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with your latest activity
            </p>
          </div>
          <div className="flex gap-2">
            {importantNotifications.length > 0 && (
              <Button variant="outline" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            )}
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-16">
              <p className="text-muted-foreground">Loading notifications...</p>
            </CardContent>
          </Card>
        ) : notifications.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Bell className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
              <p className="text-sm text-muted-foreground text-center">
                When you get notifications, they'll show up here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Important/Unread Notifications */}
            {importantNotifications.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-bold">Important</h2>
                  <Badge variant="destructive">{importantNotifications.length}</Badge>
                </div>
                <div className="space-y-2">
                  {importantNotifications.map((n) => (
                    <Card
                      key={n._id}
                      className="hover:bg-accent transition-colors cursor-pointer border-l-4 border-l-primary"
                      onClick={() => handleNotificationClick(n._id, n.isRead)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium mb-1">{n.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {getTimeAgo(n.createdAt)}
                            </p>
                          </div>
                          {!n.isRead && (
                            <div className="flex-shrink-0">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Other Notifications */}
            {otherNotifications.length > 0 && (
              <div>
                {importantNotifications.length > 0 && <Separator className="my-6" />}
                <h2 className="text-xl font-bold mb-4">Earlier</h2>
                <div className="space-y-2">
                  {otherNotifications.map((n) => (
                    <Card
                      key={n._id}
                      className="hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => handleNotificationClick(n._id, n.isRead)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 mt-1 opacity-60">
                            {getNotificationIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-muted-foreground mb-1">
                              {n.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getTimeAgo(n.createdAt)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}