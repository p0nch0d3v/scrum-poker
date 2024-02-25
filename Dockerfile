FROM node:20-slim
EXPOSE 3000
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install --legacy-peer-deps
RUN npm run build
CMD [ "npm", "run" , "start"]
