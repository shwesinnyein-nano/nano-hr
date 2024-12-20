import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, map, Observable } from 'rxjs';
import { apiResultFormat } from '../../core.index';
import { getDocs } from '@angular/fire/firestore';
import { query } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private firestore: AngularFirestore) { }


  getLastEmployeeNo(): Observable < number > {
    return this.firestore
      .collection('employee-config')
      .doc('employeeID')
      .valueChanges()
      .pipe(map((config: any) => config?.lastNumber || 0));
  }
  updateLastEmployeeNo(newNumber: number): Observable < void> {
    return from(
      this.firestore
        .collection('employee-config')
        .doc('employeeID')
        .set({ lastNumber: newNumber }, { merge: true })
    );
  }
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
        employees.sort((a, b) => {
          const dateA = new Date(a.updatedDate || a.createdDate).getTime();
          const dateB = new Date(b.updatedDate || b.createdDate).getTime();
          return dateB - dateA; // Descending order
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
    // return new Observable((observer) => {
    //   this.firestore.collection('employees').get().toPromise().then((querySnapshot: any) => {
    //     const employees: any[] = [];
    //     querySnapshot?.forEach((doc: any) => {
    //       employees.push({
    //         id: doc.id,
    //         ...doc.data()
    //       });
    //     });
    //     observer.next({
    //       data: employees,
    //       totalData: employees.length
    //     });
    //     observer.complete();
    //   }).catch((error) => {
    //     observer.error(error);
    //   });
    // });
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

  async searchEmployee(company: string, name: string) {
    const employeesRef = this.firestore.collection('employees').ref;
  
    try {
      const snapshot = await getDocs(employeesRef);
      const results = snapshot.docs.map(doc => doc.data());
  
      const filteredUsers = results.filter((employee: any) => {
        const searchTerm = name?.toLowerCase();
        const companySearchTerm = company?.toLowerCase();
  
        // Match name and company
        const matchesName = searchTerm
          ? (employee.firstName?.toLowerCase().includes(searchTerm) ||
             employee.lastName?.toLowerCase().includes(searchTerm))
          : true; // If no name is provided, consider it a match.
  
        const matchesCompany = companySearchTerm
          ? employee.company?.toLowerCase().includes(companySearchTerm)
          : true; // If no company is provided, consider it a match.
  
        return matchesName && matchesCompany;
      });
  
      return filteredUsers;
    } catch (error) {
      console.error("Error fetching users: ", error);
      return [];
    }
  }
}  
