FROM node:18
WORKDIR /app

# RUN npm config set fetch-timeout 1200000

RUN apt-get update && apt-get install -y calibre
COPY backend/package.json backend/package-lock.json /app/backend/
COPY backend/.env /app/backend/.env
WORKDIR /app/backend
RUN npm install

COPY backend /app/backend


# WORKDIR /app/frontend/my-frontend
# COPY frontend/my-frontend/.env /app/frontend/my-frontend/.env
# COPY frontend/my-frontend/package.json frontend/my-frontend/package-lock.json /app/frontend/my-frontend/
# COPY frontend/my-frontend/public /app/frontend/my-frontend/public/
# COPY frontend/my-frontend/src /app/frontend/my-frontend/src/
# COPY frontend/my-frontend/tailwind.config.js /app/frontend/my-frontend/
# RUN npm install
# RUN npm run build

EXPOSE 10000
# EXPOSE 3001

# CMD ["sh", "-c", "cd /app/backend && npm start & cd /app/frontend/my-frontend && PORT=3001 npm start"]
CMD ["npm", "start"]