import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MarketplaceService } from "../../marketplace/marketplace.service";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { MyClubJoinRequest } from "../../marketplace/model/my-club-join-request.model";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import {
    faDoorOpen,
    faCheck,
    faEnvelope,
    faPen,
    faTrash,
    faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { ClubMember } from "../../marketplace/model/club-member.model";
import { Club } from "../../marketplace/model/club.model";
import { animate, style, transition, trigger } from "@angular/animations";
import { NotifierService } from "angular-notifier";

@Component({
    selector: "xp-club-card",
    templateUrl: "./club-card.component.html",
    styleUrls: ["./club-card.component.css"],
    animations: [
        trigger("fadeIn", [
            transition(":enter", [
                style({ opacity: 0, transform: "translateX(-40px)" }),
                animate(
                    "0.5s ease",
                    style({ opacity: 1, transform: "translateX(0)" }),
                ),
            ]),
        ]),
    ],
})
export class ClubCardComponent {
    @Output() editClubClicked = new EventEmitter<Club>();
    @Output() deleteClubClicked = new EventEmitter<Club>();
    user: User;
    @Input() club: any;
    @Input() showButtons: boolean = true;
    myClubJoinRequests: MyClubJoinRequest[] = [];
    members: ClubMember[] = [];
    faDoorOpen = faDoorOpen;
    faCheck = faCheck;
    faEnvelope = faEnvelope;
    faPen = faPen;
    faTrash = faTrash;
    faHouse = faHouse;

    constructor(
        private service: MarketplaceService,
        private authService: AuthService,
        private notifier: NotifierService
    ) {}

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
        });
        this.getClubJoinRequests();
        this.getMembers();
    }

    onImageError(event: Event) {
        const target = event.target as HTMLImageElement;
        if (target) {
            target.src =
                "https://imgs.search.brave.com/udmDGOGRJTYO6lmJ0ADA03YoW4CdO6jPKGzXWvx1XRI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAyLzY4LzU1LzYw/LzM2MF9GXzI2ODU1/NjAxMl9jMVdCYUtG/TjVyalJ4UjJleVYz/M3puSzRxblllS1pq/bS5qcGc";
        }
    }

    getClubJoinRequests(): void {
        this.service.getMyClubJoinRequests().subscribe({
            next: (result: PagedResults<MyClubJoinRequest>) => {
                this.myClubJoinRequests = result.results;
            },
            error: errData => {
                console.log(errData);
            },
        });
    }

    getMembers(): void {
        this.service.getClubMembers(this.club.id).subscribe({
            next: (result: PagedResults<ClubMember>) => {
                this.members = result.results;
            },
            error: errData => {
                console.log(errData);
            },
        });
    }

    canSendJoinRequest(): boolean {
        return !this.myClubJoinRequests.some(
            joinRequest =>
                joinRequest.status === "Pending" &&
                joinRequest.clubId == this.club.id,
        );
    }

    isMember(): boolean {
        return (
            this.members.some(member => member.userId === this.user.id) &&
            this.club.ownerId !== this.user.id
        );
    }

    isMine(): boolean {
        return this.club.ownerId == this.user.id;
    }

    sendJoinRequest(): void {
        this.service.sendClubJoinRequest(this.user.id, this.club.id).subscribe({
            next: () => {
                this.getClubJoinRequests();
                this.notifier.notify('success', 'Successfuly sent a join request.');
            },
            error: errData => {
                console.log(errData);
            },
        });
    }

    updateClub(club: Club): void {
        this.editClubClicked.emit(club);
    }
    deleteClub(club: Club): void {
        this.deleteClubClicked.emit(club);
    }
}
