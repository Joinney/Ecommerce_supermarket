# Stage 1: Build ứng dụng
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Dùng Nginx để chạy bản Build
FROM nginx:alpine
# Copy file build từ Stage 1 sang thư mục của Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Mở cổng 80 (cổng của Frontend)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]