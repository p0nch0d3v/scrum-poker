FROM node:20-alpine
EXPOSE 80
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install --global typescript@5.2.2 @nestjs/cli turbo@1.12.4 vite@5.1.0
RUN npm install --legacy-peer-deps
RUN npm run build
CMD [ "npm", "run" , "start"]
