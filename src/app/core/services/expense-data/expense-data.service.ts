import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Firestore, getDocs } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class ExpenseDataService {

  constructor(private firestore: AngularFirestore) { }


  saveExpenseData(uid: string, data: any) {
    return from(this.firestore.collection('expense-data').doc(uid).set({
      uid,
      ...data
    })).pipe(
      map(() => ({
        success: true,
        message: 'Expense saved successfully',
      }))
    );
  }

  updateCarData(uid: string, data: any) {
      return from(this.firestore.collection('expense-data').doc(uid).update(data)).pipe(
      map(() => ({
        success: true,
        message: 'Expense updated successfully',
      })) 
    );
  }

  getExpenseList() {
    return new Observable((observer) => {
      this.firestore.collection('expense-data').get().toPromise().then((querySnapshot: any) => {
        const expenseList: any[] = [];
        querySnapshot?.forEach((doc: any) => {
          expenseList.push({
            id: doc.id,
            ...doc.data()
          });
        });
        observer.next({
          data: expenseList,
          totalData: expenseList.length
        });
        observer.complete();
      }).catch((error: any) => {
        observer.error(error);
      });
    });
  }
  async searchExpense(brand: string) {
    const employeesRef = this.firestore.collection('expense-data').ref;

    try {
      const snapshot = await getDocs(employeesRef);
      const results = snapshot.docs.map(doc => doc.data());
  
      const filteredUsers = results.filter((car: any) => {
       
        const brandSearchTerm = brand?.toLowerCase();
  
        // Match name and company

  
        const matchesBrand = brandSearchTerm
          ? car.brand?.toLowerCase().includes(brandSearchTerm)
          : true; // If no company is provided, consider it a match.
  
        return matchesBrand;
      });
  
      return filteredUsers;
    } catch (error) {
      console.error("Error fetching users: ", error);
      return [];
    }
  }
}
