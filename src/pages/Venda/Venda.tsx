import { ActionIcon, Button, Container, Flex, Group, Input, NumberInput, Stack, Text, Title, Modal } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import './style.css';
import { useEffect, useState } from 'react';
import { IconNumber123, IconTrash } from '@tabler/icons-react';
import useApi from '../../services/services';
import { v4 as uuidv4 } from 'uuid';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';

export const Venda = () => {
    const apiServices = useApi();
    const [item, setItem] = useState<any[]>([]);
    const [codigoInput, setCodigoInput] = useState<string>('');
    const [quantidadeInput, setQuantidadeInput] = useState<number>(1);
    const [valorTotal, setValorTotal] = useState<number>(0);
    const [imposto, setImposto] = useState<number>(0);
    const [opened, { open, close }] = useDisclosure(false);
    const [temporaryItem, setTemporaryItem] = useState<any>();
    const [valorComImposto, setValorComImposto] = useState<any>(0);

    useEffect(() => {
        console.log("Valor de item ", item)
        //soma total e impostos
        if (item.length > 0) {
            let valores = item.map((e) => +e.Valor);
            console.log(valores)
            let total = valores.reduce((anterior, prox) => +anterior + +prox)
            setValorTotal(+total.toFixed(2));

            let impostos = item.map((e) => +e.Imposto);
            let totalImpostos = impostos.reduce((anterior, prox) => +anterior + +prox)
            setImposto(+totalImpostos.toFixed(2))

            setValorComImposto(+total + +totalImpostos)
        }

        if(item.length == 0){
            setValorTotal(0);
            setImposto(0);
            setValorComImposto(0);
        }

    }, [item])

    const columns = [
        //{ accessor: 'id' },
        //{ accessor: 'db_id' },
        { accessor: 'Nome' },
        { accessor: 'Descricao', title: 'Descrição' },
        { accessor: 'Categoria' },
        { accessor: 'Valor' },
        { accessor: 'Imposto' },
        {
            accessor: 'Acoes', title: 'Ações',
            render: (produto: any) => (
                <Stack>
                    <ActionIcon
                        variant='subtle'
                        size="sm"
                        color="red"
                        onClick={() => {
                            open();
                            // filtra os itens para remover o item clicado
                            const updatedItems = item.filter((item: any) => item.id !== produto.id);
                            setTemporaryItem(updatedItems); //será usado posteriormente
                        }}
                    >
                        <IconTrash size={20} />
                    </ActionIcon>
                </Stack>)
        },
    ];

    const handleAddItemBtn = async (codigo: any) => {
        const result = await apiServices.getItemByCodigo(codigo);

        if (!result[0].codigo) {
            notifications.show({
                title: 'Erro',
                message: 'Item não encontrado!',
                color: 'red'
            })
            return;
        }

        const currentItems = [...item];

        for (let i = 0; i < +quantidadeInput; i++) {
            currentItems.push({
                // gera id para ser utilizado pelo front para montar os itens do carrinho, 
                // pois um único item pode ser inserido N vezes e o id do banco ficaria repetido, dificultando a exclusão do item do state
                id: uuidv4(),
                db_id: result[0].id,
                Codigo: result[0].codigo,
                Nome: result[0].name,
                Descricao: result[0].description,
                Categoria: result[0].category,
                Valor: result[0].price,
                Imposto: result[0].tax.toFixed(2),
            });
        }

        setItem(currentItems);

        notifications.show({
            title: 'Carrinho modificado',
            message: 'Item adicionado ao carrinho!',
            color: 'green'
        })

        setCodigoInput(0)
    }

    const handleCloseSaleBtn = async (item: any) => {
        let result = await apiServices.sendTransaction(item);

        if (result[0].id_transaction) {
            notifications.show({
                title: 'Notificação',
                message: 'Venda registrada com sucesso!',
                color: 'green'
            })
        }
        else {
            notifications.show({
                title: 'Erro',
                message: 'Erro ao registrar venda.',
                color: 'red'
            })
        }

        setItem([]);
    }


    return (
        <Container size={'100%'} id='container'>
            <Modal opened={opened} onClose={close} title="Confirmação">
                <Text>Tem certeza que deseja excluir o item?</Text>
                <Flex justify={'end'} gap={30} mt={30}>

                    <Button onClick={() => {
                        setItem(temporaryItem)
                        notifications.show({
                            title: 'Carrinho modificado',
                            message: 'Item excluído do carrinho!',
                            color: 'yellow'
                        })
                        close();
                    }}>Sim</Button>
                    <Button color='red' onClick={() => {
                        close();
                    }}>Não</Button>
                </Flex>
            </Modal>
            <Title order={2} id='titulo' >Registrar venda</Title>
            <Stack align='end' >
                <DataTable
                    columns={columns}
                    withTableBorder={true}
                    borderRadius="md"
                    striped={true}
                    records={item}
                    className='table'
                    height={500}
                    noRecordsText="Nenhum produto inserido"
                />
            </Stack>
            <Flex justify="space-between" mt={30} >
                <Stack gap={30} align='start' >
                    <Group>
                        <Input
                            w={120}
                            leftSection={<IconNumber123
                                size={16} />}
                            placeholder='Código'
                            value={codigoInput}
                            onChange={(e) => {
                                setCodigoInput(e.currentTarget.value);
                            }} />
                        <NumberInput
                            w={120}
                            placeholder="Quantidade"
                            value={quantidadeInput}
                            onChange={(e) => setQuantidadeInput(+e.valueOf())}
                            min={1}
                            max={100}
                            defaultValue={1}
                        />
                    </Group>
                    <Group gap={40}>
                        <Button w={120} onClick={() => handleAddItemBtn(codigoInput)}>Adicionar</Button>
                    </Group>
                </Stack>

                <Stack align='end'>
                    <Text size='xs' fw={500}>Total: R$ {valorTotal.toString()}</Text>
                    <Text size='xs' fw={500}>Impostos: R$ {imposto.toString()}</Text>
                    <Text size='md' fw={500}>Total (com impostos): R$ {valorComImposto}</Text>
                    <Button onClick={() => {
                        handleCloseSaleBtn(item)
                    }}>Concluir</Button>
                </Stack>
            </Flex>
        </Container>
    )
}