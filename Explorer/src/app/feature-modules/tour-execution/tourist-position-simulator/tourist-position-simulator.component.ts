import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { TouristPosition } from '../model/tourist-position.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { LocationCoords } from 'src/app/shared/model/location-coords.model';
import { MapComponent } from 'src/app/shared/map/map.component';

@Component({
  selector: 'xp-tourist-position-simulator',
  templateUrl: './tourist-position-simulator.component.html',
  styleUrls: ['./tourist-position-simulator.component.css']
})
export class TouristPositionSimulatorComponent implements OnInit {

  touristPosition: TouristPosition;
  @Input() isTourExecutionMap = false;
  @Input() tourId: any;
  @Output() positionChanged = new EventEmitter<LocationCoords>();

  @ViewChild(MapComponent, { static: false }) mapComponent: MapComponent;

  constructor(
    private authService: AuthService,
    private service: TourExecutionService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MapModalComponent>
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe({
      next: (userResult: User) => {
        this.service.getTouristPositionByTouristId(userResult.id).subscribe({
          next: (result: TouristPosition) => {
            this.touristPosition = { touristId: userResult.id, longitude: result.longitude, latitude: result.latitude };
          },
          error: () => {
          }
        });
      }
    });
  }

  changeTouristPosition(longLat: [number, number]): void {
    if (this.touristPosition) {
      [this.touristPosition.longitude, this.touristPosition.latitude] = longLat;
      this.service.updateTouristPosition(this.touristPosition).subscribe({
        next: (result: TouristPosition) => {
          this.positionChanged.emit({
            longitude: longLat[0],
            latitude: longLat[1],
          });
          setTimeout(() => {}, 300);
          this.dialogRef.close();
        }
      });
    } else {
      this.authService.user$.subscribe({
        next: (result: User) => {
          this.touristPosition = { touristId: result.id, longitude: longLat[0], latitude: longLat[1] }

          this.service.addTouristPosition(this.touristPosition).subscribe({
            next: (result: TouristPosition) => {
            }
          });
        }
      });
    }
  }
}
