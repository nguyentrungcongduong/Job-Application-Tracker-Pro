FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Nhận biến môi trường từ lệnh build-arg
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# QUAN TRỌNG: Phải chạy build mới có code
RUN npm run build

FROM nginx:alpine
# Copy code đã build
COPY --from=build /app/dist /usr/share/nginx/html
# QUAN TRỌNG: Copy cấu hình nginx để fix lỗi 404 khi F5
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]