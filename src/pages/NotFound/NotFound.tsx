import { Image, Container, Title, Text, Button, SimpleGrid } from '@mantine/core';
import image from './image.svg';
import classes from './NotFoundImage.module.css';
import {Link} from 'react-router-dom'
export const NotFound = () => {
    return (
        <Container className={classes.root}>
            <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
                <Image src={image} className={classes.mobileImage} />
                <div>
                    <Title className={classes.title}>Algo de errado não está certo...</Title>
                    <Text c="dimmed" size="lg">
                        A página que você está tentando acessar não existe. Você pode ter digitado o endereço incorretamente, 
                        ou a página foi movida para outra URL. Se você acha que isso é um erro, contate o administrador.
                    </Text>
                    <Button variant="outline" size="md" mt="xl" className={classes.control}>
                        <Link to={'/'}>Voltar para a página inicial</Link>
                    </Button>
                </div>
                <Image src={image} className={classes.desktopImage} />
            </SimpleGrid>
        </Container>
    );
}