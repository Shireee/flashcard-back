FROM node:20-alpine as build

ARG API_SERVICE_URL

ENV VITE_API_SERVICE_URL=${API_SERVICE_URL}

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM nginx:1.22-alpine as nginx

COPY --from=build /app/dist /usr/share/nginx/html/
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
