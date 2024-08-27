'use client';

import { Button, Container, Grid, GridCol, Group, Table } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchQuestionnairesByUser } from "@/app/lib/services/questionnaire-service";
import DateTime from "../ui/utils/datetime";
import classes from "@/app/ui/dashboard/dashboard.module.css";

export default function Page() {
  const [questionnaires, setQuestionnaires] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = "clzyfzfg300002y2l8a7du5lf"; // TODO: Replace with how you get the actual user ID
        const response = await fetchQuestionnairesByUser(userId);
        if (response && response.data) {
          setQuestionnaires(response.data);
        } else {
          console.error("No data received from the API.");
        }
      } catch (error) {
        console.error(error);
        // TODO: Handle error, e.g., show an error message
      }
    };

    fetchData();
  }, []);
  return (<>
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
              {questionnaires.map((questionnaire) => (
                <Table.Tr key={questionnaire.id}>
                  <Table.Td>{questionnaire.name}</Table.Td>
                  <Table.Td>{questionnaire.status}</Table.Td>
                  <Table.Td>
                    <DateTime datetime={questionnaire.createdAt} />
                  </Table.Td>
                  <Table.Td>
                    <DateTime datetime={questionnaire.modifiedAt} />
                  </Table.Td>
                  <Table.Td>You</Table.Td>
                  <Table.Td align="center">
                    <Group gap={'xs'}>
                      <Link href={`/dashboard/questionnaire/?id=${questionnaire.id}`}>
                        <Button size="xs">Edit</Button>
                      </Link>
                      <Button size="xs" color="red">Delete</Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </GridCol>
      </Grid>
    </Container >
  </>);
}
