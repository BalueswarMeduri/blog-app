# client/Dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# --- Define Build Arguments for Vite ---
ARG VITE_BACKEND
ARG VITE_FIREBASE_URL

# --- Set them as Environment Variables during build ---
ENV VITE_BACKEND=$VITE_BACKEND
ENV VITE_FIREBASE_URL=$VITE_FIREBASE_URL

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]