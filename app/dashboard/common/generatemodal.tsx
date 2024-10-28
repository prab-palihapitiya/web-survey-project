import { generateQuestionnaire } from "@/app/lib/services/questionnaire-service";
import { useDisclosure } from "@mantine/hooks";
import { useRef, useState } from "react";
import { Button, Grid, GridCol, Group, TextInput, Text, Space, Modal, Collapse, Textarea, Select, Divider } from "@mantine/core";
import classes from "@/app/ui/dashboard/dashboard.module.css";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const AIGenerateModel = () => {
    const [opened, { toggle }] = useDisclosure(false);
    const [showModal, setShowModal] = useState(false);

    const topicInputRef = useRef<HTMLInputElement>(null);
    const promptInputRef = useRef<HTMLTextAreaElement>(null);

    const topics = [
        {
            group: 'General Interest & Everyday Life',
            items: [
                'Travel Habits',
                'Social Media Usage',
                'Work-Life Balance',
                'Food Preferences and Habits',
                'Entertainment Consumption'
            ]
        },
        {
            group: 'Technology & The Future',
            items: [
                'Artificial Intelligence',
                'Smart Home Technology',
                'Electric Vehicles',
                'Virtual and Augmented Reality',
                'Cryptocurrency and Blockchain'
            ]
        },
        {
            group: 'Business & Marketing',
            items: [
                'Customer Satisfaction',
                'Brand Awareness',
                'Market Research',
                'Employee Engagement',
                'Product Feedback'
            ]
        },
        {
            group: 'Social & Community Issues',
            items: [
                'Environmental Concerns',
                'Education Reform',
                'Healthcare Access',
                'Community Safety',
                'Political Engagement'
            ]
        },
    ];

    const handleGenerate = (prompt: string) => {
        generateQuestionnaire(prompt).then((response: { data: string; }) => {
            console.log(JSON.parse(response.data));
        }).catch((error: Error) => {
            console.error("Error generating questionnaire:", error);
        });
    }

    const handlePromptGenerate = (prompt: string) => {
        // Handle advanced prompt
    }

    return (
        <Modal opened={showModal}
            onClose={() => setShowModal(false)}
            title="Generate with AI"
            centered
            closeOnClickOutside={false}
            size={'xl'}
            transitionProps={{ transition: 'fade', duration: 200 }}
            classNames={{
                header: classes.modal_header
            }}
        >
            <Grid>
                {!opened && (
                    <>
                        <GridCol>
                            <Space h={'sm'} />
                            <TextInput placeholder="e.g., Climate change" label="Topic" ref={topicInputRef} />
                        </GridCol>
                        <GridCol>
                            <Divider variant="dashed" label="OR" labelPosition="center" mt={8} />
                        </GridCol>
                        <GridCol>
                            <Select
                                data={topics}
                                placeholder="Select a topic"
                                label="Topic"
                                ref={topicInputRef}
                                classNames={{
                                    dropdown: classes.select_dropdown,
                                    groupLabel: classes.select_group_label,
                                }}
                                clearable
                            />
                        </GridCol>
                        <GridCol>
                            <Group justify="space-between">
                                <Button onClick={() => handleGenerate(topicInputRef.current?.value || '')} variant={'gradient'}>Generate</Button>
                                <Button variant={'light'} onClick={toggle} pr={6}>
                                    Advanced Options <IconChevronRight size={14} />
                                </Button>
                            </Group>
                        </GridCol>
                    </>)}
                <Collapse in={opened}>
                    <GridCol>
                        <Space h={'sm'} />
                        <Textarea
                            label="Advanced Prompt"
                            description={
                                <Text size="xs">
                                    {"Provide specific instructions for AI. For example:"} <Text c={'blue'}>{"'Write 10 survey questions about usage of web survey tools, including multiple-choice, single-choice, open-ended, numerical, ranking and grid question types.'"}</Text>
                                </Text>
                            }
                            placeholder="Enter your detailed instructions here"
                            rows={5}
                            ref={promptInputRef}
                        />
                    </GridCol>
                    <GridCol>
                        <Group justify="space-between">
                            <Button variant={'light'} onClick={toggle} pl={6}><IconChevronLeft size={14} />Back</Button>
                            <Button onClick={() => handlePromptGenerate(promptInputRef.current?.value || '')} variant={'gradient'}>Generate</Button>
                        </Group>
                    </GridCol>
                </Collapse>
            </Grid>
        </Modal>
    )
}

export default AIGenerateModel;