import { Component } from '@angular/core';
import { 
  faPhone, 
  faEnvelope
 } from '@fortawesome/free-solid-svg-icons';
 import { 
  faFacebookF,
  faXTwitter,
  faInstagram,
  faTiktok,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'xp-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faFacebookF = faFacebookF;
  faXTwitter = faXTwitter;
  faInstagram = faInstagram;
  faTiktok = faTiktok;
  faYoutube = faYoutube;

  openTranslate(): void {
    window.open('http://localhost:4200/translate', '_blank');
  }
}
