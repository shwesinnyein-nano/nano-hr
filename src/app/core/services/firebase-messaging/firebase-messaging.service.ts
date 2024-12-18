import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseMessagingService {

  constructor(private afMessaging: AngularFireMessaging) { }

  getPermission(): Observable<void> {
    return new Observable<void>((observer) => {
      this.afMessaging.requestToken.subscribe(
        (token: string | null) => {
          if (token) {
            // If a token is received, you can handle it, e.g., save it to the server or localStorage
            console.log('Token received:', token);
            observer.next(); // Notify that the permission was granted successfully
          } else {
            console.error('No token received');
            observer.error('No token received');
          }
          observer.complete();
        },
        (error) => {
          observer.error(error); // Handle the error if any
        }
      );
    });
  }


  receiveMessage(): Observable<any> {
    return this.afMessaging.messages;
  }

  sendNotification(token: string, message: any): void {
    // Send the notification to Firebase Cloud Messaging (FCM)
    // This is just an example, you would need to configure your server to handle FCM notifications
    // Call your backend server to send notification to the target token
    fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `AIzaSyCcmqwk6bmACl7BTbwKsIAj57iiZokqdQ4`, // Your Firebase Server Key
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title: message.title,
          body: message.body,
          click_action: 'FLUTTER_NOTIFICATION_CLICK'
        }
      })
    });
  }
}
