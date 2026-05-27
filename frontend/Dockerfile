# ==========================================
# STAGE 1: BUILD FRONTEND (Node Alpine)
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Dùng npm ci để cài thư viện siêu tốc theo file lock
COPY package*.json ./
RUN npm ci

COPY . .

# Nhận biến API URL truyền từ docker-compose sang để nạp lúc build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ==========================================
# STAGE 2: RUNTIME NGINX (Chính thức Production)
# ==========================================
FROM nginx:1.27-alpine AS runtime

# Xóa config default cũ của Nginx
RUN rm /etc/nginx/conf.d/default.conf

# 👉 CHỐT HẠ: Copy file cấu hình nginx.conf từ bên ngoài vào trong image
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy thư mục tĩnh 'dist' sinh ra từ Vite sang Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]