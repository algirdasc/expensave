FROM node:16-alpine AS frontend-builder
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install -g npm@latest
RUN npm install --include=dev
RUN npm run build

FROM nginx:alpine
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY ./build/nginx/vhost.conf /etc/nginx/conf.d/vhost.conf
COPY --from=frontend-builder /usr/src/app/dist /usr/src/app
