self.addEventListener('push', function (event) {
  if (!event.data) return;
  const data = event.data.json();
  self.registration.showNotification(`🚨 ${data.severity || 'EMERGENCY'} ALERT: ${data.state}`, {
    body: data.headline || data.description,
    icon: '/icon-192.png',
    vibrate: [200, 100, 200]
  });
});
