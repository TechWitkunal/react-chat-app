import { limitSentence } from "./limitedSentence";

export function sendNotification(title, desc) {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: `Message: ${limitSentence(desc, 20)}`,
        // icon: photo || 'https://firebasestorage.googleapis.com/v0/b/online-chat-app-d822f.appspot.com/o/default%20images%2Fgorup%20icon.png?alt=media&token=8c9f50e1-f492-4dc5-a89e-5b86dbade2f8'        
      });
    }
  }

  