import { Component } from '@angular/core';
import { FrequentlyAskedQuestions } from '../model/frequently-asked-questions.model';
import {
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xp-frequently-asked-questions',
  templateUrl: './frequently-asked-questions.component.html',
  styleUrls: ['./frequently-asked-questions.component.css']
})
export class FrequentlyAskedQuestionsComponent {
  faq: FrequentlyAskedQuestions = new FrequentlyAskedQuestions();
  faChevronDown = faChevronDown;
  
  toggleAnswerExpansion(question: any) {
    question.isExpanded = !question.isExpanded;
  }
}
