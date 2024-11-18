import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, map, Observable } from 'rxjs';
import { apiResultFormat } from '../../core.index';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private firestore: AngularFirestore) { }

  saveEmployeeData(uid: string, data: any) {
    return from(this.firestore.collection('employees').doc(uid).set({
      uid,
      ...data
    }));
  }

  getEmployeeList(): Observable<apiResultFormat> {
    return new Observable((observer) => {
      this.firestore.collection('employees').get().toPromise().then((querySnapshot: any) => {
        const employees: any[] = [];
        querySnapshot?.forEach((doc: any) => {
          employees.push({
            id: doc.id,
            ...doc.data()
          });
        });
        observer.next({
          data: employees,
          totalData: employees.length
        });
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  updateEmployeeData(uid: string, data: any) {
    console.log("data", data);
    console.log("uid", uid);
    return from(this.firestore.collection('employees').doc(uid).update(data)).pipe(
      map(() => ({
        success: true,
        message: 'Employee updated successfully',
      }))
    );
  }
}
