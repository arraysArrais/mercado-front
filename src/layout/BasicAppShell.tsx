import { AppShell, Burger, Group } from '@mantine/core';
import { SimpleNavbar } from '../components/SimpleNavBar/SimpleNavBar';
import { useDisclosure } from '@mantine/hooks';
import './style.css'

type Props = {
    children: JSX.Element
}

export const BasicAppShell = ({ children }: Props) => {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            /* header={{ height: 0 }} */
            /* navbar={{ width: 80, breakpoint: 'sm' }} */
            /* footer={{height: 0}} */
            header={{ height: { base: 60, md: 70, lg: 80 } }}
            navbar={{
                width: { base: 80, md: 80, lg: 80 },
                breakpoint: 'md',
                collapsed: { mobile: !opened },
            }} 
            padding="md"

        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <img width="50" height="50" src="https://img.icons8.com/doodle/96/shopping-cart--v1.png" alt="shopping-cart" style={{margin:0}}/><b>MercadoApp</b>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar>

                <SimpleNavbar />
            </AppShell.Navbar>
            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}