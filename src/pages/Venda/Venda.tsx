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
            </Stack>
            <Flex justify="space-between" mt={50}>
                <Stack gap={30} align='start' >
                    <Group>
                        <Input w={220} leftSection={<IconNumber123 size={16} />} placeholder='Insira o código do produto' />
                        <NumberInput w={220} placeholder="Insira a quantidade" />
                    </Group>
                    <Group gap={40}>
                        <Button >Adicionar produto</Button>
                    </Group>
                </Stack>

                <Stack align='end'>
                    <Text size='lg' fw={500}>Valor total: R$ 100,00</Text>
                    <Text size='lg' fw={500}>Impostos: R$ 20,00</Text>
                    <Button >Finalizar venda</Button>
                </Stack>
            </Flex>
        </Container>
    )
}