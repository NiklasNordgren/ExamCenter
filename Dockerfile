# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:10 as build-stage

COPY ./nginx.conf /nginx.conf

RUN openssl req -x509 -newkey rsa:2048 -nodes -keyout ./localhost.key -subj "/C=SE/ST=CA/L=SF/O=hig/CN=localhost" -days 365 -out ./localhost.crt 

WORKDIR /app

COPY package.json /app/package.json

RUN npm install

RUN npm install -g @angular/cli

COPY ./ /app/

# RUN npm run test --browsers ChromeHeadlessNoSandbox --watch=false

RUN ng build --prod --output-path=dist

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /localhost.crt /etc/ssl/localhost.crt
COPY --from=build-stage /localhost.key /etc/ssl/localhost.key

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]