FROM node:20-alpine as dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install 

FROM node:20-alpine as build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ARG REACT_APP_API_URL=/api
ARG REACT_APP_WS_URL=/ws
ARG REACT_APP_ENV=production
ARG REACT_APP_DEBUG=false

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_WS_URL=$REACT_APP_WS_URL
ENV REACT_APP_ENV=$REACT_APP_ENV
ENV REACT_APP_DEBUG=$REACT_APP_DEBUG
RUN npm run build

FROM nginx:alpine as runtime
WORKDIR /app
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]