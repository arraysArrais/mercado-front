
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Login } from '../pages/Login/Login'
import { Home } from '../pages/Home/Home'
import { ProtectRoute } from './ProtectRoute'
import { NotFound } from '../pages/NotFound/NotFound'
import { BasicAppShell } from '../layout/BasicAppShell'
import { RedirectLogin } from './RedirectLogin'
import { Venda } from '../pages/Venda/Venda'
import { ListVenda } from '../pages/ListVenda.tsx/ListVenda'
import { Categoria } from '../pages/Categoria/Categoria'


export const MainRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<BasicAppShell><Home /></BasicAppShell>} />
                <Route path="/venda" element={<BasicAppShell><Venda /></BasicAppShell>} />
                <Route path="/consultarVenda" element={<BasicAppShell><ListVenda /></BasicAppShell>} />
                <Route path="/categoria" element={<BasicAppShell><Categoria /></BasicAppShell>} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};