'use client';

import { ActionIcon, Badge, Button, Card, Center, Container, Flex, Grid, GridCol, Group, Loader, rem, SegmentedControl, Table, TableScrollContainer, TextInput, Text, Space, Indicator, Stack, Pagination, UnstyledButton, Menu, FileButton, Modal, Collapse, Textarea, Select, Divider, LoadingOverlay } from "@mantine/core";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { createEmptyQuestionnaire, deleteQuestionnaire, fetchQuestionnairesByUser, findQuestionsByFilter, generateQuestionnaire } from "@/app/lib/services/questionnaire-service";
import DateTime from "@/app/ui/common/datetime";
import classes from "@/app/ui/dashboard/dashboard.module.css";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import { Question, Questionnaire, Status } from "@/app/lib/types";
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconCopyPlus, IconDots, IconExternalLink, IconEye, IconLayoutGrid, IconList, IconPencil, IconSearch, IconSelector, IconSettings, IconShare3, IconTrash, IconUser, IconUsersGroup, IconX } from "@tabler/icons-react";
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { useRouter } from "next/navigation";
import useDashboardStore from "@/app/lib/state/dashboard-store";
import mammoth from "mammoth";
import { Dropzone, DropzoneProps } from '@mantine/dropzone';
import { useDisclosure } from "@mantine/hooks";
import QuestionnaireService from "@/app/lib/utils/questionnaire";
import { PromptTopics } from "@/app/lib/config/prompt-config";

