import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "xp-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"],
})
export class HomeComponent {
    tourSearchInput: string = "";

    constructor(private router: Router) {}

    searchTours() {
        this.router.navigate(['/tour-search'], { queryParams: { tourName: this.tourSearchInput ? this.tourSearchInput : null } });
    }

    faSearch = faSearch;
}
