# Imagem de base
FROM node:14.7.0-alpine

# Crie uma pasta para a aplicação
WORKDIR /app

# Copie os arquivos necessários
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie os arquivos da aplicação
COPY . .

# Crie a build do frontend
RUN npm run build

# Expõe a porta que a aplicação estará rodando
EXPOSE 3000

# Inicia a aplicação
CMD ["npm", "start"]
