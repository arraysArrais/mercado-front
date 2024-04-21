import { Box, Button, Container, Flex, Group, Input, NumberInput, Stack, Text, Title } from '@mantine/core';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import './style.css';
import dados from './data.json';
import { useEffect, useState } from 'react';
import { IconNumber123 } from '@tabler/icons-react';

export const Venda = () => {
    const columns = [
        { accessor: 'Nome' },
        { accessor: 'Descricao' },
        { accessor: 'Categoria' },
        { accessor: 'Valor' },
    ];

    return (
        <Container size={'100%'} id='container'>
            <Title order={1} id='titulo'>Caixa aberto</Title>
            <Stack align='end' >
                <DataTable
                    columns={columns}
                    withTableBorder={true}
                    borderRadius="md"
                    striped={true}
                    records={dados}
                    className='table'
                    height={500}
                />
                <Stack align='end' mt={40}>
                    <Text size='lg' fw={500}>Valor total: R$ 100,00</Text>
                    <Text size='lg' fw={500}>Valor dos impostos: R$ 20,00</Text>
                    <Button w={220}>Finalizar venda</Button>
                </Stack>
            </Stack>
            <Stack gap={30} align='start' justify='flex-start'>
                <Group gap={40}>
                    <Input
                        w={220}
                        leftSection={<IconNumber123 size={16} />}
                        placeholder='Insira o código do produto'>
                    </Input>
                    <NumberInput
                        w={220}
                        placeholder="Insira a quantidade"
                    />
                </Group>
                <Group gap={40}>
                    <Button w={220}>Consultar produto</Button>
                    <Button w={220}>Adicionar produto</Button>
                </Group>
            </Stack>
        </Container>
    )
}