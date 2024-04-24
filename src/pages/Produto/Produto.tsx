import { DataTable } from 'mantine-datatable';
import companies from './companies.json';
import { ActionIcon, Box, Button, Container, Flex, Group, Input, InputBase, Modal, NumberInput, Select, Stack, Text, TextInput, Title } from '@mantine/core';
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
    const [delModal, { open: openDelModal, close: closeDelModal }] = useDisclosure(false); //modal para adição de produtos
    //const [opened, { open, close }] = useDisclosure(false); //modal para adição de produtos
    const apiServices = useApi();
    const [categories, setCategories] = useState<CategoriaProps[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<any>();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [code, setCode] = useState('');
    const [products, setProducts] = useState([])
    const [delProduto, setDelProduto] = useState<any>(0); //usado para armazenar o ID do produto em caso de exclusão
    const [editProduto, setEditProduto] = useState<any>(0); //usado para armazenar o ID do produto em caso de edição
    const [temporaryProducts, setTemporaryProducts] = useState<any>()
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


    useEffect(() => {
        async function dataFetch() {
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

            console.log("produto: ", formattedProducts)
        }
        dataFetch();
    }, [])


    return (

        <Container size={'100%'}>
            <Modal opened={delModal} onClose={closeDelModal} title="Confirmação">
                <Text>Tem certeza que deseja excluir o produto?</Text>
                <Flex justify={'end'} gap={30} mt={30}>

                    <Button onClick={async () => {
                        await apiServices.deleteProduct(delProduto)
                        setProducts(temporaryProducts);
                        notifications.show({
                            title: 'Alerta',
                            message: 'Produto excluído!',
                            color: 'yellow'
                        })
                        setDelProduto(0);
                        closeDelModal();
                    }}>Sim</Button>
                    <Button color='red' onClick={() => {
                        closeDelModal();
                    }}>Não</Button>
                </Flex>
            </Modal>
            <Modal opened={editModal} onClose={closeEditModal} title="Alteração">
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
                    <Button mt={40} type='submit' onClick={async () => {
                        const payload = {
                            name,
                            price,
                            description,
                            category_id: selectedCategoryId,
                            code,
                        }

                        let result = await apiServices.updateProduct(payload, editProduto);

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

                        console.log("RESULTADO DA ALTERAÇÃO!!", result);
                    }}>Inserir</Button>
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
                            close();
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
                                        const updatedProducts = products.filter((product: any) => product.id !== produto.id);
                                        setTemporaryProducts(updatedProducts); //será usado posteriormente

                                        setDelProduto(produto.id);
                                    }}
                                >
                                    <IconTrash size={20} />
                                </ActionIcon>
                                <ActionIcon
                                    variant='subtle'
                                    size="sm"
                                    color="yellow"
                                    onClick={() => {
                                        setName('')
                                        setPrice(0)
                                        setSelectedCategoryId(0)
                                        setCode('')
                                        setDescription('')

                                        openEditModal();
                                        setEditProduto(produto.id)
                                    }}
                                >
                                    <IconPencil size={20} />
                                </ActionIcon>
                            </Group>)
                    },
                ]}
                records={products}
            />
            <Group mt={20}>
                <Button onClick={() => open()}>Adicionar produto</Button>
            </Group>
        </Container>


    )
}