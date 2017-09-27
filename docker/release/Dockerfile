FROM mhart/alpine-node AS dependency
MAINTAINER Francisco Berrocal <eu@chicocode.io>

WORKDIR /application

COPY package/package.json package/yarn.lock ./

RUN yarn install --production --emoji

FROM alpine:3.6

COPY --from=dependency /usr/bin/node /usr/bin/
COPY --from=dependency /usr/lib/libgcc* /usr/lib/libstdc* /usr/lib/

WORKDIR /application

COPY --from=dependency /application .

COPY package .

EXPOSE 8080

CMD ["node", "index.js"]

LABEL application=ci-nodejs-docker