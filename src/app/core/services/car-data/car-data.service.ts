import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from } from 'rxjs';
import { getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CarDataService {

  constructor(private firestore: AngularFirestore) { }

  saveCarData(uid: string, data: any) {
    return from(this.firestore.collection('car-data').doc(uid).set({
      uid,
      ...data
    })).pipe(
      map(() => ({
        success: true,
        message: 'Car saved successfully',
      }))
    );
  }

  updateCarData(uid: string, data: any) {
    return from(this.firestore.collection('car-data').doc(uid).update(data)).pipe(
      map(() => ({
        success: true,
        message: 'Car updated successfully',
      })) 
    );
  }

  getCarList() {
    return new Observable((observer) => {
      this.firestore.collection('car-data').get().toPromise().then((querySnapshot: any) => {
        const carList: any[] = [];
        querySnapshot?.forEach((doc: any) => {
          carList.push({
            id: doc.id,
            ...doc.data()
          });
        });
        observer.next({
          data: carList,
          totalData: carList.length
        });
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
  async searchCar(brand: string) {
    const employeesRef = this.firestore.collection('car-data').ref;
  
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
