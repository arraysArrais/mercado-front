import { DataTable } from 'mantine-datatable';
import { ActionIcon, Button, Container, Flex, Group, InputBase, Modal, NumberInput, Select, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import useApi from '../../services/services';
import { CategoriaProps } from '../Categoria/types';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { notifications } from '@mantine/notifications';
import { IconPencil, IconTrash } from '@tabler/icons-react';

export const Produto = () => {
    const [opened, { open, close }] = useDisclosure(false); //modal para adição de produtos
    const [delModal, { open: openDelModal, close: closeDelModal }] = useDisclosure(false); //modal para deleção de produtos
    const apiServices = useApi();
    const [categories, setCategories] = useState<CategoriaProps[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [code, setCode] = useState('');
    const [products, setProducts] = useState([])
    const [delProduto, setDelProduto] = useState<any>(0); //usado para armazenar o ID do produto em caso de exclusão
    const [editProduto, setEditProduto] = useState<any>(0); //usado para armazenar o ID do produto em caso de edição
    const [editModal, { open: openEditModal, close: closeEditModal }] = useDisclosure(false); //edição 

    const schema = z.object({
        name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
        price: z.number().min(1, { message: 'O preço deve ser maior que zero' }),
        description: z.string().min(3, { message: 'Descrição deve ter pelo menos 3 caracteres' }),
        category_id: z.string().min(1, { message: 'Deve ser selecionada uma categoria' }),
        code: z.string().min(5, { message: 'Código do produto deve conter pelo menos 5 caracteres' }),
    });

    const form = useForm({
        //mode: 'uncontrolled'
        initialValues: {
            name: '',
        },
        validate: zodResolver(schema),
    });

    const editSchema = z.object({
        name: z.string().min(5, { message: 'O novo nome deve ter pelo menos 5 caracteres' }).optional().or(z.literal('')),
        price: z.number().min(1, { message: 'O novo preço deve ser maior que zero' }).optional().or(z.literal('')),
        description: z.string().min(3, { message: 'A nova descrição deve ter pelo menos 3 caracteres' }).optional().or(z.literal('')),
        category_id: z.string().min(1, { message: 'Deve ser selecionada uma categoria' }).optional().or(z.literal('')),
        code: z.string().min(5, { message: 'Código do produto deve conter pelo menos 5 caracteres' }).optional().or(z.literal('')),
    });


    const editForm = useForm({
        initialValues: {
            name: '',
            price: 5,
            description: '',
            category_id: '',
            code: '',
        },
        validate: zodResolver(editSchema),
    })

    useEffect(() => {
        fetchData()

    }, [])

    const clearAddInputs = () => {
        setName('')
        form.setFieldValue('name', '')
        setDescription('')
        setPrice(0)
        setCode('')
        setSelectedCategoryId('')
    }

    const handleEditProduto = async () => {
        const payload = {
            name,
            price,
            description,
            category_id: selectedCategoryId,
            code,
        }
        let result = await apiServices.updateProduct(payload, editProduto);

        if (result.error) {
            notifications.show({
                title: 'Erro',
                message: result.error,
                color: 'red'
            });
        }
        else if (result[0].id) {
            notifications.show({
                title: 'Sucesso',
                message: 'Alteração realizada',
                color: 'green'
            });
        }
        else
            notifications.show({
                title: 'Erro',
                message: 'Erro ao enviar requisição para o servidor',
                color: 'red'
            });
        fetchData();
        closeEditModal();
    }

    const handleAddProduto = async () => {
        const payload = {
            name,
            price,
            description,
            category_id: selectedCategoryId,
            code
        }
        //request pra api
        let result = await apiServices.createProduct(payload);
        if (result[0].id) {
            notifications.show({
                title: 'Sucesso',
                message: 'Produto cadastrado',
                color: 'green'
            });
        }
        else {
            notifications.show({
                title: 'Erro',
                message: (result.error ? result.error : "Erro ao enviar requisição para o servidor"),
                color: 'red'
            });
        }
        fetchData(); //faz requisição para api e atualiza dados em tela

        close();
    }

    const handleDelProduto = async () => {
        let result = await apiServices.deleteProduct(delProduto)
        if (result.message) {
            notifications.show({
                title: 'Alerta',
                message: 'Produto excluído!',
                color: 'yellow'
            })
        }
        else {
            notifications.show({
                title: 'Erro',
                message: "Erro ao excluir produto, verifique se o mesmo não está vinculado a uma venda",
                color: 'red'
            });
        }
        fetchData(); // atualiza tela
        setDelProduto(0); //zera state usado pra armazenar id do produto a ser deletado
        closeDelModal();
    }

    const fetchData = async () => {
        let categoryData = await apiServices.getCategories();
        setCategories(categoryData)

        let productData = await apiServices.getProducts();

        let formattedProducts = productData.map((e: any) => {
            const formattedPrice = parseFloat(e.price).toLocaleString('pt-BR', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
                useGrouping: false,
            });

            return {
                id: e.id,
                name: e.name,
                description: e.description,
                category: e.category,
                codigo: e.codigo,
                price: `R$ ${formattedPrice}`
            };
        });

        setProducts(formattedProducts)
    }

    return (
        <Container size={'100%'}>
            <Modal opened={delModal} onClose={closeDelModal} title="Confirmação">
                <Text>Tem certeza que deseja excluir o produto?</Text>
                <Flex justify={'end'} gap={30} mt={30}>

                    <Button onClick={handleDelProduto}>Sim</Button>
                    <Button color='red' onClick={closeDelModal}>Não</Button>
                </Flex>
            </Modal>
            <Modal opened={editModal} onClose={closeEditModal} title="Alteração">
                <Stack>
                    <form onSubmit={(e) => {
                        e.preventDefault();

                        const validationResult = editForm.validate();
                        if (!validationResult.hasErrors) {
                            handleEditProduto();
                        }
                    }}>
                        <Stack gap={20}>
                            <InputBase
                                type="text"
                                placeholder="Nome"
                                value={editForm.values.name}
                                onChange={(e) => {
                                    editForm.setFieldValue('name', e.currentTarget.value)
                                    setName(e.currentTarget.value)
                                }}
                                error={editForm.errors.name}
                            />
                            <InputBase
                                type="text"
                                placeholder="Descrição"
                                value={description}
                                onChange={(e) => {
                                    editForm.setFieldValue('description', e.currentTarget.value)
                                    setDescription(e.currentTarget.value)
                                }}
                                error={editForm.errors.description}
                            />
                            <NumberInput
                                placeholder="Preço"
                                prefix="R$ "
                                allowNegative={false}
                                decimalScale={2}
                                decimalSeparator=","
                                min={0}
                                max={10000}
                                hideControls
                                value={price}
                                onChange={(e: any) => {
                                    editForm.setFieldValue('price', +e.valueOf())
                                    setPrice(+e.valueOf())
                                }}
                                error={editForm.errors.price}
                            />
                            <Select
                                placeholder="Categoria"
                                data={categories.map(category => ({ label: category.name, value: category.id.toString() }))}
                                value={selectedCategoryId}
                                onChange={(selectedOption) => {
                                    setSelectedCategoryId(selectedOption?.valueOf())
                                    editForm.setFieldValue('category_id', (selectedOption?.valueOf() == null ? '' : selectedOption?.valueOf()))
                                }}
                                error={editForm.errors.category_id}
                            />
                            <InputBase
                                type="text"
                                placeholder="Código"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.currentTarget.value)
                                    editForm.setFieldValue('code', e.currentTarget.value)
                                }}
                                error={editForm.errors.code}
                            />
                            <Button mt={10} type='submit' color='orange'>Atualizar</Button>
                        </Stack>
                    </form>
                </Stack>
            </Modal>
            <Modal opened={opened} onClose={close} title="Cadastro de produto">
                <Text>Insira os dados abaixo para cadastrar o produto</Text>


                <Stack mt={20}>
                    <form onSubmit={async (event) => {
                        event.preventDefault()
                        const validationResult = form.validate();
                        console.log(validationResult)
                        if (!validationResult.hasErrors) {
                            handleAddProduto();
                            clearAddInputs();
                        }
                    }}>
                        <Stack>
                            <InputBase
                                type="text"
                                placeholder="Nome"
                                value={form.values.name}
                                onChange={(e) => {
                                    form.setFieldValue('name', e.currentTarget.value)
                                    setName(e.currentTarget.value)
                                }}
                                error={form.errors.name}
                            />
                            <InputBase
                                type="text"
                                placeholder="Descrição"
                                value={description}
                                onChange={(e) => {
                                    form.setFieldValue('description', e.currentTarget.value)
                                    setDescription(e.currentTarget.value)
                                }}
                                error={form.errors.description}
                            />
                            <NumberInput
                                placeholder="Preço"
                                prefix="R$ "
                                allowNegative={false}
                                decimalScale={2}
                                decimalSeparator=","
                                min={0}
                                max={10000}
                                hideControls
                                value={price}
                                onChange={(e: any) => {
                                    form.setFieldValue('price', +e.valueOf())
                                    setPrice(+e.valueOf())
                                }}
                                error={form.errors.price}
                            />
                            <Select
                                placeholder="Categoria"
                                data={categories.map(category => ({ label: category.name, value: category.id.toString() }))}
                                value={selectedCategoryId}
                                onChange={(selectedOption) => {
                                    setSelectedCategoryId(selectedOption?.valueOf())
                                    form.setFieldValue('category_id', selectedOption?.valueOf())
                                }}
                                error={form.errors.category_id}
                            />
                            <InputBase
                                type="text"
                                placeholder="Código"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.currentTarget.value)
                                    form.setFieldValue('code', e.currentTarget.value)
                                }}
                                error={form.errors.code}
                            />
                            <Button mt={40} type='submit'>Inserir</Button>
                        </Stack>
                    </form>
                </Stack>
            </Modal>
            <Title order={2} id="titulo">Produtos</Title>
            <DataTable
                columns={[
                    { accessor: 'name', title: 'Nome' },
                    { accessor: 'price', title: 'Preço' },
                    { accessor: 'description', title: 'Descrição' },
                    { accessor: 'codigo', title: 'Código' },
                    { accessor: 'category', title: 'Categoria' },
                    //{ accessor: 'tax_percent', title: 'Imposto percentual' },
                    {
                        accessor: 'Acoes', title: 'Ações',
                        render: (produto: any) => (
                            <Group>
                                <ActionIcon
                                    variant='subtle'
                                    size="sm"
                                    color="red"
                                    onClick={async () => {
                                        openDelModal();
                                        setDelProduto(produto.id);
                                    }}
                                >
                                    <IconTrash size={20} />
                                </ActionIcon>
                                <ActionIcon
                                    variant='subtle'
                                    size="sm"
                                    color="yellow"
                                    onClick={async () => {
                                        let result = await apiServices.getItemByCodigo(produto.codigo);
                                        setSelectedCategoryId(result[0].category_id.toString())

                                        editForm.setFieldValue('name', result[0].name)
                                        setName(result[0].name)

                                        editForm.setFieldValue('description', result[0].description)
                                        setDescription(result[0].description)

                                        editForm.setFieldValue('price', +result[0].price)
                                        setPrice(result[0].price)

                                        editForm.setFieldValue('codigo', result[0].codigo)
                                        setCode(result[0].codigo)

                                        editForm.setFieldValue('category_id', selectedCategoryId ?? '')

                                        setEditProduto(produto.id)
                                        openEditModal();
                                    }}
                                >
                                    <IconPencil size={20} />
                                </ActionIcon>
                            </Group>)
                    },
                ]}
                records={products}
                noRecordsText="Nenhum produto encontrado"
                height={500}
                withTableBorder
                borderRadius={10}
            />
            <Group mt={30}>
                <Button onClick={() => open()}>Adicionar produto</Button>
            </Group>
        </Container>


    )
}