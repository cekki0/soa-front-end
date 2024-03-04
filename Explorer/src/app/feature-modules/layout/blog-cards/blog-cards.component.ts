import { Component, OnInit } from "@angular/core";
import { LayoutService } from "../layout.services";
import { Blog } from "../../blog/model/blog.model";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { Vote } from "../../blog/model/vote.model";
import { BlogService } from "../../blog/blog.service";
import { trigger, transition, style, animate } from "@angular/animations";
import { AuthService } from "src/app/infrastructure/auth/auth.service";

@Component({
    selector: "xp-blog-cards",
    templateUrl: "./blog-cards.component.html",
    styleUrls: ["./blog-cards.component.css"],
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
export class BlogCardsComponent implements OnInit {
    currentIndex = 0;
    popularBlogs: Blog[];
    blogContainer: any;
    user: User;
    constructor(
        private service: LayoutService,
        private blogService: BlogService,
        private authService: AuthService,
    ) {}
    ngOnInit(): void {
        this.blogContainer = document.querySelector(".blog-container");
        this.service.getPopularBlogs().subscribe({
            next: (result: PagedResults<Blog>) => {
                this.popularBlogs = result.results
                    .filter(blog => blog.status === 4)
                    .slice(0, 3);
            },
        });
        this.authService.user$.subscribe(user => {
            this.user = user;
        });
    }
    getVote(blog: Blog): Vote | undefined {
        return blog.votes.find(x => x.userId == this.user?.id);
    }

    upVoteBlog(blogId: number): void {
        this.blogService.upVoteBlog(blogId).subscribe({
            next: (result: any) => {
                //unblock voting
            },
            error: () => {
                //undo front end vote
            },
        });
    }

    downVoteBlog(blogId: number): void {
        this.blogService.downVoteBlog(blogId).subscribe({
            next: (result: any) => {
                //unblock voting
            },
            error: () => {
                //undo front end vote
            },
        });
    }
}
