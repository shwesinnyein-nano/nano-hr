import { Injectable } from '@angular/core';
import { from, map, Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<void>();
  notificationChanges = this.notificationSubject.asObservable();

  constructor(private firestore: AngularFirestore) { }

  // private notificationSubject = new BehaviorSubject<any>(null);
  private approvalStepSubject = new BehaviorSubject<number>(0);
  private notificationsByVerifier: Map<string, BehaviorSubject<any[]>> = new Map();
  initializeVerifierNotifications(verifierId: string): void {
    if (!this.notificationsByVerifier.has(verifierId)) {
      this.notificationsByVerifier.set(verifierId, new BehaviorSubject<any[]>([]));
    }
  }
  sendNotification1(notification: any, verifierId: string): void {
    
    this.initializeVerifierNotifications(verifierId);
    const currentNotifications = this.notificationsByVerifier.get(verifierId)?.value || [];
    this.notificationsByVerifier.get(verifierId)?.next([...currentNotifications, notification]);
  }

  sendNotification(data: any) {
    // this.notificationSubject.next();
    return from(this.firestore.collection('notifications').doc(data.notiId).set({
      ...data
    }));

  }

  getNotificationById(notiId: string): Observable<any> {
    return this.firestore.collection('notifications').doc(notiId).valueChanges();
  }

  getNotificationByUid(uid: string): Observable<any[]> {
    return this.firestore.collection('notifications', ref => ref.where('data.uid', '==', uid))
      .snapshotChanges()
      .pipe(
        map((actions: any) => actions.map((a: any) => {
          const data = a.payload.doc.data(); // Get document data
          const id = a.payload.doc.id;      // Get document ID
          return { id, ...data };           // Combine ID with data
        }))
      );
  }
  updateNotification(data: any) {
    return from(
      this.firestore.collection('notifications').doc(data.notiId).set({ ...data })
    )
  }
  updateNotificationStatus(notiId: string, updateData: any) {
    return from(this.firestore.collection('notifications').doc(notiId).update(updateData));
}

  
  
  updateNotificationa(data: any) {
    return from(this.firestore.collection('notifications').doc(data.notiId).set({
      ...data
    })).pipe(
      map(() => {
        this.notificationSubject.next();
        return data;
      })
    );
    
  }

  getNotificationsForVerifier(verifierId: string): Observable<any[]> {
    this.initializeVerifierNotifications(verifierId);
    return this.notificationsByVerifier.get(verifierId)?.asObservable() as Observable<any[]>;
  }
 

getNotification(): Observable<any> {
  return new Observable((observer) => {
    this.firestore.collection('notifications').get().toPromise().then((querySnapshot: any) => {
      const notificationList: any[] = [];
      querySnapshot?.forEach((doc: any) => {
        notificationList.push({
          id: doc.id,
          ...doc.data()
        });
      });

      observer.next({
        data: notificationList,
        totalData: notificationList.length
      });
      observer.complete();
    }).catch((error: any) => {
      observer.error(error);
    });
  }).pipe(
    map((response: any) => {

      // Sort by `updatedDate` in descending order
      const sortedData = response.data.sort((a: any, b: any) => {
        const dateA = new Date(a.data.updatedDate).getTime();
        const dateB = new Date(b.data.updatedDate).getTime();
        return dateB - dateA; // Descending order
      });

      return {
        ...response,
        data: sortedData // Return sorted data
      };
    })
  );
}

  getNotification1(): Observable<any> {
    return new Observable((observer) => {
      this.firestore.collection('notifications').get().toPromise().then((querySnapshot: any) => {
        const notificationList: any[] = [];
        querySnapshot?.forEach((doc: any) => {
          notificationList.push({
            id: doc.id,
            ...doc.data()
          });
        });
        observer.next({
          data: notificationList,
          totalData: notificationList.length
        });
        observer.complete();
      }).catch((error: any) => {
        observer.error(error);
      });
    });
  }

  setApprovalStep(step: number): void {
    this.approvalStepSubject.next(step);
  }

  getApprovalStep(): Observable<number> {
    return this.approvalStepSubject.asObservable();
  }
}
