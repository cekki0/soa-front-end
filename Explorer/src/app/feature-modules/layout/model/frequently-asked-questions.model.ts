export class FrequentlyAskedQuestions{
    faq: any;

    constructor() {
        this.faq  = [
            {
                title: 'Title1',
                questions: [
                    { question: 'Question1?', answer: 'Answer1', isExpanded: false},
                    { question: 'Question2?', answer: 'Answer2', isExpanded: false},
                    { question: 'Question3?', answer: 'Answer3', isExpanded: false}
                ]
            },
            {
                title: 'Title2',
                questions: [
                    { question: 'Question4?', answer: 'Answer4', isExpanded: false},
                    { question: 'Question5?', answer: 'Answer5', isExpanded: false},
                    { question: 'Question6?', answer: 'Answer6', isExpanded: false}
                ]
            },
            {
                title: 'Title3',
                questions: [
                    { question: 'Question7?', answer: 'Answer4', isExpanded: false},
                    { question: 'Question8?', answer: 'Answer5', isExpanded: false},
                    { question: 'Question9?', answer: 'Answer6', isExpanded: false}
                ]
            },
            {
                title: 'Title4',
                questions: [
                    { question: 'Question10?', answer: 'Answer4', isExpanded: false},
                    { question: 'Question11?', answer: 'Answer5', isExpanded: false},
                    { question: 'Question12?', answer: 'Answer6', isExpanded: false}
                ]
            }
        ];
    }
}