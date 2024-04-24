import { useState } from 'react';
import { Tooltip, UnstyledButton, Stack, rem } from '@mantine/core';
import {
    IconHome2,
   /*  IconLogout, */
    IconShoppingCartSearch,
    IconCategoryPlus,
    IconCoin,
    IconBarcode
} from '@tabler/icons-react';
import classes from './NavbarMinimal.module.css';
import { useNavigate } from 'react-router-dom';

interface NavbarLinkProps {
    icon: typeof IconHome2;
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
                <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
}

const mockdata = [
    { icon: IconHome2, label: 'Home', link: '/' },
    { icon: IconCategoryPlus, label: 'Categorias', link: '/categoria' },
    { icon: IconBarcode, label: 'Produtos', link: '/produto'},
    { icon: IconCoin, label: 'Registrar venda', link: '/venda' },
    { icon: IconShoppingCartSearch, label: 'Consultar Vendas', link: '/consultarVenda'},
];

/* const logoutSection = [
    { icon: IconLogout, label: 'Logout', link: '/logout' },
] */

export const SimpleNavbar = () => {
    const [active, setActive] = useState(0);
    //const [activeBottom, setActiveBottom] = useState(1);
    const navigate = useNavigate();
    const links = mockdata.map((e, index) => (
        <NavbarLink
            {...e}
            key={e.label}
            active={index === active}
            onClick={() => {
                setActive(index)
                navigate(e.link)
            }}
        />
    ));
    /* const logoutLinks = logoutSection.map((e, index) => (
        <NavbarLink
            {...e}
            key={e.label}
            active={index === activeBottom}
            onClick={() => {
                setActiveBottom(index)
                localStorage.removeItem('token')
                navigate("/login")
            }}
        />
    )) */

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Stack justify="center" gap={0}>
                    {links}
                </Stack>
            </div>
                {/* <Stack justify="center" gap={0}>
                    {logoutLinks}
                </Stack> */}
        </nav>
    );
}

