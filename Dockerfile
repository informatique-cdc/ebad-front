FROM node:20-alpine as builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM bitnami/nginx:1.23
COPY --from=builder /app/dist/ebad-front/ ./
COPY nginx.conf /opt/bitnami/nginx/conf/server_blocks/

