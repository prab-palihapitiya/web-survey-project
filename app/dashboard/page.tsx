'use client';

import { ActionIcon, Badge, Button, Card, Center, Container, Flex, Grid, GridCol, Group, Loader, rem, SegmentedControl, Table, TableScrollContainer, TextInput, Text, Space, Indicator, Stack } from "@mantine/core";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { deleteQuestionnaire, fetchQuestionnairesByUser } from "@/app/lib/services/questionnaire-service";
import DateTime from "@/app/ui/utils/datetime";
import classes from "@/app/ui/dashboard/dashboard.module.css";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import { Questionnaire, Status } from "@/app/lib/types";
import { IconExternalLink, IconLayoutGrid, IconList, IconSearch, IconTrash, IconX } from "@tabler/icons-react";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [filteredQuestionnaires, setFilteredQuestionnaires] = useState<Questionnaire[]>([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list');

  useEffectAfterMount(() => {
    const userId = "clzyfzfg300002y2l8a7du5lf"; // TODO: Replace with how you get the actual user ID

    setIsLoading(true);
    fetchQuestionnairesByUser(userId)
      .then((response) => {
        if (response && response.data) {
          setQuestionnaires(response.data as Questionnaire[]);
          setFilteredQuestionnaires(response.data as Questionnaire[]); // Initialize filtered list
        } else {
          console.error("No data received from the API.");
        }
      })
      .catch((error: Error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleDelete = useCallback((questionnaireId: string) => {
    //TODO: Delete confirmation
    deleteQuestionnaire(questionnaireId)
      .then((response) => {
        console.log("Questionnaire deleted successfully:", response);
        setQuestionnaires((prevQuestionnaires) =>
          prevQuestionnaires.filter((q) => q.id !== questionnaireId)
        );
        setFilteredQuestionnaires((prevQuestionnaires) =>
          prevQuestionnaires.filter((q) => q.id !== questionnaireId)
        );
      })
      .catch((error: Error) => {
        console.error("Error deleting questionnaire:", error);
      });
  }, []);

  const setColorStatus = (status: Status) => {
    switch (status) {
      case Status.NEW:
        return 'gray';
      case Status.DRAFT:
        return 'red';
      case Status.PUBLISHED:
        return 'green';
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearch(searchTerm);

    const filtered = questionnaires.filter((questionnaire) =>
      questionnaire.name.toLowerCase().includes(searchTerm)
    );
    setFilteredQuestionnaires(filtered);
  };

  const handleViewModeChange = (value: string) => {
    setViewMode(value);
  };

  const memoizedTableRows = useMemo(() => {
    return filteredQuestionnaires.map(({ id, name, status, createdAt, modifiedAt }) => (
      <Table.Tr key={id}>
        <Table.Td>
          <Link href={`/dashboard/questionnaire/?id=${id}`} style={{ color: 'var(--mantine-color-blue-7)', textDecoration: 'none' }}>
            {name}
          </Link>
        </Table.Td>
        <Table.Td><Badge size="xs" color={setColorStatus(status)}>{status}</Badge></Table.Td>
        <Table.Td>
          <DateTime datetime={createdAt} />
        </Table.Td>
        <Table.Td>
          <DateTime datetime={modifiedAt} />
        </Table.Td>
        <Table.Td>You</Table.Td>
        <Table.Td align="center">
          <Group gap={0}>
            <Button size="xs" color="red" variant="subtle" onClick={() => handleDelete(id)}><IconTrash size={16} /></Button>
          </Group>
        </Table.Td>
      </Table.Tr>
    ));
  }, [handleDelete, filteredQuestionnaires]);

  const memoizedGridItems = useMemo(() => {
    return filteredQuestionnaires.map(({ id, name, status, createdAt, modifiedAt }) => (
      // <GridCol key={id} span={4}>
      //   <div className={classes.grid_item}>
      //     <Link href={`/dashboard/questionnaire/?id=${id}`} style={{ color: 'var(--mantine-color-blue-7)', textDecoration: 'none' }}>
      //       <h3>{name}</h3>
      //     </Link>
      //     <Badge size="xs" color={setColorStatus(status)}>{status}</Badge>
      //     <div>
      //       <p>Created: <DateTime datetime={createdAt} /></p>
      //       <p>Modified: <DateTime datetime={modifiedAt} /></p>
      //     </div>
      //     <Group position="right">
      //       <Button size="xs" color="red" variant="subtle" onClick={() => handleDelete(id)}><IconTrash size={16} /></Button>
      //     </Group>
      //   </div>
      // </GridCol>

      <Indicator
        key={id}
        position="top-left"
        size={'xs'}
        label={<Badge size="xs" color={setColorStatus(status)}>{status}</Badge>}
        radius={0}
        color={setColorStatus(status)}
      >
        <Card shadow="sm" style={{
          position: 'relative'
        }} className={classes.questionnaire}>
          <Center h={'6rem'}>
            <Text size="xs" fw={500} className={classes.questionnaire_text}>{name}</Text>
            <Group gap={4} className={classes.hidden_buttons}>
              <Button size="xs" color="dark" variant="filled" onClick={() => {
                console.log('preview the built in survey with the selected template as a model');
              }}
              >Preview<IconExternalLink size={16} style={{ marginInlineStart: '0.3rem' }} /></Button>
              <Button size="xs" variant="outline" onClick={() => { }}>Open</Button>
            </Group>
          </Center>
          {<ActionIcon
            size="md"
            color="dark"
            variant="subtle"
            onClick={() => {
              // onDelete();
            }}
            style={{
              position: 'absolute',
              top: 0,
              right: 0
            }}
            className={classes.hidden_buttons}
          >
            <IconX size={16} />
          </ActionIcon>}
        </Card>
      </Indicator>
    ));
  }, [filteredQuestionnaires]);

  return (
    <Container className={classes.container}>
      <Grid>
        <GridCol>
          <p>Welcome to the dashboard</p>
        </GridCol>
        <GridCol>
          <Card
            shadow="sm"
            className={classes.new_questionnaire}
            onClick={() => {
              console.log('Create a new questionnaire');
            }}
          >
            <Center h={'5rem'}>
              {/* <Link href="/dashboard/questionnaire"> */}
              <Text size="xs" fw={500}>+ New Questionnaire</Text>
              {/* </Link> */}
            </Center>
          </Card>
        </GridCol>
        <GridCol>
          <p>Recent Questionnaires</p>
        </GridCol>
        <GridCol>
          {isLoading ? (
            <div className={classes.loading_wrapper}>
              <Loader size={30} />
            </div>
          ) : (
            <TableScrollContainer minWidth={rem(300)} >
              {/* <Flex justify={"space-between"} mb={'md'}> */}
              <Group gap={8} mb={20}>
                <SegmentedControl size={'xs'} data={[{
                  value: 'list',
                  label: (<Center><IconList size={18} /></Center>),
                },
                {
                  value: 'grid',
                  label: (<Center><IconLayoutGrid size={18} /></Center>),
                }
                ]}
                  value={viewMode}
                  onChange={handleViewModeChange}
                  radius={0}
                />
                <SegmentedControl size={'xs'} data={['All', 'New', 'Draft', 'Published']} radius={0} />
                <SegmentedControl size={'xs'} data={['All', 'Created', 'Assigned']} radius={0} />
                <TextInput
                  placeholder="Search Questionnaire"
                  leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} />}
                  value={search}
                  onChange={handleSearchChange}
                  miw={rem(250)}
                />

              </Group>
              {/* </Flex> */}

              {viewMode === 'grid' ? (
                <Group>
                  {memoizedGridItems}
                </Group>
              ) : (
                <Table verticalSpacing="xs" style={{
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                }}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Questionnaire Name</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Created At</Table.Th>
                      <Table.Th>Last Modified</Table.Th>
                      <Table.Th>Last Modified By</Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {memoizedTableRows}
                  </Table.Tbody>
                </Table>
              )}
            </TableScrollContainer>
          )}
        </GridCol>
      </Grid>
    </Container>
  );
}