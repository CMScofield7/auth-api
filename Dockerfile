# Usando a imagem oficial do Node.js 16
FROM node:23-alpine

# Definindo o diretório de trabalho dentro do container como /app
WORKDIR /app

# Copiando o package.json e o package-lock.json para o container
COPY package*.json ./

# Instalando as dependências do projeto
RUN npm install

# Copiando o restante dos arquivos do projeto para o container
COPY . .

# Compilando o projeto
RUN npm run build

# Definindo a variável de ambiente NODE_ENV para "production"
ENV NODE_ENV=production

# Expondo a porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação (em modo de produção)
<<<<<<< HEAD
CMD ["npm", "run", "dev"]
=======
CMD ["npm", "run", "start:prod"]
>>>>>>> 0.13

