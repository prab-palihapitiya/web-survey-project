'use client';

import { Button, CloseButton, Divider, FileInput, Select, Table, TextInput } from "@mantine/core";
import { useState } from "react";
import classes from './questions.module.css'
import { IconPlus, IconX } from "@tabler/icons-react";

export default function Single() {
    const [rows, setRows] = useState([
        { index: 1, name: '', resource: null, subQuestion: 'None' } // Initial row
    ]);

    const handleAddRow = () => {
        setRows([...rows, { index: rows.length + 1, name: '', resource: null, subQuestion: 'None' }]);
    };
    
    return (
        <>
        <Divider my="xs" label="Put you choices here" labelPosition="left" />
        <Table highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th width={1}>Index</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Resource</Table.Th>
                    <Table.Th width={150}>SubQuestion</Table.Th>
                    <Table.Th width={1}></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                    {rows.map((row) => (
                        <Table.Tr key={row.index}>
                            <Table.Td>{row.index}</Table.Td>
                            <Table.Td>
                                <TextInput
                                    variant="unstyled"
                                    placeholder="Type here"
                                    value={row.name}
                                    onChange={(event) =>
                                        setRows(rows.map(r => 
                                            r.index === row.index ? { ...r, name: event.target.value } : r
                                        ))
                                    }
                                />
                            </Table.Td>
                            <Table.Td>
                                <FileInput 
                                    clearable 
                                    placeholder="Upload" 
                                    value={row.resource}
                                    onChange={(file) => 
                                        setRows(rows.map(r => 
                                            r.index === row.index ? { ...r, resource: file } : r
                                        ))
                                    }
                                />
                            </Table.Td>
                            <Table.Td>
                                <Select
                                    data={['None', 'Enabled']}
                                    value={row.subQuestion}
                                    onChange={(value) => 
                                        setRows(rows.map(r => 
                                            r.index === row.index ? { ...r, subQuestion: value } : r
                                        ))
                                    }
                                /> 
                            </Table.Td>
                            <Table.Td><CloseButton icon={<IconX color='red' size={16}/>} variant="subtle"/></Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            <Table.Tfoot className={classes.table_foot}>
                <Button onClick={handleAddRow} m={4} color="black"><IconPlus size={16}/></Button>
            </Table.Tfoot>
        </Table>
        </>
    )
}
