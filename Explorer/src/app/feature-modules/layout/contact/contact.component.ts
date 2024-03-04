import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { 
  faXmark,
  faPhone, 
  faEnvelope
 } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'xp-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  faXmark = faXmark;
  faPhone = faPhone;
  faEnvelope = faEnvelope;

  constructor(
    public dialog: MatDialogRef<ContactComponent>,
    public dialogRef: MatDialog
  ) {}

  onClose(): void {
    this.dialog.close();
  }
}
