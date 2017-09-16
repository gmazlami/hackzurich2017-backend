var pushpad = require('pushpad');
const config = require('./../../local.js');

var project = new pushpad.Pushpad({
  authToken: config.PUSHPAD_ACCESS_TOKEN,
  projectId: '4425'
});

exports.createNotification = (title, body, targetUrl, imageUrl,) => {
    return new pushpad.Notification({
        project: project,
        body: body, // max 120 characters
        title: title, // optional, defaults to your project name, max 30 characters
        targetUrl: targetUrl, // optional, defaults to your project website
        iconUrl: imageUrl, // optional, defaults to the project icon
        imageUrl: imageUrl, // optional, an image to display in the notification content
        ttl: 604800, // optional, drop the notification after this number of seconds if a device is offline
        requireInteraction: true, // optional, prevent Chrome on desktop from automatically closing the notification after a few seconds
        starred: true // optional, bookmark the notification in the Pushpad dashboard (e.g. to highlight manual notifications)
    });
}