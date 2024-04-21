//redireciona para home caso já esteja logado
import { useEffect, useState } from "react"
import useAuth from "../auth/api";
import { useNavigate } from "react-router-dom";

type Props = {
    children: JSX.Element
}

export const RedirectLogin = ({children}: Props) => {
    const authApi = useAuth();
    const [isAuth, setIsAuth] = useState(false);
    const navigate = useNavigate();

    useEffect(() =>{
        const checkIfItsLogged = async () => {
            if(authApi.getToken()){
                console.log('Token já existente, validando token...')
                const isValidated = await authApi.validateToken();
                console.log("Validado pelo backend ?", isValidated)
                if(isValidated){
                    setIsAuth(true)
                    console.log("Token válido, redirecionando para a home");
                    navigate("/");
                }
                else{
                    console.log("Token inválido")
                }
            }
            else{
                console.log("Token não encontrado!")
            }
        }

        checkIfItsLogged();
    }, []);
    return !isAuth ? children : null
}