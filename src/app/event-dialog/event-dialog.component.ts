import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-event-dialog',
  standalone: true,  // Define the component as standalone
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule  // Import ReactiveFormsModule for form handling
  ],
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.css'],
})
export class EventDialogComponent implements OnInit, OnDestroy {
  eventForm: FormGroup;  // Form group for managing the event form
  private destroy$ = new Subject<void>();  // Subject for cleaning up subscriptions

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,  // Reference to the dialog
    @Inject(MAT_DIALOG_DATA) public data: any,  // Inject data passed to the dialog
    private fb: FormBuilder  // FormBuilder for constructing the form
  ) {
    // Initialize form with validation rules
    this.eventForm = this.fb.group({
      title: [
        data.event?.title || '',  // Default value for title
        [Validators.required, Validators.maxLength(50)]  // Validation rules for title
      ],
      description: [
        data.event?.description || '',  // Default value for description
        [Validators.required, Validators.maxLength(200)]  // Validation rules for description
      ],
      date: [data.date || null, Validators.required],  // Default date or null
    });
  }

  ngOnInit(): void {
    // Set up form value changes handler with debounce and distinct checks
    this.eventForm.valueChanges
      .pipe(
        debounceTime(300),  // Delay of 300ms before processing changes
        distinctUntilChanged(),  // Avoid processing duplicate values
        takeUntil(this.destroy$)  // Unsubscribe on component destruction
      )
      .subscribe((values) => {
        console.log('Form Changes:', values);  // Log the form values on change
      });
  }

  // Close the dialog without saving
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Save the form data and close the dialog
  onSave(): void {
    if (this.eventForm.valid) {  // Check if the form is valid
      this.dialogRef.close(this.eventForm.value);  // Return form values and close the dialog
    }
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions on component destroy
    this.destroy$.next();
    this.destroy$.complete();
  }
}
