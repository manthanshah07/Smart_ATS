import { MOCK_NOTIFICATIONS } from '../mock/notifications'

export const notificationService = {
  getNotifications: async (role = null) => {
    let list = [...MOCK_NOTIFICATIONS]
    if (role) {
      list = list.filter((n) => n.user_role === role)
    }
    return list
  },

  markAsRead: async (id) => {
    const notif = MOCK_NOTIFICATIONS.find((n) => n.id === Number(id))
    if (notif) notif.is_read = true
    return notif
  },

  markAllAsRead: async (role = null) => {
    MOCK_NOTIFICATIONS.forEach((n) => {
      if (!role || n.user_role === role) {
        n.is_read = true
      }
    })
    return true
  },
}
