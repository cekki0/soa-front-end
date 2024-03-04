import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { MarketplaceService } from "../marketplace.service";
import { Club } from "../model/club.model";
import { ClubMember } from "../model/club-member.model";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { MyClubJoinRequest } from "../model/my-club-join-request.model";
import {
    faDoorOpen,
    faCheck,
    faEnvelope,
    faCirclePlus,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ClubMembersManagementComponent } from "../club-members-management/club-members-management.component";
import { ClubJoinRequest } from "../model/club-join-request.model copy";
import { ClubMembersInviteFormComponent } from "../club-members-invite-form/club-members-invite-form.component";
import { Blog } from "../../blog/model/blog.model";
import { NotifierService } from "angular-notifier";

@Component({
    selector: "xp-club-page",
    templateUrl: "./club-page.component.html",
    styleUrls: ["./club-page.component.css"],
})
export class ClubPageComponent {
    user: User;
    blogs: Blog[] = [];
    clubId: number = -1;
    club: Club;
    members: ClubMember[] = [];
    isUserMember: boolean = false;
    myClubJoinRequests: MyClubJoinRequest[] = [];
    clubJoinRequests: ClubJoinRequest[] = [];
    faDoorOpen = faDoorOpen;
    faCheck = faCheck;
    faEnvelope = faEnvelope;
    faCirclePlus = faCirclePlus;
    faXmark = faXmark;

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private marketplaceService: MarketplaceService,
        private router: Router,
        private dialog: MatDialog,
        private notifier: NotifierService
    ) {}

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
        });
        this.route.params.subscribe(params => {
            this.clubId = params["clubId"];
        });
        this.getClub();
        this.getMembers();
        this.getJoinRequests();
    }

    getClub(): void {
        this.marketplaceService.getClubById(this.clubId).subscribe({
            next: (result: Club) => {
                this.club = result;
            },
        });
    }

    getJoinRequests(): void {
        this.marketplaceService
            .getClubJoinRequestsByClub(this.clubId)
            .subscribe({
                next: (result: PagedResults<ClubJoinRequest>) => {
                    this.clubJoinRequests = result.results.filter(
                        cjr => cjr.status == "Pending",
                    );
                },
            });
    }

    getMembers(): void {
        this.marketplaceService.getClubMembers(this.clubId).subscribe({
            next: (result: PagedResults<ClubMember>) => {
                this.members = result.results;
                for (let member of this.members) {
                    member.kicked = false;
                }
                this.isUserMember = this.isMember();
                this.getClubJoinRequests();
                this.getJoinRequests();
            },
            error: errData => {
                console.log(errData);
            },
        });
    }

    getOwner(): any {
        const owner = this.members.find(
            member => member.userId === this.club.ownerId,
        );
        return owner;
    }

    getMemberCount(): number {
        const members = this.members.filter(member => !member.kicked);
        return members.length;
    }

    getRegularMembers(): any {
        const members = this.members.filter(
            member => member.userId !== this.club.ownerId,
        );
        return members;
    }

    isOwner(): boolean {
        return this.user.id == this.getOwner().userId;
    }

    isMember(): boolean {
        return (
            this.members.some(member => member.userId === this.user.id) ||
            this.club.ownerId == this.user.id
        );
    }
    getBlogs() {
        this.marketplaceService.getClubBlogs(this.clubId).subscribe({
            next: (result: Blog[]) => {
                this.blogs = result;
            },
            error: () => {},
        });
    }
    createBlog(){
        this.router.navigate(["/blog-form", 0, this.clubId]);
    }
    getClubJoinRequests(): void {
        this.marketplaceService.getMyClubJoinRequests().subscribe({
            next: (result: PagedResults<MyClubJoinRequest>) => {
                this.myClubJoinRequests = result.results;
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
    sendJoinRequest(): void {
        this.marketplaceService
            .sendClubJoinRequest(this.user.id, this.club.id!)
            .subscribe({
                next: () => {
                    this.getClubJoinRequests();
                },
                error: errData => {
                    console.log(errData);
                },
            });
    }
    onImageError(event: Event) {
        const target = event.target as HTMLImageElement;
        if (target) {
            target.src =
                "https://imgs.search.brave.com/udmDGOGRJTYO6lmJ0ADA03YoW4CdO6jPKGzXWvx1XRI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAyLzY4LzU1LzYw/LzM2MF9GXzI2ODU1/NjAxMl9jMVdCYUtG/TjVyalJ4UjJleVYz/M3puSzRxblllS1pq/bS5qcGc";
        }
    }

    openInviteDialog(): void {
        const dialogRef = this.dialog.open(ClubMembersInviteFormComponent, {
            data: {
                clubId: this.clubId,
            },
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log("Dialog result:", result);
        });
    }

    respondJoinRequest(id: number, response: boolean): void {
        this.marketplaceService.respondClubJoinRequest(id, response).subscribe({
            next: () => {
                this.getClub();
                this.getMembers();
                this.getJoinRequests();
                const notificationType = response ? 'success' : 'error';
                const notification = response ? 'Successfuly added a new club member.' : 'Club join request rejected.';
                this.notifier.notify(notificationType, notification);
            },
            error: errData => {
                console.log(errData);
            },
        });
    }

    isRegularMember(): boolean {
        const isMember = this.members.some(
            member => member.userId == this.user.id,
        );
        return isMember && !this.isOwner();
    }

    leave(): void {
        const membership = this.members.find(
            member => member.userId == this.user.id,
        );
        if (!membership) return;
        this.marketplaceService.kickMember(membership.membershipId).subscribe({
            next: () => {
                this.router.navigate(["/clubs"]);
                this.notifier.notify('error', 'Successfuly left the club.');
            },
        });
    }
    
}
