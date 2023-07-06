FROM node:16-alpine AS frontend-builder
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install -g npm@latest
RUN npm install --include=dev
RUN npm run build

FROM nginx:alpine
EXPOSE 4200
COPY build/nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=frontend-builder /usr/src/app/dist /usr/share/nginx/html
