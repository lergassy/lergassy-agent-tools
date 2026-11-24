FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY src ./src
# APIFY_TOKEN is only needed when a tool is called; the server starts and lists tools without it.
ENTRYPOINT ["node", "src/index.js"]
