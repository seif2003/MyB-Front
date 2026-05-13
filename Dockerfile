FROM node:22-alpine

ARG API_HOST=http://localhost:3000

WORKDIR /app

COPY package*.json ./
# Allow legacy peer dependency resolution to avoid build-time peer conflicts in CI/docker
RUN npm config set legacy-peer-deps true && npm ci

COPY . .

# Create env.json with API_HOST from build arg or .env
RUN if [ -f .env ]; then \
  API_HOST=$(grep '^API_HOST=' .env | cut -d'=' -f2 || echo "$API_HOST"); \
  else \
  API_HOST="$API_HOST"; \
  fi && \
  echo "{\"API_HOST\":\"${API_HOST}\"}" > public/env.json

EXPOSE 4200

CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4200"]