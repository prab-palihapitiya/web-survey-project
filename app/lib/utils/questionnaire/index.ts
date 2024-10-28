import { Option } from "../../types";

class QuestionnaireService {
    static ConvertToQuestionnaire = (data: any): any => {
        let questions: any[] = [];

        // data = [
        //     {
        //       "question": "What is your primary reason for using web survey tools?",
        //       "options": [
        //         "Market research",
        //         "Customer feedback",
        //         "Employee engagement",
        //         "Academic research",
        //         "Other"
        //       ],
        //       "questionType": "single-choice"
        //     },
        //     {
        //       "question": "How often do you use web survey tools?",
        //       "options": [
        //         "Daily",
        //         "Weekly",
        //         "Monthly",
        //         "Occasionally",
        //         "Rarely"
        //       ],
        //       "questionType": "single-choice"
        //     },
        //     {
        //       "question": "What are the key features you look for in a web survey tool?",
        //       "options": [],
        //       "questionType": "open-ended"
        //     },
        //     {
        //       "question": "On a scale of 1 to 5, with 1 being 'not at all satisfied' and 5 being 'extremely satisfied', how satisfied are you with your current web survey tool?",
        //       "options": [
        //         "1",
        //         "2",
        //         "3",
        //         "4",
        //         "5"
        //       ],
        //       "questionType": "numerical"
        //     },
        //     {
        //       "question": "Rank the following features in order of importance to you (1 being most important, 5 being least important):",
        //       "options": [
        //         "Ease of use",
        //         "Customization options",
        //         "Data analysis capabilities",
        //         "Integration with other tools",
        //         "Price"
        //       ],
        //       "questionType": "ranking"
        //     },
        //     {
        //       "question": "How likely are you to recommend your current web survey tool to others?",
        //       "options": [
        //         "Very likely",
        //         "Likely",
        //         "Neutral",
        //         "Unlikely",
        //         "Very unlikely"
        //       ],
        //       "questionType": "single-choice"
        //     },
        //     {
        //       "question": "What are the biggest challenges you face when using web survey tools?",
        //       "options": [],
        //       "questionType": "open-ended"
        //     },
        //     {
        //       "question": "What are your preferred methods for collecting survey data?",
        //       "options": [
        //         "Email",
        //         "Social media",
        //         "Website pop-ups",
        //         "QR codes",
        //         "Other"
        //       ],
        //       "questionType": "multiple-choice"
        //     },
        //     {
        //       "question": "How important is it for you to have access to real-time survey results?",
        //       "options": [
        //         "Very important",
        //         "Important",
        //         "Neutral",
        //         "Not important",
        //         "Not at all important"
        //       ],
        //       "questionType": "single-choice"
        //     },
        //     {
        //       "question": "Please rate the following aspects of your current web survey tool:",
        //       "options": [
        //         "Ease of use",
        //         "Data analysis capabilities",
        //         "Customer support",
        //         "Value for money"
        //       ],
        //       "questionType": "grid"
        //     }
        // ];

        for (const key in data) {
            const question = {
                id: (parseInt(key) + 1),
                shortcut: 'Q' + (parseInt(key) + 1),
                introduction: data[key].question,
                questionType: this.ConvertToQuestionType(data[key].questionType),
                options: this.ConvertToOptions(data[key].options)
            };
            questions = [...questions, question];
        }

        return {
            name: 'Untitled Questionnaire',
            questions,
        };
    };

    static ConvertToQuestionType = (type: string): string => {
        let questionType = '';
        let typeStr = type.toLowerCase();

        if (typeStr.includes('single') || typeStr.includes('radio') || typeStr.includes('scale')) {
            questionType = 'Single Choice List';
        } else if (typeStr.includes('multiple') || typeStr.includes('checkbox')) {
            questionType = 'Multiple Choice List';
        } else if (typeStr.includes('text') || typeStr.includes('open')) {
            questionType = 'Text Input';
        } else if (typeStr.includes('numeric') || typeStr.includes('number')) {
            questionType = 'Numeric Input';
        }
        return questionType;
    }

    static ConvertToOptions = (options: any[]): Option[] => {
        let optionsArray: Option[] = [];

        for (const key in options) {
            const option = {
                name: options[key] as string,
                index: (parseInt(key) + 1).toString()
            };
            optionsArray = [...optionsArray, option];
        }
        return optionsArray;
    }
}

export default QuestionnaireService;