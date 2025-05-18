# Imagen base oficial de Node.js
FROM node:20

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto que usará tu aplicación
EXPOSE 3000

# Comando por defecto al iniciar el contenedor
CMD ["node", "conexion.js"]
