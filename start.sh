#!/bin/sh

# Aplica as migrações do Prisma (se necessário)
echo "Aplicando migrações do Prisma..."
npx prisma migrate deploy

# Inicia a aplicação
echo "Iniciando a aplicação..."
npm run prod