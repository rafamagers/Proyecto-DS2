# Etapa de construcción
FROM node:18.17.1 

WORKDIR /app
# Copiar los archivos de la aplicación (ignorar los archivos listados en .dockerignore)
COPY . .

# Instalar las dependencias
RUN npm install

# Construir la aplicación
RUN npm run build

CMD [ "npm", "run", "dev" ]