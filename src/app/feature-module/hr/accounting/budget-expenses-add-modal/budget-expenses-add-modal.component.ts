import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-budget-expenses-add-modal',
  
  templateUrl: './budget-expenses-add-modal.component.html',
  styleUrl: './budget-expenses-add-modal.component.scss'
})
export class BudgetExpensesAddModalComponent implements OnInit{

  addRevenueForm!: FormGroup;
  bsConfig: any;
  uploadedDocuments: { name: string; dateUploaded: string }[] = [];
  previewUrl: string | ArrayBuffer | null = null;
  constructor(private fb: FormBuilder, private ngbActiveModal: NgbActiveModal) {
    this.bsConfig = {
      dateInputFormat: 'YYYY-MM-DD', // Format of the date
      showWeekNumbers: false,       // Hide week numbers
      minDate: new Date()           // Disable dates before today
    };
  }

  ngOnInit(): void {
    
    this.loadForm();
  }

  loadForm(data?: any) {
    this.addRevenueForm = this.fb.group({
      uid: new FormControl(data?.uid || uuidv4()),
      expense_type: new FormControl(data?.expense_type || null, Validators.required),
      expense_source: new FormControl(data?.expense_source || null, Validators.required),
      creditor_name: new FormControl(data?.creditor_name || null, Validators.required),
      invoice_number: new FormControl(data?.invoice_number || null, Validators.required),
      expense_date: new FormControl(data?.expense_date || null, Validators.required),
      due_date: new FormControl(data?.due_date || null, [Validators.required,this.futureDateValidator]),
      expense_tax: new FormControl(null, ),
      expense_amount: new FormControl(null, Validators.required),
      expense_currency: new FormControl(null, ),
      expense_notes: new FormControl(null, ),
      image: new FormControl(null, ),
    });
  }

  onFileSelectedFiles(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (files) {
      const currentDate = new Date().toLocaleDateString(); // Format as per locale
      for (let i = 0; i < files.length; i++) {
        this.uploadedDocuments.push({
          name: files[i].name,
          dateUploaded: currentDate,
        });
      }
    }
  }
  
  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;

  //   if (input.files && input.files[0]) {
  //     const file = input.files[0];

  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.previewUrl = reader.result; // Base64 string of the image
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  futureDateValidator(control: FormControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for comparison
    if (selectedDate < today) {
      return { invalidDate: true };
    }
    return null;
  }

  closeModal() {
    this.ngbActiveModal.dismiss();
  }
  onSubmitExpense() {
    if (this.addRevenueForm.value.expense_date) {
      const expenseDate = new Date(this.addRevenueForm.value.expense_date);
      this.addRevenueForm.patchValue({
        expense_date: expenseDate.toISOString()
      });

    }
    if (this.addRevenueForm.value.due_date) {
      const dueDate = new Date(this.addRevenueForm.value.due_date);
      this.addRevenueForm.patchValue({
        due_date: dueDate.toISOString()
      });
    }
    this.addRevenueForm.get('image')?.setValue(this.previewUrl);
    console.log(this.addRevenueForm.value);
    if(this.addRevenueForm.valid) {
      console.log('valid');
      this.ngbActiveModal.close({
        data: { ...this.addRevenueForm.value, status: 'inprogress' },
       
        // Add current user's UID to the data
      });

    } else {
      this.addRevenueForm.markAllAsTouched();
      console.log('invalid');
    }
  }
}
