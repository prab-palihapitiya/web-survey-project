const DefaultQuestionnaire = {
    "name": "Default Questionnaire",
    "logic": [],
    "answers": [],
    "questions": [
        {
            "id": 1,
            "options": [
                {
                    "name": "Red",
                    "index": 1,
                    "resource": null,
                    "subQuestion": "None"
                },
                {
                    "name": "Blue",
                    "index": 2,
                    "resource": null,
                    "subQuestion": "None"
                },
                {
                    "name": "Green",
                    "index": 3,
                    "resource": null,
                    "subQuestion": "None"
                },
                {
                    "name": "Other (please specify)",
                    "index": 4,
                    "resource": null,
                    "subQuestion": "Enabled"
                }
            ],
            "shortcut": "Q1",
            "skippable": false,
            "introduction": "<p>What is your favorite color?</p>",
            "questionType": "Single Choice List"
        },
        {
            "id": 2,
            "options": [
                {
                    "name": "Reading",
                    "index": 1,
                    "resource": null,
                    "exclusive": "No",
                    "subQuestion": "None"
                },
                {
                    "name": "Watching movies",
                    "index": 2,
                    "resource": null,
                    "exclusive": "No",
                    "subQuestion": "None"
                },
                {
                    "name": "Playing video games",
                    "index": 3,
                    "resource": null,
                    "exclusive": "No",
                    "subQuestion": "None"
                },
                {
                    "name": "Listening to music",
                    "index": 4,
                    "resource": null,
                    "exclusive": "No",
                    "subQuestion": "None"
                },
                {
                    "name": "Spending time with friends and family",
                    "index": 5,
                    "resource": null,
                    "exclusive": "No",
                    "subQuestion": "None"
                },
                {
                    "name": "Other (please specify)",
                    "index": 6,
                    "resource": null,
                    "exclusive": "No",
                    "subQuestion": "Enabled"
                }
            ],
            "shortcut": "Q2",
            "skippable": false,
            "introduction": "<p>Which of the following activities do you enjoy in your free time? (Select all that apply)</p>",
            "questionType": "Multiple Choice List"
        },
        {
            "id": 3,
            "config": {
                "placeholder": "Type here..."
            },
            "shortcut": "Q3",
            "skippable": false,
            "introduction": "<p>What is your favorite book?</p>",
            "questionType": "Text Input"
        },
        {
            "id": 4,
            "shortcut": "Q4",
            "skippable": false,
            "introduction": "<p>What is your overall impression of the book?</p>",
            "questionType": "Text Area"
        },
        {
            "id": 5,
            "shortcut": "Q5",
            "skippable": false,
            "introduction": "<p>How many books do you typically read in a year?</p>",
            "questionType": "Numeric Input"
        }
    ]
}

export default DefaultQuestionnaire;