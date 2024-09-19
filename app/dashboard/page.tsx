'use client';

import { Badge, Button, Container, Grid, GridCol, Group, Loader, rem, Table } from "@mantine/core";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { deleteQuestionnaire, fetchQuestionnairesByUser } from "@/app/lib/services/questionnaire-service";
import DateTime from "@/app/ui/utils/datetime";
import classes from "@/app/ui/dashboard/dashboard.module.css";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import { Questionnaire, Status } from "@/app/lib/types";
import { IconTrash } from "@tabler/icons-react";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);

  useEffectAfterMount(() => {
    const userId = "clzyfzfg300002y2l8a7du5lf"; // TODO: Replace with how you get the actual user ID

    setIsLoading(true);
    fetchQuestionnairesByUser(userId)
      .then((response) => {
        if (response && response.data) {
          setQuestionnaires(response.data as Questionnaire[]);
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

  const memoizedTableRows = useMemo(() => {
    return questionnaires.map(({ id, name, status, createdAt, modifiedAt }) => (
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
  }, [handleDelete, questionnaires]);

  return (
    <Container className={classes.container}>
      <Grid>
        <GridCol span={12}>
          <p>Welcome to the dashboard</p>
        </GridCol>

        <GridCol span={4}>
          <Link href="/dashboard/questionnaire">
            <Button variant="gradient">+ New Questionnaire</Button>
          </Link>
        </GridCol>

        <GridCol span={12}>
          <p>Recent Questionnaires</p>

          {isLoading ? (
            <div className={classes.loading_wrapper}>
              <Loader size={30} />
            </div>
          ) : (
            <Table
              highlightOnHover
              withTableBorder
              withColumnBorders>
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

        </GridCol>
      </Grid>
    </Container >
  );
}
