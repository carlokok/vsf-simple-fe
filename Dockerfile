# Dockerfile
FROM node:12.18.0-alpine AS build

WORKDIR /var/www

RUN apk update && apk upgrade
RUN apk add yarn

COPY . /var/www

RUN yarn install
RUN yarn build

FROM node:12.18.0-alpine AS final

WORKDIR /var/www

RUN apk update && apk upgrade
RUN apk add yarn

COPY --from=build /var/www/ .

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000

CMD [ "yarn", "start" ]