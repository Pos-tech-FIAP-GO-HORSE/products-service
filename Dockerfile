FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm run build

EXPOSE 3000

# Use a non-root user for security
USER node

CMD ["npm", "start"]
