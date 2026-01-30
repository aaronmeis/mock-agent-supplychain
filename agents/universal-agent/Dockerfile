FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# We reference the BaseAgent relatively, but in the Build context we should ensure it's available.
# In a real setup we'd use a monorepo or copy the base agent in.
# For simplicity, I'll copy the base agent into a folder inside universal-agent during build if needed,
# or just adjust the import to assuming it's in the same parent.

COPY . .
RUN npm run build

EXPOSE 3001
EXPOSE 3002
EXPOSE 3003
EXPOSE 3004

CMD ["npm", "start"]
