import { Component } from '@angular/core';
import { faComputer } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'xp-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent{
  faComputer = faComputer;
  faGithub = faGithub;
  faLinkedin = faLinkedin;
  image: string = "https://thumbs.dreamstime.com/b/generic-person-gray-photo-placeholder-man-silhouette-white-background-144511705.jpg";
  developers: any = [
    { name: "Ivan Partalo", job: "CEO & Full stack developer", image:  "assets/images/Kurbanov.jpg", linkedIn: "https://www.linkedin.com/", gitHub: "https://github.com/IvanPartalo"},
    { name: "Anja Dučić", job: "Full stack developer", image: "assets/images/Anja.jpg", linkedIn: "https://www.linkedin.com/", gitHub: "https://github.com/anjaducic"},
    { name: "Nina Kuzminac", job: "Full stack developer", image: "assets/images/Nina.jpg", linkedIn: "https://www.linkedin.com/", gitHub: "https://github.com/kuzminacc"},
    { name: "Marko Nikolić", job: "Full stack developer", image:  "assets/images/Marko.jpg", linkedIn: "https://www.linkedin.com/in/markonikolic01/", gitHub: "https://github.com/marko-nikolic01"},
    { name: "Uroš Nikolovski", job: "Full stack developer", image:  "assets/images/Uros.jpg", linkedIn: "https://www.linkedin.com/in/uros-nikolovski/", gitHub: "https://github.com/ukinolo"},
    { name: "Veljko Nikolić", job: "Full stack developer", image:  "assets/images/Veljko.jpg", linkedIn: "https://www.linkedin.com/in/veljko-nikolic/", gitHub: "https://github.com/Veljko121"},
    { name: "Dragoslav Maslać", job: "Full stack developer", image:  "assets/images/Gagi.jpg", linkedIn: "https://www.linkedin.com/", gitHub: "https://github.com/gagi155"},
    { name: "Miloš Milutinović", job: "Full stack developer", image:  "assets/images/Milos.jpg", linkedIn: "https://www.linkedin.com/in/milos-milutinovic-9aa5b8259/", gitHub: "https://github.com/MilosMilutinovic01"},
    { name: "Vukašin Dokmanović", job: "Full stack developer", image:  "assets/images/Dokma.jpg", linkedIn: "https://www.linkedin.com/", gitHub: "https://github.com/dokma11"},
    { name: "Ivana Kovačević", job: "Full stack developer", image:  "assets/images/Ivana.jpg", linkedIn: "https://www.linkedin.com/", gitHub: "https://github.com/ivanakovacevic01"},
    { name: "Jelena Kovač", job: "Full stack developer", image:  "assets/images/Jelena.jpg", linkedIn: "https://www.linkedin.com/", gitHub: "https://github.com/jelenaakovacc"},
    { name: "Marko Čekerinac", job: "Full stack developer", image:  "assets/images/Ceki.jpg", linkedIn: "https://www.linkedin.com/", gitHub: "https://github.com/cekki0"},
    { name: "Filip Simić", job: "Full stack developer", image:  "assets/images/Sima.jpg", linkedIn: "https://www.linkedin.com/", gitHub: "https://github.com/fsimic346"},
    { name: "Velimir Milinković", job: "Full stack developer", image:  "assets/images/Velimir.jpg", linkedIn: "https://www.linkedin.com/", gitHub: "https://github.com/mvelimir"},
    { name: "Marko Krstić", job: "Full stack developer", image:  "assets/images/Krle.jpg", linkedIn: "https://www.linkedin.com/", gitHub: "https://github.com/markok4"},
    { name: "Boško Kulušić", job: "Full stack developer", image:  "assets/images/Bosko.jpg", linkedIn: "https://www.linkedin.com/in/boskokulusic/", gitHub: "https://github.com/boskokul"}
  ];

  constructor(
    public dialogRef: MatDialog,
  ) {}

  openSocials(social: string): void {
    window.open(social, '_blank');
  }

  showContact(): void {
    this.dialogRef.open(ContactComponent);
  }
}
