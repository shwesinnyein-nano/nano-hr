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
    if (data.status !== 'requested') {
      return from(this.firestore.collection('expense-data').doc(uid).update(data)).pipe(
        map(() => ({
          success: true,
          message: 'Expense updated successfully',
        }))
      );
    }else{
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
     
    }

    updateExpenseData(uid: string, data: any) {
      return from(this.firestore.collection('expense-data').doc(uid).update(data)).pipe(
        map(() => ({
          success: true,
          message: 'Expense updated successfully',
        }))
      );
    }
    getExpenseList() {
      return new Observable((observer) => {
        this.firestore
          .collection('expense-data')
          .get()
          .toPromise()
          .then((querySnapshot: any) => {
            const expenseList: any[] = [];
            querySnapshot?.forEach((doc: any) => {
              expenseList.push({
                id: doc.id,
                ...doc.data()
              });
            });
    
            // Sort by 'createdDate' or 'timestamp' in descending order
            expenseList.sort((a, b) => {
              const dateA = new Date(a.createdDate || a.timestamp).getTime();
              const dateB = new Date(b.createdDate || b.timestamp).getTime();
              return dateB - dateA; // Descending order
            });
    
            observer.next({
              data: expenseList,
              totalData: expenseList.length
            });
            observer.complete();
          })
          .catch((error: any) => {
            observer.error(error);
          });
      });
    }
    
    getExpenseList1() {
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
    async searchExpenseReal(status: string, company: string, fromDate: string, toDate: string) {
      const expenseRef = this.firestore.collection('expense-data').ref;
    
      try {
        // Fetch all documents from Firestore collection
        const snapshot = await expenseRef.get();
        const results = snapshot.docs.map((doc) => doc.data());
    
        // Filter the results based on the provided search terms
        const filteredExpense = results.filter((expense: any) => {
          const statusSearchTerm = status?.toLowerCase();
          const companySearchTerm = company?.toLowerCase();
    
          // Ensure requestDate and dueDate are properly handled
          const parsedFromDate = fromDate ? new Date(fromDate) : null;
          const parsedToDate = toDate ? new Date(toDate) : null;
    
          // Matching conditions for each search term
          const matchesStatus = statusSearchTerm
            ? expense.status?.toLowerCase() === statusSearchTerm
            : true; // Match if no status is provided
    
          const matchesCompany = companySearchTerm
            ? expense.company?.toLowerCase() === companySearchTerm
            : true; // Match if no company is provided
    
          const matchesFromDate = parsedFromDate
            ? new Date(expense.requestDate) >= parsedFromDate
            : true; // Match if no request date is provided
    
          const matchesToDate = parsedToDate
            ? new Date(expense.dueDate) <= parsedToDate
            : true; // Match if no due date is provided
    
          // Return true if all conditions are satisfied
          return matchesStatus && matchesCompany && matchesFromDate && matchesToDate;
        });
    
        return filteredExpense;
      } catch (error) {
        console.error("Error fetching expenses: ", error);
        return [];
      }
    }
    async searchExpense(status: string, company: string, fromDate: string, toDate: string) {
      const expenseRef = this.firestore.collection('expense-data').ref;
    
      try {
       
        const parsedFromDate = fromDate ? new Date(fromDate) : null;
        const parsedToDate = toDate ? new Date(toDate) : null;
    
        const snapshot = await expenseRef.get();
        const results = snapshot.docs.map((doc) => doc.data());
    
        const filteredExpense = results.filter((expense: any) => {
          const statusSearchTerm = status?.toLowerCase();
          const companySearchTerm = company?.toLowerCase();
    
          const matchesStatus = statusSearchTerm
            ? expense.status?.toLowerCase() === statusSearchTerm
            : true; 
    
          const matchesCompany = companySearchTerm
            ? expense.company?.toLowerCase() === companySearchTerm
            : true; 
    
          
          const matchesRequestDate = parsedFromDate && parsedToDate
            ? new Date(expense.expense_date) >= parsedFromDate && new Date(expense.expense_date) <= parsedToDate
            : true;
    
          const matchesDueDate = parsedFromDate && parsedToDate
            ? new Date(expense.due_date) >= parsedFromDate && new Date(expense.due_date) <= parsedToDate
            : true;
    
         
          return matchesStatus && matchesCompany && matchesRequestDate && matchesDueDate;
        });
    
        return filteredExpense;
      } catch (error) {
        console.error("Error fetching expenses: ", error);
        return [];
      }
    }
    
    
    async searchExpense1(status: string, company: string, requestDate: string, dueDate: string) {
      const expenseRef = this.firestore.collection('expense-data').ref;
    
      try {
        // Fetch all documents from Firestore collection
        const snapshot = await expenseRef.get();
        const results = snapshot.docs.map((doc) => doc.data());
    
        // Filter the results based on the provided search terms
        const filteredExpense = results.filter((expense: any) => {
          const statusSearchTerm = status?.toLowerCase();
          const companySearchTerm = company?.toLowerCase();
          const requestDateSearchTerm = requestDate?.toLowerCase();
          const dueDateSearchTerm = dueDate?.toLowerCase();
    
          // Matching conditions for each search term
          const matchesStatus = statusSearchTerm
            ? expense.status?.toLowerCase() === statusSearchTerm
            : true; // Match if no status is provided
    
          const matchesCompany = companySearchTerm
            ? expense.company?.toLowerCase() === companySearchTerm
            : true; // Match if no company is provided
    
          const matchesRequestDate = requestDateSearchTerm
            ? expense.requestDate?.toLowerCase() === requestDateSearchTerm
            : true; // Match if no request date is provided
    
          const matchesDueDate = dueDateSearchTerm
            ? expense.dueDate?.toLowerCase() === dueDateSearchTerm
            : true; // Match if no due date is provided
    
          // Return true if all conditions are satisfied
          return matchesStatus && matchesCompany && matchesRequestDate && matchesDueDate;
        });
    
        return filteredExpense;
      } catch (error) {
        console.error("Error fetching expenses: ", error);
        return [];
      }
    }
    

    approveExpense(uid: string, data: any) {
      return from(this.firestore.collection('request-expense').doc(uid).update(data)).pipe(
        map(() => ({
          success: true,
          message: 'Expense updated successfully',
        }))
      );
    }

    getLastExpenseSlipNo(): Observable < number > {
      return this.firestore
        .collection('system-config')
        .doc('expenseSlip')
        .valueChanges()
        .pipe(map((config: any) => config?.lastNumber || 0));
    }
    updateLastExpenseSlipNo(newNumber: number): Observable < void> {
      return from(
        this.firestore
          .collection('system-config')
          .doc('expenseSlip')
          .set({ lastNumber: newNumber }, { merge: true })
      );
    }

  }
