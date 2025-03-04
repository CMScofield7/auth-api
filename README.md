<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Auth API - NestJS

## Descrição

Este projeto é uma API de autenticação desenvolvida com NestJS, implementando as melhores práticas de segurança, autenticação via JWT, controle de sessão com Redis e envio de e-mail para redefinição de senha usando Nodemailer.

## Funcionalidades

- Registro de usuários
- Login seguro com JWT
- Renovação automática do refresh token
- Esqueci a senha: envio de e-mail com link de redefinição de senha
- Middleware de autenticação

## Tecnologias

- **NestJS**: Framework backend para construção de APIs escaláveis
- **PostgreSQL**: Banco de dados relacional
- **JWT (Json Web Token)**: Autenticação baseada em tokens
- **bcrypt**: Criptografia de senhas
- **Redis**: Armazenamento de sessão e controle de refresh token
- **Nodemailer**: Envio de e-mails para recuperação de senha
- **Docker**: Containerização e ambiente de desenvolvimento isolado
- **Jest**: Testes unitários para garantir a qualidade do código

## Como rodar o projeto

1. Clone o repositório

```bash
git clone git@github.com:CMScofield7/auth-api.git
```

2. Instale as dependências

```bash
Docker e use o docker compose up --build
```

Caso o build não instale as dependências, rode:

```bash
npm install
```

3. Configure as variáveis de ambiente (.env)

```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123
DB_DATABASE=postgres_db
DATABASE_URL="postgresql://postgres:123@postgres:5432/postgres_db?schema=public"
JWT_SECRET=secret
REDIS_HOST=redis
REDIS_PORT=6379
```

4. Inicie o servidor

```bash
npm run start:dev
```

## Contribuição

Sinta-se à vontade para abrir issues ou enviar pull requests!
