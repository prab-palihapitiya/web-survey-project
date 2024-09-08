'use client';

import { Button, Container, Grid, GridCol, Group, Loader, Table } from "@mantine/core";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { deleteQuestionnaire, fetchQuestionnairesByUser } from "@/app/lib/services/questionnaire-service";
import DateTime from "@/app/ui/utils/datetime";
import classes from "@/app/ui/dashboard/dashboard.module.css";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import { Questionnaire } from "@/app/lib/types";

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

  const memoizedTableRows = useMemo(() => {
    return questionnaires.map(({ id, name, status, createdAt, modifiedAt }) => (
      <Table.Tr key={id}>
        <Table.Td>{name}</Table.Td>
        <Table.Td>{status}</Table.Td>
        <Table.Td>
          <DateTime datetime={createdAt} />
        </Table.Td>
        <Table.Td>
          <DateTime datetime={modifiedAt} />
        </Table.Td>
        <Table.Td>You</Table.Td>
        <Table.Td align="center">
          <Group gap={'xs'} justify="space-evenly">
            <Link href={`/dashboard/questionnaire/?id=${id}`}>
              <Button size="xs" variant="subtle">Edit</Button>
            </Link>
            <Button size="xs" color="red" variant="subtle" onClick={() => handleDelete(id)}>Delete</Button>
            <Button size="xs" color="purple" variant="subtle" onClick={() => { }}>Publish</Button>
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
            <Button>+ New Questionnaire</Button>
          </Link>
        </GridCol>

        <GridCol span={12}>
          <p>Recent questionnaires</p>

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
                  <Table.Th>Actions</Table.Th>
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
