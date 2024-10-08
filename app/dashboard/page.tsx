'use client';

import { ActionIcon, Badge, Button, Card, Center, Container, Flex, Grid, GridCol, Group, Loader, rem, SegmentedControl, Table, TableScrollContainer, TextInput, Text, Space, Indicator, Stack, Pagination, UnstyledButton, Menu } from "@mantine/core";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { createEmptyQuestionnaire, deleteQuestionnaire, fetchQuestionnairesByUser } from "@/app/lib/services/questionnaire-service";
import DateTime from "@/app/ui/common/datetime";
import classes from "@/app/ui/dashboard/dashboard.module.css";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import { Questionnaire, Status } from "@/app/lib/types";
import { IconChevronDown, IconCopyPlus, IconDots, IconExternalLink, IconEye, IconLayoutGrid, IconList, IconPencil, IconSearch, IconSelector, IconSettings, IconShare3, IconTrash, IconUser, IconUsersGroup, IconX } from "@tabler/icons-react";
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { useRouter } from "next/navigation";
import useDashboardStore from "@/app/lib/state/dashboard-store";

export default function Page() {
  const setNavLinkIndex = useDashboardStore((state) => state.setNavLinkIndex);
  setNavLinkIndex(0);

  const [isLoading, setIsLoading] = useState(true);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [filteredQuestionnaires, setFilteredQuestionnaires] = useState<Questionnaire[]>([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [activePage, setPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust as needed
  const [sortBy, setSortBy] = useState<keyof Questionnaire | null>('modifiedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const setQuestionnaireId = useQuestionnaireStore((state) => state.setId);
  const setQuestionnaire = useQuestionnaireStore((state) => state.setQuestionnaire);

  const router = useRouter();

  useEffectAfterMount(() => {
    const userId = "clzyfzfg300002y2l8a7du5lf"; // TODO: Replace with how you get the actual user ID

    setIsLoading(true);
    fetchQuestionnairesByUser(userId)
      .then((response) => {
        if (response && response.data) {
          setQuestionnaires(response.data as Questionnaire[]);
          setFilteredQuestionnaires(response.data as Questionnaire[]);
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

  const createQuestionnaire = () => {
    createEmptyQuestionnaire().then((newQuestionnaireId) => {
      setQuestionnaireId(newQuestionnaireId);
      setQuestionnaire({ name: 'Untitled Questionnaire', questions: [] });
      router.push(`/dashboard/questionnaire?id=${newQuestionnaireId}`);
    });
  };

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
        router.push('/dashboard');
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
    setPage(1); // Reset to the first page when searching
  };

  const handleViewModeChange = (value: string) => {
    setViewMode(value);
  };

  const QuestionnaireMenu = ({ id }: { id: string }) => {
    return (
      <Menu withArrow arrowPosition="side">
        <Menu.Target>
          <UnstyledButton>
            <IconDots size={16} />
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconPencil style={{ width: rem(14), height: rem(14) }} />}
          >
            Open
          </Menu.Item>

          <Menu.Item
            leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}
          >
            Preview
          </Menu.Item>

          <Menu.Item
            leftSection={<IconExternalLink style={{ width: rem(14), height: rem(14) }} />}
          >
            Open test link
          </Menu.Item>
          <Menu.Item
            leftSection={<IconShare3 style={{ width: rem(14), height: rem(14) }} />}
          >
            Share link
          </Menu.Item>
          <Menu.Item
            leftSection={<IconCopyPlus style={{ width: rem(14), height: rem(14) }} />}
          >
            Duplicate
          </Menu.Item>
          <Menu.Item
            leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}
          >
            Assign
          </Menu.Item>
          <Menu.Item
            leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
          >
            Settings
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            color="red"
            leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    )
  }

  // Memoized sorted questionnaires
  const sortedQuestionnaires = useMemo(() => {
    const sorted = [...filteredQuestionnaires];

    if (sortBy) {
      sorted.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
          } else {
            return 0;
          }
      });
    }

    return sorted;
  }, [filteredQuestionnaires, sortBy, sortOrder]);

  // Calculate indexes for pagination based on sorted questionnaires
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuestionnaires = sortedQuestionnaires.slice(startIndex, endIndex);

  const memoizedTableRows = useMemo(() => {
    return currentQuestionnaires.map(({ id, name, status, createdAt, modifiedAt }) => (
      <Table.Tr key={id} className={classes.table_row}>
        <Table.Td style={{
          // maxWidth: '120px',
          // overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--mantine-color-blue-filled)'
        }}>
          <Link href={`/dashboard/questionnaire/?id=${id}`} className={classes.link}>
            {name}
          </Link>
        </Table.Td>
        <Table.Td><Badge size="xs" color={setColorStatus(status)}>{status}</Badge></Table.Td>
        <Table.Td className={classes.table_cell}>
          <DateTime datetime={createdAt} />
        </Table.Td>
        <Table.Td className={classes.table_cell}>
          <DateTime datetime={modifiedAt} />
        </Table.Td>
        <Table.Td className={classes.table_cell}>You</Table.Td>
        <Table.Td align="center">
          <QuestionnaireMenu id={id} />
          {/* <Button size="xs" color="red" variant="subtle" onClick={() => handleDelete(id)}><IconTrash size={16} /></Button> */}
        </Table.Td>
      </Table.Tr>
    ));
  }, [currentQuestionnaires]);

  const memoizedGridItems = useMemo(() => {
    return currentQuestionnaires.map(({ id, name, status, createdAt, modifiedAt }) => (
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
              <Button size="xs" color="gray" variant="filled" onClick={() => { }}>Preview<IconExternalLink size={16} style={{ marginInlineStart: '0.3rem' }} /></Button>
              <Button size="xs" color="gray" onClick={() => { }}>Open</Button>
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
  }, [currentQuestionnaires]); // Use currentQuestionnaires here

  // Sorting function
  const handleSort = (field: keyof Questionnaire) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const Icon = ({ sorted }: { sorted: boolean }) => {
    return (
      sorted ? (
        <IconChevronDown size={14} style={{
          transition: 'transform 0.2s',
          transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none'
        }} stroke={1.5} />
      ) : <IconSelector style={{ marginLeft: '5px' }} stroke={1.5} />
    )
  }

  return (
    <Container className={classes.container}>
      <Grid>
        <GridCol>
          <Card
            shadow="sm"
            className={classes.new_questionnaire}
            onClick={() => {
              createQuestionnaire();
            }}
          >
            <Center h={'5rem'}>
              <Text size="xs" fw={500}>+ New Questionnaire</Text>
            </Center>
          </Card>
        </GridCol>
        <GridCol mt={20}>
          {isLoading ? (
            <div className={classes.loading_wrapper}>
              <Loader size={30} />
            </div>
          ) : (
            <TableScrollContainer minWidth={rem(300)}>
              <Group gap={8} mb={20}>
                <TextInput
                  placeholder="Search Questionnaire"
                  leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} />}
                  value={search}
                  onChange={handleSearchChange}
                  miw={rem(250)}
                />
                <SegmentedControl
                  size={'xs'}
                  data={[{
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
                  classNames={{
                    // root: classes.segmented_control,
                  }}
                />
                <SegmentedControl size={'xs'} data={['All', 'New', 'Draft', 'Published']} radius={0} />
                <SegmentedControl size={'xs'} data={['All', 'Created', 'Assigned']} radius={0} />
              </Group>

              {viewMode === 'grid' ? (
                <Group>
                  {memoizedGridItems}
                </Group>
              ) : (
                <Table
                  withRowBorders={false}
                  verticalSpacing="xs"
                  style={{
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                  }}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th className={classes.th}>
                        <UnstyledButton onClick={() => handleSort('name')} className={classes.control}>
                          <Group justify="space-between">
                            <Text fw={500} fz="xs">
                              Name
                            </Text>
                            <Center className={classes.icon}>
                              {<Icon sorted={sortBy === 'name'} />}
                            </Center>
                          </Group>
                        </UnstyledButton>
                      </Table.Th>

                      <Table.Th className={classes.th}>
                        <UnstyledButton onClick={() => handleSort('status')} className={classes.control}>
                          <Group justify="space-between">
                            <Text fw={500} fz="xs">
                              Status
                            </Text>
                            <Center className={classes.icon}>
                              {<Icon sorted={sortBy === 'status'} />}
                            </Center>
                          </Group>
                        </UnstyledButton>
                      </Table.Th>

                      <Table.Th className={classes.th}>
                        <UnstyledButton onClick={() => handleSort('createdAt')} className={classes.control}>
                          <Group justify="space-between">
                            <Text fw={500} fz="xs">
                              Created At
                            </Text>
                            <Center className={classes.icon}>
                              {<Icon sorted={sortBy === 'createdAt'} />}
                            </Center>
                          </Group>
                        </UnstyledButton>
                      </Table.Th>

                      <Table.Th className={classes.th}>
                        <UnstyledButton onClick={() => handleSort('modifiedAt')} className={classes.control}>
                          <Group justify="space-between">
                            <Text fw={500} fz="xs">
                              Last Modified
                            </Text>
                            <Center className={classes.icon}>
                              {<Icon sorted={sortBy === 'modifiedAt'} />}
                            </Center>
                          </Group>
                        </UnstyledButton>
                      </Table.Th>

                      <Table.Th className={classes.th}>
                        <UnstyledButton className={classes.control}>
                          <Group justify="space-between">
                            <Text fw={500} fz="xs">
                              Last Modified By
                            </Text>
                          </Group>
                        </UnstyledButton>
                      </Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {memoizedTableRows}
                  </Table.Tbody>
                </Table>
              )}
              <Flex justify="end" mt="md">
                <Pagination
                  size={'sm'}
                  value={activePage}
                  onChange={setPage}
                  total={Math.ceil(filteredQuestionnaires.length / itemsPerPage)}
                  radius={0}
                />
              </Flex>
            </TableScrollContainer>
          )}
        </GridCol>
      </Grid>
    </Container>
  );
}