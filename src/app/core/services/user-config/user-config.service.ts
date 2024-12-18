import { Injectable } from '@angular/core';

import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserConfigService {

  constructor(private firestore: AngularFirestore) { }

  saveConfiguration(data: any){
    return from(this.firestore.collection('user-config').doc(data.uid).set({
      uid: data.uid,
      ...data
    })).pipe(
      map(() => ({
        success: true,  
        message: 'Configuration saved successfully',
      }))
    );
  }   

  updateConfiguration(uid: string, data: any){
    return from(this.firestore.collection('user-config').doc(uid).update(data)).pipe(
      map(() => ({
        success: true,
        message: 'Configuration updated successfully',
      }))
    );
  }

  getConfigurationList() {
    return new Observable((observer) => {
      this.firestore.collection('user-config').get().toPromise().then((querySnapshot: any) => {
        const configurationList: any[] = [];
        querySnapshot?.forEach((doc: any) => {
          configurationList.push({
            id: doc.id,
            ...doc.data()
          });
        });
        observer.next({
          data: configurationList,
          totalData: configurationList.length
        });
        observer.complete();
      }).catch((error: any) => {
        observer.error(error);
      });
    });
  }

  getUserConfigById(uid: string) {
    return this.firestore.collection('user-config').doc(uid).get().toPromise();
  }
}
