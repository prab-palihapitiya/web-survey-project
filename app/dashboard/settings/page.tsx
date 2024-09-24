'use client';
import { Button, Card, Center, Container, Divider, Grid, GridCol, Group, rem, Tabs, Text } from "@mantine/core";
import { IconPhoto, IconUsersGroup } from "@tabler/icons-react";
import classes from "@/app/ui/dashboard/settings/settings.module.css";
import { useDisclosure } from "@mantine/hooks";
import TemplateCard from "./design/templatecard";
import TemplateForm from "./design/templateform";

export default function Page({
    searchParams
}: {
    searchParams?: {
        id?: string;
    };
}) {
    const [opened, { open, close }] = useDisclosure(false);

    const iconStyle = { width: rem(12), height: rem(12) };
    const tabStyle = { fontSize: 'var(--mantine-font-size-xs)', fontWeight: 500, defautProps: { color: 'dark' } };
    return (
        <Container className={classes.container}>
            <Tabs variant="pills" radius={0} defaultValue="design" style={{ fontSize: 'var(--mantine-font-size-xs)' }}>
                <Tabs.List className={classes.top_bar}>
                    <Tabs.Tab value="design" leftSection={<IconPhoto style={iconStyle} />} style={tabStyle}>
                        Design
                    </Tabs.Tab>
                    <Tabs.Tab value="user groups" leftSection={<IconUsersGroup style={iconStyle} />} style={tabStyle}>
                        User Groups
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="design">
                    {opened ? <TemplateForm onClose={close} /> : (
                        <>
                            <Group>
                                <Card
                                    shadow="xl"
                                    style={{
                                        backgroundColor: 'var(--mantine-color-blue-6)'
                                    }}
                                    className={classes.new_template}
                                    onClick={open}>
                                    <Center h={'5rem'}>
                                        <Text size="xs" fw={500} style={{ color: 'white' }}>+ New Template</Text>
                                    </Center>
                                </Card>
                            </Group>
                            <Divider
                                label="Built-in Templates"
                                labelPosition="left"
                                style={{
                                    margin: '1rem 0'
                                }}
                            />
                            <Group>
                                <TemplateCard templateName="Default Template" primaryColor="var(--mantine-color-green-7)" secondaryColor="var(--mantine-color-blue-6)" />
                                <TemplateCard templateName="Template 1" primaryColor="var(--mantine-color-orange-3)" secondaryColor="var(--mantine-color-red-6)" />
                            </Group>
                        </>
                    )}
                </Tabs.Panel>
                <Tabs.Panel value="user groups">
                    <Container style={{ paddingInline: '0px' }}>
                        <Grid>
                            <GridCol span={6}>
                                <h1>User Groups</h1>
                                <p>User Groups tab content</p>
                            </GridCol>
                        </Grid>
                    </Container>
                </Tabs.Panel>
            </Tabs>
            <Grid className={classes.bottom_bar}>
                <GridCol>
                    <Group gap={"xs"}>
                        <Button size='xs' variant="gradient" >Save Changes</Button>
                        <Button size='xs' variant="gradient" onClick={
                            () => {
                                if (opened) { close(); }
                            }
                        }>{opened ? 'Close Design' : 'Close Settings'}</Button>
                    </Group>
                </GridCol>
            </Grid>
        </Container >
    );
}
