
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Login } from '../pages/Login/Login'
import { Home } from '../pages/Home/Home'
import { ProtectRoute } from './ProtectRoute'
import { NotFound } from '../pages/NotFound/NotFound'
import { BasicAppShell } from '../layout/BasicAppShell'
import { RedirectLogin } from './RedirectLogin'
import { Teste } from './Teste'


export const MainRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<BasicAppShell><Home /></BasicAppShell>} />
                <Route path="/teste" element={<BasicAppShell><Teste /></BasicAppShell>} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};