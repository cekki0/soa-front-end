import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Bundle } from '../../tour-authoring/model/bundle.model';
import { MarketplaceService } from '../marketplace.service';
import {
  faSearch
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'xp-explore-bundles',
  templateUrl: './explore-bundles.component.html',
  styleUrls: ['./explore-bundles.component.css']
})
export class ExploreBundlesComponent implements OnInit {

  bundles: Bundle[] = [];
  displayBundles: Bundle[] = [];
  searchString: string = "";
  faSearch = faSearch;

  constructor(private service: MarketplaceService) {}

  ngOnInit(): void {
    this.getBundles();
  }

  getBundles(): void {
    this.service.getPublishedBundles().subscribe({
      next: (result: Bundle[]) => {
        this.bundles = result;
        this.displayBundles = result;
        console.log(this.bundles);
      }
    })
  }

  search(): void {
    const lowerSearch = this.searchString.toLowerCase();
    this.displayBundles = lowerSearch == "" ? this.bundles : this.bundles.filter(bundle => bundle.name.toLowerCase().includes(lowerSearch));
  }
}
