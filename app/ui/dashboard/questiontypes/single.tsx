"use client";

import { useEffect, useState } from "react";

import {
  ActionIcon,
  Divider,
  FileInput,
  rem,
  Select,
  Table,
  TextInput
} from "@mantine/core";
import { IconGripVertical, IconPlus, IconX } from "@tabler/icons-react";

import classes from "./questions.module.css";
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

export default function Single(questionData: { id: string; options: any[] }) {
  const [rows, setRows] = useState(questionData.options || [
    { index: 1, name: "Option 1", resource: null, subQuestion: "None" }
  ]);

  const updateQuestionData = useQuestionnaireStore((state) => state.updateQuestionData);

  useEffect(() => {
    updateQuestionData(questionData.id, { options: rows });
  }, [rows, questionData.id, updateQuestionData]);

  const handleAddRow = () => {
    const newIndex = Math.max(...rows.map(row => row.index), 0) + 1; // Find the highest existing index (or 0 if no rows) and add 1
    setRows([
      ...rows,
      { index: newIndex, name: `Option ${newIndex}`, resource: null, subQuestion: "None" }
    ]);
  };

  const handleDeleteRow = (rowIndex: number) => {
    setRows(prevRows => {
      const updatedRows = prevRows.filter(row => row.index !== rowIndex);
      return updatedRows.map((row, index) => ({ ...row, index: index + 1 })); // Re-normalize indices
    });
  };

  const onDragEnd = ({ destination, source }) => {
    if (!destination) return;

    const items = Array.from(rows);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    const updatedRows = items.map((row, index) => ({ ...row, index: index + 1 }));
    setRows(updatedRows);
  };

  const items = rows.map((row, index) => (
    <Draggable key={row.index} index={index} draggableId={row.index.toString()}>
      {(provided) => (
        <Table.Tr key={row.index} ref={provided.innerRef} {...provided.draggableProps} className={classes.item}>
          <Table.Td className={classes.dragHandle_td}>
            <div className={classes.dragHandle} {...provided.dragHandleProps}>
              <IconGripVertical size={16} />
            </div>
          </Table.Td>
          <Table.Td style={{ textAlign: "center" }}>{index + 1}</Table.Td>
          <Table.Td>
            <TextInput
              variant="unstyled"
              placeholder="Type here"
              value={row.name}
              onChange={(event) =>
                setRows(
                  rows.map((r) =>
                    r.index === row.index
                      ? { ...r, name: event.target.value }
                      : r
                  )
                )
              }
            />
          </Table.Td>
          <Table.Td>
            <FileInput
              clearable
              placeholder="Upload"
              value={row.resource}
              onChange={(file) =>
                setRows(
                  rows.map((r) =>
                    r.index === row.index ? { ...r, resource: file } : r
                  )
                )
              }
            />
          </Table.Td>
          <Table.Td>
            <Select
              data={["None", "Enabled"]}
              value={row.subQuestion}
              onChange={(value) =>
                setRows(
                  rows.map((r) =>
                    r.index === row.index ? { ...r, subQuestion: value } : r
                  )
                )
              }
            />
          </Table.Td>
          <Table.Td>
            <ActionIcon
              color="red"
              variant="subtle"
              onClick={() => handleDeleteRow(row.index)}
            >
              <IconX size={16} />
            </ActionIcon>
          </Table.Td>
        </Table.Tr>
      )}
    </Draggable>
  ));

  return (
    <>
      <Divider
        my="xs"
        label="Put your choices here"
        labelPosition="left"
      />
      <DragDropContext
        onDragEnd={onDragEnd}
      >
        <Table
          highlightOnHover
          withTableBorder
          withColumnBorders
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: rem(1) }}></Table.Th>
              <Table.Th style={{ width: rem(1) }}>Index</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Resource</Table.Th>
              <Table.Th style={{ width: rem(150) }}>SubQuestion</Table.Th>
              <Table.Th style={{ width: rem(1) }}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Droppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
              <Table.Tbody {...provided.droppableProps} ref={provided.innerRef}>
                {items}
                {provided.placeholder}
              </Table.Tbody>
            )}
          </Droppable>
          <Table.Tfoot className={classes.table_foot}>
            <ActionIcon
              onClick={handleAddRow}
              m={4}
              variant="subtle"
            >
              <IconPlus size={16} />
            </ActionIcon>
          </Table.Tfoot>
        </Table>
      </DragDropContext>
    </>
  );
}