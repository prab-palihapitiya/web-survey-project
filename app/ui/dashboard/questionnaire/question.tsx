import { Grid, GridCol, Select, Textarea, TextInput, Checkbox, Stack } from '@mantine/core';
import { useState } from 'react';
import Single from '@/app/ui/dashboard/questiontypes/single';
import Text from '@/app/ui/dashboard/questiontypes/text';
import Numeric from '@/app/ui/dashboard/questiontypes/numeric';
import { QuestionType } from '@/app/lib/types';

export default function Question({questionData}) {
    console.log(questionData);
    
    const [selectedQType, setSelectedQType] = useState<string | null>();

    const handleTypeChange = (value: QuestionType | null) => {
        setSelectedQType(value);
    }

    const typeToComponent: { [key in QuestionType]?: React.ComponentType } = {
        'Text': Text,
        'Numeric': Numeric,
        'Single Choice': Single,
        'Multiple Choice': Text,
        'Date Time': Text, 
        'Ranking': Text
      };

    const QuestionComponent = selectedQType ? typeToComponent[selectedQType] : null;    
    return (
        <Grid>
            <GridCol span={6}>
                <Stack>
                    <Select
                        label="Question Type"
                        placeholder="Select"
                        data={['Text', 'Numeric', 'Single Choice', 'Multiple Choice', 'Date Time', 'Ranking']}
                        onChange={(_value) => handleTypeChange(_value)}
                        />

                    <Checkbox
                        label="Respondent can skip the question"
                        />                        
                </Stack>
            </GridCol>
            <GridCol>
                <TextInput
                    label="Shortcut"
                    description="You will use this name when defining question logic. Use CamelCase(e.x. MyQuestion1) or use the generated question shortcut."
                    placeholder="Give a name"
                    defaultValue={'Q1'}
                    />
            </GridCol> 
            <GridCol>
                <Textarea
                    label="Description"
                    placeholder="Type question intro here.."
                    autosize
                    minRows={2}
                    />
            </GridCol>
            <GridCol>
                {selectedQType && <QuestionComponent />}
            </GridCol>
        </Grid>
    )
}