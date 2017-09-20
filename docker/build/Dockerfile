FROM mhart/alpine-node
MAINTAINER Francisco Berrocal <eu@chicocode.io>

LABEL application=ci-nodejs-docker

WORKDIR /app

COPY docker/build/wait-for /
RUN apk update && chmod +x /wait-for

COPY app/package.json app/yarn.lock ./

RUN yarn install

COPY app .

ENTRYPOINT ["/wait-for", "db:5432", "--"]

CMD ["yarn", "dev"]

