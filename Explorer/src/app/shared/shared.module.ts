import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';
import { TourCardViewComponent } from './tour-card-view/tour-card-view.component';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [MapComponent, TourCardViewComponent],
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  exports: [MapComponent, TourCardViewComponent],
})
export class SharedModule {}
