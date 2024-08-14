'use client';

import { Button, CloseButton, Divider, FileInput, Select, Table, TextInput } from "@mantine/core";
import { useState } from "react";

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
                    <Table.Th>Index</Table.Th>
                    <Table.Th width={650}>Name</Table.Th>
                    <Table.Th>Resource</Table.Th>
                    <Table.Th>SubQuestion</Table.Th>
                    <Table.Th></Table.Th>
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
                            <Table.Td><CloseButton /></Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            <Table.Tfoot>
                <Table.Tr>
                    <Button onClick={handleAddRow}>+</Button>
                </Table.Tr> 
            </Table.Tfoot>
        </Table>
        </>
    )
}
