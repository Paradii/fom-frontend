// Service Worker สำหรับ Web Push ฝั่งร้านค้า (FR-10)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  event.waitUntil(self.registration.showNotification(data.title || 'FOM', { body: data.body, data: { url: data.url || '/shop/orders' } }))
})
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data.url))
})
