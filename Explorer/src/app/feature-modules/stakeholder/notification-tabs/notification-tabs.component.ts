import { Component, OnInit } from "@angular/core";
import {
    faMapMarker,
    faBuilding,
    faTriangleExclamation,
    faSearch,
    faShoppingCart,
    faMoneyBill,
    faCoins,
    faUsers,
    faPercentage,
} from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { User } from "src/app/infrastructure/auth/model/user.model";

enum Tab {
    KEYPOINTS,
    FACILITIES,
    PROBLEMRESOLVINGS,
    SHOPPINGNOTIFICATIONS,
    TRANSACTIONRECORDSNOTIFICATIONS,
    PAYMENTSHISTORY,
    CLUBS,
    WISHLISTNOTIFICATION,
}
@Component({
    selector: "xp-notification-tabs",
    templateUrl: "./notification-tabs.component.html",
    styleUrls: ["./notification-tabs.component.css"],
})
export class NotificationTabsComponent implements OnInit {
    Tab = Tab;
    selectedTab: Tab = Tab.KEYPOINTS;
    user: User;

    constructor(private authService: AuthService) {
        this.selectedTab = Tab.KEYPOINTS;
    }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
        });
    }

    setActiveTab(tab: Tab, el: HTMLElement): void {
        this.selectedTab = tab;
    }

    //icons
    faMapMarker = faMapMarker;
    faBuilding = faBuilding;
    faTriangleExclamation = faTriangleExclamation;
    faSearch = faSearch;
    faShoppingCart = faShoppingCart;
    faMoneyBill = faMoneyBill;
    faCoins = faCoins;
    faUsers = faUsers;
    faPercentage = faPercentage;
}
