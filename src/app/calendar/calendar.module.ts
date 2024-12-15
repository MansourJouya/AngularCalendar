import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './calendar.component';

// Angular Material Modules
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Standalone Component
import { EventDialogComponent } from '../event-dialog/event-dialog.component';

@NgModule({
  imports: [
    CommonModule,           // Provides common directives and pipes (e.g., ngIf, ngFor)
    ReactiveFormsModule,    // Enables reactive forms in the app

    // Angular Material Modules
    MatDialogModule,        // Dialog windows (modals)
    MatButtonModule,        // Material-styled buttons
    MatIconModule,          // Material design icons
    MatFormFieldModule,     // Form fields with Material styling
    MatInputModule,         // Material input fields
    MatDatepickerModule,    // Material design date picker
    MatNativeDateModule,    // Native date handling for Material Datepicker
    MatCardModule,          // Material card components
    DragDropModule,         // Enables drag-and-drop functionality

    // Standalone components
    CalendarComponent,      // Calendar component
    EventDialogComponent    // Event dialog component
  ],
  exports: [
    CalendarComponent,      // Export CalendarComponent for use in other modules
    EventDialogComponent,   // Export EventDialogComponent for use in other modules
    MatDialogModule,        // Exports the Dialog module
    MatButtonModule,        // Exports the Button module
    MatIconModule,          // Exports the Icon module
    MatFormFieldModule,     // Exports the FormField module
    MatInputModule,         // Exports the Input module
    MatDatepickerModule,    // Exports the Datepicker module
    MatNativeDateModule,    // Exports the NativeDate module
    MatCardModule,          // Exports the Card module
    DragDropModule          // Exports the DragDrop module
  ]
})
export class CalendarModule {}
