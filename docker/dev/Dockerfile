FROM mhart/alpine-node
MAINTAINER Francisco Berrocal <eu@chicocode.io>

LABEL application=ci-nodejs-docker

WORKDIR /app

COPY docker/dev/wait-for /
RUN apk update && chmod +x /wait-for

COPY app ./

RUN yarn install --emoji

VOLUME /app/src

ENTRYPOINT ["/wait-for", "db:5432", "--"]

CMD ["yarn", "dev"]
