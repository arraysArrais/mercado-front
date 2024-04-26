import { ActionIcon, Box, Button, Container, Flex, Group, Modal, NumberInput, Stack, Text, TextInput, Title } from "@mantine/core"
import { DataTable } from 'mantine-datatable';
import { CategoriaProps } from "./types";
import { useEffect, useState } from "react";
import { IconAbc, IconPencil, IconPercentage, IconTrash } from '@tabler/icons-react';
import useApi from '../../services/services';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { z } from 'zod';

export const Categoria = () => {
    const [categorias, setCategorias] = useState<CategoriaProps[]>([]);

    const [nomeInput, setNomeInput] = useState<any>('');
    const [impostoInput, setImpostoInput] = useState<any>('');
    const apiServices = useApi();
    const [opened, { open, close }] = useDisclosure(false); //confirmação de deleção
    const [editModal, { open: openEditModal, close: closeEditModal }] = useDisclosure(false); //edição 
    const [delCategoria, setDelCategoria] = useState<any>(0); //usado para armazenar o ID da categoria em caso de exclusão
    const [editCategoria, setEditCategoria] = useState<any>(0); //usado para armazenar a categoria em caso de edição

    const schema = z.object({
        name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
        tax: z.number().min(1, { message: 'O imposto deve ser maior que zero' }),
    });

    const form = useForm({
        initialValues: {
            name: '',
            tax: 0
        },
        validate: zodResolver(schema),
    });

    const editSchema = z.object({
        name: z.string().min(5, { message: 'O novo nome deve ter pelo menos 5 caracteres' }).optional().or(z.literal('')),
        tax: z.number().min(1, { message: 'O novo imposto deve ser maior que zero' }).optional().or(z.literal('')),
    });


    const editForm = useForm({
        initialValues: {
            name: '',
            tax: 0,
        },
        validate: zodResolver(editSchema),
    })
    const fetchData = async () => {
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


    useEffect(() => {
        fetchData();
    }, [])

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

        setImpostoInput(0);
        setNomeInput('');
        form.setFieldValue('name', '')
        form.setFieldValue('tax', 0)
        fetchData();
    }

    const handleEditCategoriaBtn = async () => {
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
        fetchData();
        closeEditModal();
    }
    return (
        <Container size={'100%'} >
            <Modal opened={opened} onClose={close} title="Confirmação">
                <Text>Tem certeza que deseja excluir o item?</Text>
                <Flex justify={'end'} gap={30} mt={30}>
                    <Button onClick={async () => {
                        let result = await apiServices.deleteCategory(delCategoria);
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
                        fetchData();
                        close();
                    }}>Sim</Button>
                    <Button color='red' onClick={() => {
                        close();
                    }}>Não</Button>
                </Flex>
            </Modal>
            <Modal opened={editModal} onClose={closeEditModal} title="Edição de categoria" centered>
                <Box >
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const validationResult = editForm.validate();

                        if (!validationResult.hasErrors) {
                            handleEditCategoriaBtn();
                        }

                    }}>
                        <Group justify={"center"}>
                            <TextInput
                                placeholder="Novo nome"
                                leftSection={<IconAbc size={16} />}
                                value={editForm.values.name}
                                error={editForm.errors.name}
                                onChange={(e) => {
                                    editForm.setFieldValue('name', e.currentTarget.value)
                                    setNomeInput(e.currentTarget.value)
                                }} />
                            <NumberInput
                                placeholder="Novo Imposto"
                                allowNegative={false}
                                decimalScale={2}
                                decimalSeparator=","
                                min={0}
                                max={10000}
                                hideControls
                                value={editForm.values.tax}
                                error={editForm.errors.tax}
                                onChange={(e) => {
                                    editForm.setFieldValue('tax', +e.valueOf())
                                    setImpostoInput(+e.valueOf())
                                }}
                                leftSection={<IconPercentage size={16} />}
                            />
                        </Group>
                        <Group mt={20} justify="center">
                            <Button type="submit" color="orange">Alterar</Button>
                        </Group>
                    </form>
                </Box>

            </Modal>
            <Title order={2} id="titulo">Categorias</Title>
            <DataTable
                withTableBorder
                borderRadius={10}
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
                                        setDelCategoria(categoria.id)
                                    }}
                                >
                                    <IconTrash size={20} />
                                </ActionIcon>
                                <ActionIcon
                                    variant='subtle'
                                    size="sm"
                                    color="yellow"
                                    onClick={async () => {
                                        let result = await apiServices.getCategory(categoria.id);
                                        editForm.setFieldValue('name', result[0].name);
                                        editForm.setFieldValue('tax', +result[0].tax_percent);
                                        setNomeInput(result[0].name);
                                        setImpostoInput(result[0].tax_percent);


                                        setEditCategoria(categoria.id);
                                        openEditModal();
                                        
                                    }}
                                >
                                    <IconPencil size={20} />
                                </ActionIcon>
                            </Group>)
                    },

                ]}
                records={categorias}
                height={400}
                noRecordsText="Nenhuma categoria encontrada"
            />
            <Stack gap={50} w={200} mt={30}>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const validationResult = form.validate();
                    if (!validationResult.hasErrors) {
                        handleAddCategoriaBtn();
                    }
                }}>
                    <TextInput
                        placeholder="Insira o nome"
                        label="Nome" description="Nome da categoria"
                        leftSection={<IconAbc size={16} />}
                        //value={nomeInput}
                        value={form.values.name}
                        error={form.errors.name}
                        onChange={(e) => {
                            form.setFieldValue('name', e.currentTarget.value)
                            setNomeInput(e.currentTarget.value)
                        }} />
                    <NumberInput
                        mt={20}
                        label="Imposto"
                        description="Imposto cobrado sobre os produtos"
                        placeholder="Imposto"
                        allowNegative={false}
                        decimalScale={2}
                        decimalSeparator=","
                        min={0}
                        max={10000}
                        hideControls
                        //value={impostoInput}
                        value={form.values.tax}
                        error={form.errors.tax}
                        onChange={(e) => {
                            form.setFieldValue('tax', +e.valueOf())
                            setImpostoInput(e.valueOf())
                        }}
                        leftSection={<IconPercentage size={16} />}
                    />
                    <Group mt={30}>
                        <Button type="submit">Inserir</Button>
                    </Group>
                </form>
            </Stack>

        </Container>
    )
}