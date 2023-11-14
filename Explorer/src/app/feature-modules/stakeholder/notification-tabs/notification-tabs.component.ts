import { Component } from "@angular/core";
import { faMapMarker, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

enum Tab {
    KEYPOINTS,
    FACILITIES,
    PROBLEMRESOLVINGS,
}
@Component({
    selector: "xp-notification-tabs",
    templateUrl: "./notification-tabs.component.html",
    styleUrls: ["./notification-tabs.component.css"],
})
export class NotificationTabsComponent {
    //icons
    faMapMarker = faMapMarker;
    faBuilding = faBuilding;
    faTriangleExclamation = faTriangleExclamation;

    Tab = Tab;
    selectedTab: Tab = Tab.KEYPOINTS;

    constructor() {
        this.selectedTab = Tab.KEYPOINTS;
    }

    setActiveTab(tab: Tab, el: HTMLElement): void {
        this.selectedTab = tab;
        setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 1);
    }
}
