import { Injectable, input } from '@angular/core';
import { apiResultFormat } from '../../core.index';
import { combineLatest, from, map, Observable, switchMap } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EmployeeService } from '../employee/employee.service';
import { query, where, getDocs, collection, getFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor(private firestore: AngularFirestore, private employeeService: EmployeeService) { }


  saveUserData(uid: string, data: any) {

    return from(this.firestore.collection('users').doc(uid).set({
      uid,
      ...data
    }));
  }
  updateUserData(uid: string, data: any) {
    console.log("updateUserData", data);
    return from(this.firestore.collection('users').doc(uid).update(data)).pipe(
      switchMap(() => this.employeeService.updateEmployeeData(uid, data))
    );
  }
  getUsers(): Observable<apiResultFormat> {
    return new Observable((observer) => {
      this.firestore.collection('users').get().toPromise().then((querySnapshot: any) => {
        const users: any[] = [];
        querySnapshot?.forEach((doc: any) => {
          users.push({
            id: doc.id,
            ...doc.data()
          });
        });
        users.sort((a, b) => {
          const dateA = new Date(a.updatedDate || a.createdDate).getTime();
          const dateB = new Date(b.updatedDate || b.createdDate).getTime();
          return dateB - dateA; // Descending order
        });
        observer.next({
          data: users,
          totalData: users.length
        });
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
  async searchUsers(name: string | null, role: string | null): Promise<any[]> {
    const usersRef = this.firestore.collection('users').ref;
    const q = query(usersRef);

    try {
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => doc.data());

      const filteredUsers = results.filter((user: any) => {
        const searchTerm = name?.toLowerCase();
        const roleSearchTerm = role?.toLowerCase();
        console.log("roleSearchTerm", roleSearchTerm);
        return (
          (searchTerm && (
            user.firstName.toLowerCase().includes(searchTerm) ||
            user.lastName.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
          )) ||
          (roleSearchTerm && user.company.includes(roleSearchTerm))
        );
      });

      return filteredUsers;
    } catch (error) {
      console.error("Error fetching users: ", error);
      return [];
    }
  }

  deletUserByUid(uid: string) {
    return from(this.firestore.collection('users').doc(uid).delete());
  }
  getUserByUid(uid?: string): Observable<any> {
    if (uid) {
      return this.firestore.collection('users').doc(uid).valueChanges();
    } else {
      return this.firestore.collection('users').valueChanges();
    }
  }

  async searchUsers1(name: string | null, role: string | null): Promise<any[]> {
    const usersRef = this.firestore.collection('users').ref;
    const q = query(usersRef);

    try {
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => doc.data());

      const filteredUsers = results.filter((user: any) => {
        const searchTerm = name?.toLowerCase();
        return (

          user.firstName.toLowerCase().includes(searchTerm) ||
          user.lastName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
      });

      return filteredUsers;
    } catch (error) {
      console.error("Error fetching users: ", error);
      return [];
    }
  }
  updateUserMenuAccess(uid: string, menuAccess: any,isUpdate:boolean=false) {
    return from(
      isUpdate 
        ? this.firestore.collection('permissions').doc(uid).update({ menuAccess })
        : this.firestore.collection('permissions').doc(uid).set({ menuAccess })
    ).pipe(map(() => ({
      success: true,
      message: isUpdate ? 'Updated Permission successfully' : 'Created Permission successfully',
      data: {
        uid: uid,
        menuAccess
      }
    })))
  }
  getMenuAccess(uid: string){
    return this.firestore.collection('permissions').doc(uid).valueChanges();
  }

}
