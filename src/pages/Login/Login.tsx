import { useForm, zodResolver } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Loader,
} from '@mantine/core';
import useAuth from "../../auth/api"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'; //excluir para o modal funcionar
import { z } from 'zod';
import { notifications } from '@mantine/notifications';

const schema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'Sua senha deve ter ao menos 6 caracteres' }),
});

export function Login(props: PaperProps) {
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      email: '',
      password: '',
    },
  });

  const authApi = useAuth();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    setIsLoading(true);
    let loginResponse = await authApi.login(emailInput, passwordInput);
    setIsLoading(false);

    if(loginResponse.statusCode){
      notifications.show({
        title: 'Login',
        message: 'Credenciais de acesso inválidas',
        color: 'red',
      })
    }
    navigate('/')
  }
  return (
    <div className='loginContainer'>
      <Paper radius="md" p="xl" withBorder {...props} className='loginForm'>
        <Text size="lg" fw={500}>
          <Group justify='center'>Bem vindo(a)</Group>
        </Text>
        {/* <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton> */}
           {/* <TwitterButton radius="xl">Twitter</TwitterButton> */}
        {/* </Group> */}
        <Divider label="insira usuário e senha para acessar" labelPosition="center" my="lg" />
        <form onSubmit={form.onSubmit(handleLogin)}>
          <TextInput
            required
            //label="E-mail"
            placeholder="Seu e-mail"
            value={form.values.email}
            onChange={(event) => {
              form.setFieldValue('email', event.currentTarget.value)
              setEmailInput(event.currentTarget.value)
            }}
            error={form.errors.email}
            radius="md"
          />
          <br/>
          <PasswordInput
            required
            //label="Senha"
            placeholder="Sua senha"
            value={form.values.password}
            onChange={(event) => {
              form.setFieldValue('password', event.currentTarget.value)
              setPasswordInput(event.currentTarget.value)
            }}
            error={form.errors.password}
            radius="md"
          />
          <Group justify="center" mt="xl">
            {isLoading ? <Loader /> : <Button type='submit' radius="xl">Entrar</Button>}
          </Group>
        </form>
      </Paper>
    </div>
  );
}
