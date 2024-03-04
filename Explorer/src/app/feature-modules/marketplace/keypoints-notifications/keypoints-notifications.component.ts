import { Component } from "@angular/core";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { KeyPointNotification } from "../model/keypoint-notification";
import { MarketplaceService } from "../marketplace.service";
import { StakeholderService } from "../../stakeholder/stakeholder.service";

@Component({
    selector: "xp-keypoints-notifications",
    templateUrl: "./keypoints-notifications.component.html",
    styleUrls: ["./keypoints-notifications.component.css"],
})
export class KeypointsNotificationsComponent {
    keyPointNotifications: KeyPointNotification[] = [];
    constructor(
        private service: MarketplaceService,
        private stakeholderService: StakeholderService,
    ) {}
    ngOnInit(): void {
        this.getByAuthorId();
    }
    getByAuthorId(): void {
        this.service.getKeyPointNotificationsByAuthorId().subscribe({
            next: (result: PagedResults<KeyPointNotification>) => {
                this.keyPointNotifications = result.results;
                this.stakeholderService.setNotificationCount(
                    this.stakeholderService.notifications$.value,
                );
            },
        });
    }
}
