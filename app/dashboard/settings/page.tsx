'use client';
import { Button, Container, Grid, GridCol, Group, rem, Tabs } from "@mantine/core";
import { IconUsersGroup } from "@tabler/icons-react";
import classes from "@/app/ui/dashboard/settings/settings.module.css";
import { useDisclosure } from "@mantine/hooks";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";

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

    useEffectAfterMount(() => {
    }, [opened]);
    return (
        <Container className={classes.container}>
            <Tabs variant="pills" radius={0} defaultValue="user groups" style={{ fontSize: 'var(--mantine-font-size-xs)' }}>
                <Tabs.List className={classes.top_bar}>
                    <Tabs.Tab value="user groups" leftSection={<IconUsersGroup style={iconStyle} />} style={tabStyle}>
                        User Groups
                    </Tabs.Tab>
                </Tabs.List>
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
                        <Button size='xs' variant="gradient">Save</Button>
                        <Button size='xs' color="dark">Close</Button>
                    </Group>
                </GridCol>
            </Grid>
        </Container >
    );
}
