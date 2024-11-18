import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { from } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private firestore: AngularFirestore) { }

  saveCompanyData(uid: string, data: any) {
    return from(this.firestore.collection('company').doc(uid).set({
      uid,
      ...data
    })).pipe(
      map(() => ({
        success: true,
        message: 'Company saved successfully',
      }))
    );
  }

  updateCompanyData(uid: string, data: any) {
    return from(this.firestore.collection('company').doc(uid).update(data)).pipe(
      map(() => ({
        success: true,
        message: 'Company updated successfully',
      }))
    );
  }

  getCompanyList() {
    return new Observable((observer) => {
      this.firestore.collection('company').get().toPromise().then((querySnapshot: any) => {
        const companyList: any[] = [];
        querySnapshot?.forEach((doc: any) => {
          companyList.push({
            id: doc.id,
            ...doc.data()
          });
        });
        observer.next({
          data: companyList,
          totalData: companyList.length
        });
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
}
