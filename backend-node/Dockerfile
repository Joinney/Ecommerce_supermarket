# Sử dụng node phiên bản nhẹ
FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy file quản lý thư viện trước để tối ưu cache
COPY package*.json ./

# Cài đặt thư viện
RUN npm install

# Copy toàn bộ code vào
COPY . .

# Mở cổng 5000 (khớp với .env của Demi)
EXPOSE 5000

# Thay vì CMD ["npm", "run", "dev"]
CMD ["npx", "nodemon", "server.js"]