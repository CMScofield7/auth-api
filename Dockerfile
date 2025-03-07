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

# Gerando o cliente Prisma
RUN npx prisma generate

# Compilando o projeto
RUN npm run build

# Definindo a variável de ambiente NODE_ENV para "production"
ENV NODE_ENV=production

# Copiando o script de inicialização para o container
COPY start.sh /app/start.sh

# Tornando o script executável
RUN chmod +x /app/start.sh

# Expondo a porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação (em modo de produção)
CMD ["sh", "/app/start.sh"]


