import { Container, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import useApi from '../../services/services';
import classes from './RowExpansion.module.css';
import { dateConverter } from '../../helpers/dateConverter';

export const ListVenda = () => {
    const [vendas, setVendas] = useState<any>();
    const [venda, setVenda] = useState<any>();
    const apiServices = useApi();


    useEffect(() => {
        async function dataFetch() {
            let result = await apiServices.listTransaction();
            console.log(result);
            let formatted = result.map((e: any) => {
                const formattedTotal = parseFloat(e.total).toLocaleString('pt-BR', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                    useGrouping: false,
                });

                return {
                    id: e.id,
                    created_date: dateConverter(e.created_date, 'DD/MM/YYYY HH:mm'),
                    total: `R$ ${formattedTotal}`,
                    products: e.products
                };
            });

            setVendas(formatted);
        }

        dataFetch()
    }, [])

    const columns = [
        //{ accessor: 'id' },
        //{ accessor: 'db_id' },
        { accessor: 'id' },
        { accessor: 'created_date', title: 'Data da venda' },
        { accessor: 'total' }
    ];

    function handleRowExpansionData(id: any) {
        //busca registro de venda completo com base no id para que seja exibido em detalhes ao expandir a linha 
        let venda = vendas.find((e: any) => e.id == id)
        setVenda(venda);
    }

    return (
        <Container size={'100%'} id='container'>
            <Title order={2} id='titulo'>Listar Vendas</Title>
            <Stack align='end' >
                <DataTable
                    columns={columns}
                    withTableBorder={true}
                    borderRadius="md"
                    striped={true}
                    records={vendas}
                    className='table'
                    height={500}
                    noRecordsText="Nenhuma registro de venda encontrado"
                    onRowClick={({ record }) => {
                        handleRowExpansionData(record.id);

                    }}
                    rowExpansion={{
                        content: () => (
                            <Stack className={classes.details} p="xs" gap={6}>
                                {venda.products.map((product: any) => (
                                    <div>
                                        <Group gap={6}>
                                            <Text size='mdsm'>{product.name} {/* Código: {product.codigo} Categoria: {product.categoria} */}</Text>
                                        </Group>
                                        <Group>
                                            <Text fw={700} size='sm'>Preço : R$ {(parseFloat(product.price) + (parseFloat(product.price) * parseFloat(product.percentual_imposto) / 100)).toFixed(2)}</Text>
                                        </Group>
                                        <Divider />
                                    </div>
                                ))}
                            </Stack>
                        ),
                    }}
                />
            </Stack>
        </Container>
    )
}