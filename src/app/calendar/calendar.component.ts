import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild, TemplateRef } from '@angular/core';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';
import { CdkDragStart, CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatCardModule,
    DragDropModule
  ]
})
export class CalendarComponent {
  @ViewChild('eventForm') eventForm!: TemplateRef<any>; // Access to ng-template

  // Current month and year
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();

  // Array to store events
  events: any[] = [];

  // To manage edit mode
  isEditMode: boolean = false;

  // Reactive form group for event management
  eventFormGroup: FormGroup;

  // Selected day in the calendar
  selectedDay: number | null = null;

  // Weekday and month names
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Array to hold days of the current month
  daysInMonth: { day: number, position: number; eventCount: number; }[] = [];

  // Hours of the day (0 to 23)
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);

  constructor(private fb: FormBuilder, private dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.eventFormGroup = this.fb.group({
      title: ['', Validators.required], // Title is required
      description: ['', Validators.required], // Description is required
      date: [{ value: '', disabled: true }, Validators.required] // Date is required and non-editable
    });
  }

  ngOnInit(): void {
    this.generateDays(); // Initialize days of the current month
  }

  // Get the starting day of the current month
  getStartDayOfMonth(): number {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    return firstDayOfMonth.getDay();
  }


  generateDays(): void {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const startDay = this.getStartDayOfMonth();
    this.daysInMonth = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const eventsForDay = this.getEventsForDay(i);
      this.daysInMonth.push({
        day: i,
        position: (startDay + i - 1) % 7,
        eventCount: eventsForDay.length // تعداد رویدادهای آن روز
      });
    }
  }



  // Navigate to the next month
  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.selectedDay = null;
    this.generateDays();
  }

  // Navigate to the previous month
  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.selectedDay = null;
    this.generateDays();
  }

  // Open the event form dialog
  openEventForm(hour: number, day: number, event: any = null): void {
    const selectedDate = new Date(this.currentYear, this.currentMonth, day, hour);
    this.isEditMode = !!event;

    if (this.isEditMode) {
      this.eventFormGroup.patchValue({
        title: event.title,
        description: event.description,
        date: selectedDate
      });
    } else {
      this.eventFormGroup.patchValue({
        title: '',
        description: '',
        date: selectedDate
      });
    }

    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data: { date: selectedDate, event: event }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.isEditMode) {
          this.editEvent(result, event);
        } else {
          this.saveEvent({ ...result, date: selectedDate });
        }
      }
    });
  }


  // Save a new event to the events array and update the event count for the respective day
  saveEvent(data: any): void {
    const newEvent = { ...data, date: data.date, id: this.generateUniqueId() };
    this.events.push(newEvent);
    this.updateEventCountForDay(newEvent.date);
    this.cdr.detectChanges();
    this.eventFormGroup.reset();
  }

  // Update the event count for a specific day in the calendar
  private updateEventCountForDay(eventDate: Date): void {
    const day = eventDate.getDate();
    const eventCount = this.getEventsForDay(day).length;
    const dayToUpdate = this.daysInMonth.find(d => d.day === day);

    if (dayToUpdate) {
      dayToUpdate.eventCount = eventCount;
    }
  }


  // Generates a unique 9-character ID using a random base-36 string.
  private generateUniqueId(): string {
    return Math.random().toString(36).slice(2, 11);
  }


  // Edit an existing event
  editEvent(eventData: any, event: any): void {
    event.title = eventData.title;
    event.description = eventData.description;
    this.cdr.detectChanges();
    this.eventFormGroup.reset();
  }

  // Get events for a specific day
  getEventsForDay(day: number): any[] {
    return this.events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && eventDate.getMonth() === this.currentMonth && eventDate.getFullYear() === this.currentYear;
    });
  }

  // Delete an event
  deleteEvent(event: any): void {
    this.events = this.events.filter(e => e !== event);

    // به‌روزرسانی تعداد رویدادهای روز پس از حذف رویداد
    this.updateEventCountForDay(new Date(event.date));
    this.cdr.detectChanges();
  }

  // Close the dialog
  closeDialog(): void {
    this.dialog.closeAll();
  }

  // Format a date to a readable string
  getFormattedDate(day: number): string {
    const date = new Date(this.currentYear, this.currentMonth, day);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  }

  // Select a specific day in the calendar
  selectDay(day: number): void {
    this.selectedDay = this.selectedDay === day ? null : day;
  }

  // Get events for a specific day and hour
  getEventsForDayHour(day: number, hour: number): any[] {
    return this.events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === this.currentMonth &&
        eventDate.getFullYear() === this.currentYear &&
        eventDate.getHours() === hour
      );
    });
  }

  // Get all connected containers for drag-and-drop
  getAllHourContainers(day: number): string[] {
    return this.hours.map(hour => `hour-${day}-${hour}`);
  }

  // Handle drag start
  onDragStarted(event: CdkDragStart<any>): void {
    const draggedItemId = event.source.element.nativeElement.id;
  }

  // Handle drag end
  onDragEnded(event: CdkDragEnd<any>): void {
    const draggedItemId = event.source.element.nativeElement.id;
  }

  // Handle the event being dragged and dropped to a new position
  onEventDrop(event: CdkDragDrop<any[]>): void {
    const previousContainerId = event.previousContainer.id;
    const currentContainerId = event.container.id;

    // Ensure the event is moved to a different container
    if (previousContainerId !== currentContainerId) {
      const movedEvent = event.item.data;

      if (!movedEvent || !movedEvent.id) {
        return; // Exit if the event data or ID is invalid
      }

      // Extract new day and hour information from the target container ID
      const [_, newDay, newHour] = currentContainerId.split('-');
      const newDate = new Date(this.currentYear, this.currentMonth, parseInt(newDay, 10), parseInt(newHour, 10));

      // Find the event in the events list using its unique ID
      const eventIndex = this.events.findIndex(e => e.id === movedEvent.id);

      if (eventIndex > -1) {
        // Update the event's date to the new date
        this.events[eventIndex].date = newDate;

        // Trigger change detection to update the view
        this.cdr.detectChanges();
      } else {
        console.error('Event not found in the events list');
      }
    }
  }


}