export default function Page() {
  const setNavLinkIndex = useDashboardStore((state) => state.setNavLinkIndex);
  setNavLinkIndex(0);

  const [isLoading, setIsLoading] = useState(true);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [filteredQuestionnaires, setFilteredQuestionnaires] = useState<Questionnaire[]>([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [activePage, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Adjust as needed
  const [sortBy, setSortBy] = useState<keyof Questionnaire | null>('modifiedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showGenModal, setShowGenModal] = useState(false);
  const [showRevModal, setShowRevModal] = useState(false);
  const [genQuestionnaire, setGenQuestionnaire] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);

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

  const handleCreate = () => {
    createEmptyQuestionnaire().then((newQuestionnaireId) => {
      setQuestionnaireId(newQuestionnaireId);
      setQuestionnaire({ name: 'Untitled Questionnaire', questions: [] });
      router.push(`/dashboard/questionnaire?id=${newQuestionnaireId}`);
    });
  };

  const AIGenerateModel = () => {
    const [opened, { toggle }] = useDisclosure(false);
    const [generating, setGenerating] = useState(false);

    const topicInputRef = useRef<HTMLInputElement>(null);
    const promptInputRef = useRef<HTMLTextAreaElement>(null);

    const handleGenerate = (prompt: string) => {
      setGenerating(true);
      generateQuestionnaire(prompt, 'topic').then((response) => {
        const generatedData = JSON.parse(response?.data);
        const questionnaire = QuestionnaireService.ConvertToQuestionnaire(generatedData);
        setQuestionnaire(questionnaire);
        setGenQuestionnaire(questionnaire);
      }).catch((error: Error) => {
        console.error("Error generating questionnaire:", error);
      }).finally(() => {
        router.push(`/dashboard/questionnaire`);
        setGenerating(false);
        setShowGenModal(false);
      });
    }

    const handlePromptGenerate = (prompt: string) => {
      setGenerating(true);
      generateQuestionnaire(prompt, 'text').then((response) => {
        const generatedData = JSON.parse(response?.data);
        const questionnaire = QuestionnaireService.ConvertToQuestionnaire(generatedData);
        setQuestionnaire(questionnaire);
        setGenQuestionnaire(questionnaire);
      }).catch((error: Error) => {
        console.error("Error generating questionnaire:", error);
      }).finally(() => {
        router.push(`/dashboard/questionnaire`);
        setGenerating(false);
        setShowGenModal(false);
      });
    }

    return (
      <Modal opened={showGenModal}
        onClose={() => setShowGenModal(false)}
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
                <TextInput placeholder="e.g., Climate change" label="Topic" ref={topicInputRef} data-autofocus />
              </GridCol>
              <GridCol pb={0}>
                <Divider variant="dashed" label="OR" labelPosition="center" />
              </GridCol>
              <GridCol>
                <Select
                  data={PromptTopics}
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
                  <Button loading={generating} loaderProps={{ type: 'dots' }} onClick={() => handleGenerate(topicInputRef.current?.value || '')} variant={'gradient'}>Generate</Button>
                  <Button color="dark" onClick={toggle} pr={6}>
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
                    {"Provide specific instructions for AI. For example:"} <Text c={'blue'}>{"Write 10 survey questions about usage of web survey tools, including multiple-choice, single-choice, open-ended, numerical, ranking and grid question types."}</Text>
                  </Text>
                }
                placeholder="Enter your detailed instructions here"
                rows={5}
                ref={promptInputRef}
                data-autofocus
              />
            </GridCol>
            <GridCol>
              <Group justify="space-between">
                <Button color="dark" onClick={toggle} pl={6}><IconChevronLeft size={14} />Back</Button>
                <Button loading={generating} loaderProps={{ type: 'dots' }} onClick={() => handlePromptGenerate(promptInputRef.current?.value || '')} variant={'gradient'}>Generate</Button>
              </Group>
            </GridCol>
          </Collapse>
        </Grid>
      </Modal>
    )
  }

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
  }, [router]);

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
    if (value === 'grid') {
      setItemsPerPage(18);
    } else {
      setItemsPerPage(10);
    }
    setViewMode(value);
  };

  const QuestionnaireMenu = ({ id }: { id: string }) => {
    return (
      <Menu withArrow arrowPosition="side">
        <Menu.Target>
          <UnstyledButton>
            <IconDots size={16} className={classes.menu_icon} />
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
        <Table.Td>
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
        <Table.Td className={classes.table_cell}>{status === Status.NEW ? '-' : 0}</Table.Td>
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
          <Center h={'6rem'} style={{
            textAlign: 'center'
          }}>
            <Text size="xs" fw={500} className={classes.questionnaire_text}>{name}</Text>
            <Group gap={4} className={classes.hidden_buttons}>
              <Button size="xs" color="gray" variant="filled" onClick={() => { }}>Preview<IconExternalLink size={16} style={{ marginInlineStart: '0.3rem' }} /></Button>
              <Button size="xs" color="gray" onClick={() => { }}>Open</Button>
            </Group>
          </Center>
          <ActionIcon
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
          </ActionIcon>
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
        }} stroke={2} />
      ) : <IconSelector style={{ marginLeft: '5px' }} stroke={2} />
    )
  }

  const handleFileChange = (file: File | null) => {
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImporting(true);
        const arrayBuffer = reader.result as ArrayBuffer;
        mammoth.convertToHtml({ arrayBuffer })
          .then(result => {
            const html = result.value;
            const importedData = extractTextFromHtml(html);
            findQuestionsByFilter(importedData).then((response) => {
              const generatedData = JSON.parse(response?.data);
              const questionnaire = QuestionnaireService.ConvertToQuestionnaire(generatedData);
              setQuestionnaire(questionnaire);
              setGenQuestionnaire(questionnaire);
            }).catch((error: Error) => {
              console.error("Error finding questions by filter:", error);
            }).finally(() => {
              router.push(`/dashboard/questionnaire`);
              setImporting(false);
            });
          })
          .catch(error => {
            console.error("Error converting docx to HTML:", error);
            // Handle the error (e.g., show an error message to the user)
          }).finally(() => {
            console.log("Questionnaire imported successfully.");
          });
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Handle invalid file type (e.g., show an error message to the user)
      console.error("Invalid file type. Please upload a .docx file.");
    }
  };

  // Function to extract questions from the HTML (you'll need to implement this)
  const extractTextFromHtml = (html: string): any[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const questions = Array.from(doc.querySelectorAll('p')).map(p => p.textContent || '');
    return questions;
  };

  return (
    <Container className={classes.container}>
      <AIGenerateModel />
      <div className={classes.top_bar}>
        <Button
          variant="gradient"
          onClick={() => setShowRevModal(true)}
        >
          Review
        </Button>
      </div>
      <Grid>
        <GridCol>
          <Group>
            <Card
              shadow="sm"
              className={classes.new_questionnaire}
              onClick={handleCreate}>
              <Center h={'6rem'}>
                <Stack
                  gap="xs"
                  style={{
                    textAlign: 'center'
                  }}>
                  <Text size="xs" fw={500}>NEW QUESTIONNAIRE</Text>
                  <Text className={classes.hidden_buttons} size="xs" fw={500}>Create a questionnaire from the scratch.</Text>
                </Stack>
              </Center>
            </Card>
            <Dropzone
              className={classes.import_questionnaire}
              component={Card}
              loading={importing}
              loaderProps={{ type: 'dots', color: 'blue' }}
              onDrop={(files) => {
                handleFileChange(files[0]);
              }}
            >
              <Center h={'4.5rem'} w={'12rem'}>
                <Stack
                  gap="xs"
                  style={{
                    textAlign: 'center'
                  }}
                >
                  <Text size="xs" fw={500}>IMPORT QUESTIONNAIRE</Text>
                  <Text className={classes.hidden_buttons} size="xs" fw={500}>Upload a PDF or DOCX to extract questions.</Text>
                </Stack>
              </Center>
            </Dropzone>
            <Card
              shadow="sm"
              className={classes.new_questionnaire}
              onClick={() => setShowGenModal(true)}
            >
              <Center h={'6rem'}>
                <Stack
                  gap="xs"
                  style={{
                    textAlign: 'center'
                  }}
                >
                  <Text size="xs" fw={500}>AI GENERATE</Text>
                  <Text className={classes.hidden_buttons} size="xs" fw={500}>Create a questionnaire using AI.</Text>
                </Stack>
              </Center>
            </Card>
          </Group>
        </GridCol>
        <GridCol mt={20}>
          {isLoading ? (
            <div className={classes.loading_wrapper}>
              <Loader type="dots" size={'lg'} />
            </div>
          ) : (
            <TableScrollContainer minWidth={rem(300)}>
              <Flex mb={20} justify={'space-between'}>
                <Group justify="flex-start">
                  <TextInput
                    variant="unstyled"
                    placeholder="Search Questionnaire"
                    leftSection={<IconSearch style={{ width: rem(16), height: rem(16), color: 'var(--mantine-color-blue-filled)' }} />}
                    value={search}
                    onChange={handleSearchChange}
                    miw={rem(250)}
                  />
                </Group>
                <Group justify="flex-end">
                  <SegmentedControl
                    size={'sm'}
                    data={['All', 'New', 'Draft', 'Published']}
                    classNames={{
                      root: classes.segmented_control,
                      label: classes.segmented_control_label,
                    }}
                  />
                  <SegmentedControl
                    size={'sm'}
                    data={['All', 'Created', 'Assigned']}
                    classNames={{
                      root: classes.segmented_control,
                      label: classes.segmented_control_label,
                    }} />
                  <SegmentedControl
                    size={'sm'}
                    data={[{
                      value: 'list',
                      label: (<Center><IconList size={18} /></Center>),
                    },
                    {
                      value: 'grid',
                      label: (<Center><IconLayoutGrid size={18} /></Center>),
                    }]}
                    value={viewMode}
                    onChange={handleViewModeChange}
                    classNames={{
                      root: classes.segmented_control,
                      label: classes.segmented_control_label,
                    }}
                  />
                </Group>
              </Flex>

              {viewMode === 'grid' ? (
                <Group>
                  {memoizedGridItems}
                </Group>
              ) : (
                <Table
                  withRowBorders={false}
                  verticalSpacing="xs"
                  style={{
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                    borderRadius: rem(4),
                    width: '99.6%',
                    leftMargin: 'auto',
                  }}>
                  <Table.Thead className={classes.thead}>
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
                      <Table.Th>Responses</Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {memoizedTableRows}
                  </Table.Tbody>
                </Table>
              )}
              <Flex justify="end" mt="lg">
                <Pagination
                  size={'xs'}
                  value={activePage}
                  onChange={setPage}
                  total={Math.ceil(filteredQuestionnaires.length / itemsPerPage)}
                  classNames={{
                    control: classes.pagination_control
                  }}
                />
              </Flex>
            </TableScrollContainer>
          )}
        </GridCol>
      </Grid>
    </Container>
  );
}