import { ActionIcon, Box, Button, Container, Flex, Group, InputBase, Modal, NumberInput, Stack, Text, TextInput, Title } from "@mantine/core"
import { DataTable } from 'mantine-datatable';
import { CategoriaProps } from "./types";
import { useEffect, useState } from "react";
import { IconAbc, IconPencil, IconPercentage, IconTrash } from '@tabler/icons-react';
import { IMaskInput } from 'react-imask';
import useApi from '../../services/services';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from "@mantine/hooks";

export const Categoria = () => {
    const [categorias, setCategorias] = useState<CategoriaProps[]>([]);

    const [nomeInput, setNomeInput] = useState<any>('');
    const [impostoInput, setImpostoInput] = useState<any>('');
    const apiServices = useApi();
    const [temporaryItem, setTemporaryItem] = useState<any>();
    const [opened, { open, close }] = useDisclosure(false); //confirmação de deleção
    const [editModal, { open: openEditModal, close: closeEditModal }] = useDisclosure(false); //edição 
    const [delCategoria, setDelCategoria] = useState<any>(0); //usado para armazenar o ID da categoria em caso de exclusão
    const [editCategoria, setEditCategoria] = useState<any>(0); //usado para armazenar a categoria em caso de edição

    useEffect(() => {

        async function dataFetch() {
            let result = await apiServices.getCategories();

            let formatted = result.map((e: any) => {
                const formattedTax = parseFloat(e.tax_percent).toLocaleString('pt-BR', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                    useGrouping: false,
                });

                return {
                    id: e.id,
                    name: e.name,
                    tax_percent: `${formattedTax} %`,
                };
            });

            setCategorias(formatted);
        }
        dataFetch();
    }, [categorias])

    const handleAddCategoriaBtn = async () => {
        let result = await apiServices.createCategory({
            name: nomeInput,
            tax_percent: impostoInput,
        });

        console.log("request: ", result);
        if (result.error) {
            notifications.show({
                title: 'Erro',
                message: result.error,
                color: 'red'
            });
        }
        else {
            notifications.show({
                title: 'Sucesso',
                message: 'Categoria cadastrada',
                color: 'green'
            });
        }
        const currentCategories: any = [...categorias];
        currentCategories.push({
            name: nomeInput,
            tax_parcent: impostoInput
        })
        setCategorias(currentCategories);
    }
    return (
        <Container size={'100%'}>
            <Modal opened={opened} onClose={close} title="Confirmação">
                <Text>Tem certeza que deseja excluir o item?</Text>
                <Flex justify={'end'} gap={30} mt={30}>

                    <Button onClick={async () => {
                        let result = await apiServices.deleteCategory(delCategoria);
                        setCategorias(temporaryItem)
                        if (!result.message) {
                            notifications.show({
                                title: 'Erro',
                                message: 'Erro ao excluir categoria, verifique se a mesma não está vinculada a nenhum produto.',
                                color: 'red'
                            })
                        }
                        else {
                            notifications.show({
                                title: 'Alerta',
                                message: 'Categoria excluída!',
                                color: 'yellow'
                            })
                        }

                        close();
                    }}>Sim</Button>
                    <Button color='red' onClick={() => {
                        close();
                    }}>Não</Button>
                </Flex>
            </Modal>
            <Modal opened={editModal} onClose={closeEditModal} title="Edição de categoria" centered>
                <Box >
                    <Group justify={"center"}>
                        <TextInput
                            placeholder="Novo nome"
                            leftSection={<IconAbc size={16} />}
                            value={nomeInput}
                            onChange={(e) => setNomeInput(e.currentTarget.value)} />
                        <NumberInput
                            placeholder="Novo Imposto"
                            allowNegative={false}
                            decimalScale={2}
                            decimalSeparator=","
                            min={0}
                            max={10000}
                            hideControls
                            value={impostoInput}
                            onChange={(e) => {
                                setImpostoInput(e.valueOf())
                            }}
                            leftSection={<IconPercentage size={16} />}
                        />
                    </Group>
                </Box>
                <Group mt={20} justify="center">
                    <Button onClick={async () => {
                        let result = await apiServices.updateCategory({
                            name: nomeInput,
                            tax_percent: impostoInput,
                        }, editCategoria);

                        if (result[0].id) {
                            notifications.show({
                                title: 'Sucesso',
                                message: 'Alteração realizada',
                                color: 'green'
                            });
                        }
                        else {
                            notifications.show({
                                title: 'Erro',
                                message: result.error,
                                color: 'red'
                            });
                        }
                        closeEditModal();
                    }} color="orange">Alterar</Button>
                </Group>
            </Modal>
            <Title order={2} id="titulo">Categorias</Title>
            <DataTable
                columns={[
                    //{ accessor: 'id' },
                    { accessor: 'name', title: 'Nome' },
                    { accessor: 'tax_percent', title: 'Imposto sobre o valor' },
                    {
                        accessor: 'Acoes', title: 'Ações',
                        render: (categoria: any) => (
                            <Group>
                                <ActionIcon
                                    variant='subtle'
                                    size="sm"
                                    color="red"
                                    onClick={() => {
                                        open();
                                        // filtra os itens para remover o item clicado
                                        const updatedItems = categorias.filter((item: any) => item.id !== categoria.id);
                                        setTemporaryItem(updatedItems); //será usado posteriormente
                                        setDelCategoria(categoria.id)
                                    }}
                                >
                                    <IconTrash size={20} />
                                </ActionIcon>
                                <ActionIcon
                                    variant='subtle'
                                    size="sm"
                                    color="yellow"
                                    onClick={() => {
                                        setNomeInput('');
                                        setImpostoInput('');
                                        openEditModal();
                                        setEditCategoria(categoria.id)
                                    }}
                                >
                                    <IconPencil size={20} />
                                </ActionIcon>
                            </Group>)
                    },

                ]}
                records={categorias}
                height={500}
                noRecordsText="Nenhuma categoria encontrada"
            />
            <Group mt={50}>
                <TextInput
                    placeholder="Insira o nome"
                    label="Nome" description="Nome da categoria"
                    leftSection={<IconAbc size={16} />}
                    value={nomeInput}
                    onChange={(e) => setNomeInput(e.currentTarget.value)} />

                <NumberInput
                    label="Imposto"
                    description="Imposto cobrado sobre os produtos"
                    placeholder="Imposto"
                    allowNegative={false}
                    decimalScale={2}
                    decimalSeparator=","
                    min={0}
                    max={10000}
                    hideControls
                    value={impostoInput}
                    onChange={(e) => {
                        setImpostoInput(e.valueOf())
                    }}
                    leftSection={<IconPercentage size={16} />}
                />
            </Group>
            <Group mt={20}>
                <Button onClick={handleAddCategoriaBtn}>Inserir</Button>
            </Group>
        </Container>
    )
}