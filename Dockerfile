# multi-stage build for React/Vite app
FROM node:20-alpine AS build
WORKDIR /app
# install dependencies
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

# production image served by nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# custom nginx configuration to handle SPA routing if necessary
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
