import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service'
import { KeyPoint } from 'src/app/feature-modules/tour-authoring/model/key-point.model';
import { Observable, Subscription } from 'rxjs';
import { PagedResults } from '../model/paged-results.model';
import { Facilities } from 'src/app/feature-modules/tour-authoring/model/facilities.model';

@Component({
  selector: 'xp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit, OnChanges {
  private map: any;
  public waypointMap = new Map<number, any>();
  private routeControl: L.Routing.Control;
  private refreshEventsSubscription: Subscription;
  private previousCommitted = false;

  private positionMarker: L.Marker;
  private markerGroup = L.layerGroup(); 
  
  public facilitiesUsed: boolean = false;

  private positionMarker: L.Marker;

  public tourDistance: number = 0;
  
  @Input() refreshEvents: Observable<number>;
  @Input() selectedKeyPoint: KeyPoint | null;
  @Input() canEdit = false;
  @Input() isKeyPointMap = false;
  @Input() isPositionMap = false;
  @Input() set startPosition(value: any) {
    if (!value) return;
    this.positionMarker = L.marker([value.latitude, value.longitude], { icon: this.positionIcon }).addTo(this.map)
  }
  @Output() newLongLatEvent = new EventEmitter<[number, number]>();

  constructor(private mapService: MapService) { }

  private facilityIcon = L.icon({
    iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png',
    iconSize: [42, 42], 
    iconAnchor: [16, 32], 
  });

  private positionIcon = L.icon({
    iconUrl: 'https://images.emojiterra.com/google/android-pie/512px/1f535.png',
    iconSize: [30, 30], 
    iconAnchor: [15, 15], 
  });

  ngOnInit() {
    if (!this.isKeyPointMap) return;
    this.refreshEventsSubscription = this.refreshEvents.subscribe(tourId => this.getTourKeyPoints(tourId));
  }

  ngOnDestroy() {
    if (!this.isKeyPointMap) return;
    this.refreshEventsSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://icon-library.com/images/map-marker-icon/map-marker-icon-18.jpg',
      iconSize: [46, 46], 
      iconAnchor: [26, 46],
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    setTimeout(() => {
      this.initMap();
    }, 5);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isKeyPointMap) return;

    if (this.waypointMap.delete(Number.POSITIVE_INFINITY)) {
      let waypoints = [...this.waypointMap.values()];
      this.setRoute(waypoints);
    }

    if (!this.canEdit) this.previousCommitted = true;
    if (this.selectedKeyPoint) {
      this.panMapTo(this.selectedKeyPoint.latitude, this.selectedKeyPoint.longitude)
    }

    if (this.canEdit) {
      if (!this.previousCommitted) {
        let oldKeyPoint = changes['selectedKeyPoint'].previousValue;

        if (oldKeyPoint && oldKeyPoint.id != undefined) {
          let lng = oldKeyPoint.longitude
          let lat = oldKeyPoint.latitude
          this.waypointMap.set(oldKeyPoint.id, { lng, lat });
        }

        let waypoints = [...this.waypointMap.values()];
        this.setRoute(waypoints);
      }

      this.previousCommitted = false;
    }
  }

  private panMapTo(lat: number, lng: number): void {
    setTimeout(() => {
      this.map.invalidateSize();
      this.map.panTo(new L.LatLng(lat, lng));
    }, 100);
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [45.2396, 19.8227],
      zoom: 13,
    });
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
    this.registerOnClick();

    if (this.isKeyPointMap) {
      this.mapService.getAuthorsFacilities().subscribe({
        next: (result: PagedResults<Facilities>) => {
          let facilities = result.results;

          for(let f of facilities) {
            this.setMarkersForAllFacilities(f.latitude, f.longitude);
          }
        },
        error: () => {
        }
      });
    }
  }

  search(): void {
    this.mapService.search('Strazilovska 19, Novi Sad').subscribe({
      next: (result) => {
        console.log(result);
        L.marker([result[0].lat, result[0].lon])
          .addTo(this.map)
          .bindPopup('Pozdrav iz Strazilovske 19.')
          .openPopup();
      },
      error: () => { },
    });
  }

  setRoute(waypoints: any): void {
    const planOptions = { addWaypoints: false, draggableWaypoints: false };
    const plan = new L.Routing.Plan(waypoints, planOptions);

    this.routeControl?.remove();

    this.routeControl = L.Routing.control({
      plan,
      router: L.routing.mapbox(
        'pk.eyJ1IjoiY2Vrc29uIiwiYSI6ImNsbnl2YTAwdzAxNnoya2xxcG8wMm56ZjAifQ.23pAV3nrCN0BBo-1F8j8gg',
        { profile: 'mapbox/walking' }
      ),
    }).addTo(this.map);

    this.routeControl.on('routesfound', (e) => {
      const routes = e.routes;
      if (routes.length > 0) {
        const summary = routes[0].summary;
        this.tourDistance = summary.totalDistance/1000; // Total distance is in meters, tourDistance in km
      }
    });
  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      if (!this.canEdit) return;

      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;

      this.newLongLatEvent.emit([lng, lat]);

      this.mapService.reverseSearch(lat, lng).subscribe((res) => {
        console.log(res.display_name);
      });

      if(this.facilitiesUsed){
        this.markerGroup.clearLayers();
        const marker = new L.Marker([lat, lng], { icon: this.facilityIcon });
        this.markerGroup.addLayer(marker);
        this.map.addLayer(this.markerGroup);

        return;
      }

      if (this.isPositionMap) {
        if (this.positionMarker) {
          this.positionMarker.remove();
        }
        this.positionMarker = L.marker([lat, lng], { icon: this.positionIcon }).addTo(this.map)
        return;
      }

      console.log(
        'You clicked the map at latitude: ' + lat + ' and longitude: ' + lng
      );

      if (this.selectedKeyPoint && this.selectedKeyPoint.id != undefined) {
        this.waypointMap.set(this.selectedKeyPoint.id, { lng, lat });
      } else {
        this.waypointMap.set(Number.POSITIVE_INFINITY, { lng, lat });
      }
      let waypoints = [...this.waypointMap.values()];
      this.setRoute(waypoints);
    });
  }

  // ovo prima Id ture na kojoj se trenutno nalazimo (kupi sa fronta)
  getTourKeyPoints(tourId: number): void {
    this.mapService.getTourKeyPoints(tourId).subscribe({
      next: (result: any) => {
        this.waypointMap.clear();

        let keyPoints = result;

        for (const kp of keyPoints) {
          let lng = kp.longitude;
          let lat = kp.latitude;
          this.waypointMap.set(kp.id, { lng, lat });
        }

        this.createWaypoints(keyPoints);
        let waypoints = [...this.waypointMap.values()];

        this.setRoute(waypoints);

        if (keyPoints.length > 0) {
          this.panMapTo(keyPoints[0].latitude, keyPoints[0].longitude);
        }
      },
      error: () => {
        console.log('Cannot fetch keypoints for tourId:', tourId);
      },
    });
  }

  createWaypoints(keyPoints: any): void {
    for (const kp of keyPoints) {
      let lng = kp.longitude;
      let lat = kp.latitude;
      this.waypointMap.set(kp.id, { lng, lat });
    }
  }

  getClickCoordinates(callback: (lat: number, lng: number) => void): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;

      callback(lat, lng);
    });
  }

  setMarker(lat: number, lng: number): void{
    // Clear all previous markers on the map
    this.markerGroup.clearLayers();

    const marker = new L.Marker([lat, lng], { icon: this.facilityIcon });
    this.markerGroup.addLayer(marker);
    this.map.addLayer(this.markerGroup);

    this.map.setView([lat, lng], this.map.getZoom());
  }

  setMarkersForAllFacilities(lat: number, lng: number): void{
    const marker = new L.Marker([lat, lng], { icon: this.facilityIcon });
    this.markerGroup.addLayer(marker);
    this.map.addLayer(this.markerGroup);

    if (!this.isKeyPointMap) this.map.setView([lat, lng], this.map.getZoom());
  }
}
