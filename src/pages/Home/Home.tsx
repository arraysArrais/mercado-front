import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem, Stack } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import image from './image.svg';
import classes from './HeroBullets.module.css';


export const Home = () => {
    return (
        <Container size="md">
            <div className={classes.inner}>
                <div className={classes.content}>
                    <Title className={classes.title}>
                        Bem-vindo(a) ao <span className={classes.highlight}>MercadoApp</span>
                    </Title>
                    <Text c="dimmed" mt="md">
                        Seu estabelecimento na palma da sua mão
                    </Text>

                    <List
                        mt={30}
                        spacing="sm"
                        size="sm"
                        icon={
                            <ThemeIcon size={20} radius="xl">
                                <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                            </ThemeIcon>
                        }
                    >
                        <Stack>
                            <List.Item>Gestão de Produtos&Categorias</List.Item>
                            <List.Item>Controle total das vendas</List.Item>
                            <List.Item>Segurança em primeiro lugar</List.Item>
                        </Stack>
                    </List>
                </div>
                <Image src={image} className={classes.image} />
            </div>
        </Container>
    );
}