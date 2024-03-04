import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'xp-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.css']
})
export class TermsOfServiceComponent {
  constructor(
    public dialogRef: MatDialog,
  ) {}

  showContact(): void {
    this.dialogRef.open(ContactComponent);
  }
}
