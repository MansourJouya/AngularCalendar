// Import necessary testing modules
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventDialogComponent } from './event-dialog.component';

describe('EventDialogComponent', () => {
  let component: EventDialogComponent;
  let fixture: ComponentFixture<EventDialogComponent>;

  // Set up the testing environment
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDialogComponent]  // Import the component for testing
    })
    .compileComponents();  // Compile the components for the test

    fixture = TestBed.createComponent(EventDialogComponent);  // Create component instance
    component = fixture.componentInstance;  // Get the component instance
    fixture.detectChanges();  // Trigger change detection
  });

  // Test if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();  // Assert that the component is created
  });
});
