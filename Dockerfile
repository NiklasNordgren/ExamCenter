# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:10 as build-stage

COPY ./nginx.conf /nginx.conf

RUN openssl req -newkey rsa:2048 -nodes -keyout ./examcentre.key -x509 -days 365 -out ./examcentre.crt

RUN .
RUN .
RUN .
RUN .
RUN .
RUN .
RUN .

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

COPY --from=build-stage /examcentre.crt /etc/ssl/examcentre.crt
COPY --from=build-stage /examcentre.key /etc/ssl/examcentre.key

CMD ["nginx", "-g", "daemon off;"]