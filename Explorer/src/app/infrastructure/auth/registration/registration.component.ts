import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatDialogRef } from "@angular/material/dialog";
import { Registration } from "../model/registration.model";
import { AuthService } from "../auth.service";
import { faXmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { LoginComponent } from "src/app/infrastructure/auth/login/login.component";
import { NotifierService } from "angular-notifier";

@Component({
    selector: "xp-registration",
    templateUrl: "./registration.component.html",
    styleUrls: ["./registration.component.css"],
})
export class RegistrationComponent {
    isPasswordVisible: boolean;
    agreesWithTOSAndPP: boolean = false;

    constructor(
        private authService: AuthService,
        public dialog: MatDialogRef<RegistrationComponent>,
        public dialogRef: MatDialog,
        private notifier: NotifierService,
    ) {
        this.isPasswordVisible = false;
    }

    registrationForm = new FormGroup({
        name: new FormControl("", [Validators.required]),
        surname: new FormControl("", [Validators.required]),
        email: new FormControl("", [Validators.required]),
        username: new FormControl("", [Validators.required]),
        password: new FormControl("", [Validators.required]),
    });

    register(): void {
        const registration: Registration = {
            name: this.registrationForm.value.name || "",
            surname: this.registrationForm.value.surname || "",
            email: this.registrationForm.value.email || "",
            username: this.registrationForm.value.username || "",
            password: this.registrationForm.value.password || "",
        };

        if (this.registrationForm.valid) {
            if(!this.agreesWithTOSAndPP) {
                this.notifier.notify(
                    "error",
                    "You must agree to the terms of service and privacy policy before trying to register.",
                );
                return;
            }

            this.authService.register(registration).subscribe({
                next: () => {
                    this.notifier.notify(
                        "info",
                        "Please check your email to confirm your registration.",
                    );
                    this.onClose();
                },
            });
        } else {
            this.notifier.notify("error", "Invalid data");
        }
    }

    onClose(): void {
        this.dialog.close();
    }

    onLogin(): void {
        this.onClose();
        this.dialogRef.open(LoginComponent);
    }

    togglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    openTermsOfService(): void {
        window.open('http://localhost:4200/terms-of-service', '_blank');
    }

    openPrivacyPolicy(): void {
        window.open('http://localhost:4200/privacy-policy', '_blank');
    }

    handleCheckboxChange(event: Event) {
        this.agreesWithTOSAndPP = !this.agreesWithTOSAndPP;
      }

    faXmark = faXmark;
    faEye = faEye;
    faEyeSlash = faEyeSlash;
}
