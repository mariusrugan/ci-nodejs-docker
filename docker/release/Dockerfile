FROM mhart/alpine-node AS dependency
MAINTAINER Francisco Berrocal <eu@chicocode.io>

WORKDIR /application

COPY artifactory/package.json artifactory/yarn.lock ./

RUN yarn install --production

FROM alpine:3.6

COPY --from=dependency /usr/bin/node /usr/bin/
COPY --from=dependency /usr/lib/libgcc* /usr/lib/libstdc* /usr/lib/

WORKDIR /application

COPY --from=dependency /application .

COPY artifactory .

EXPOSE 8080

CMD ["node", "index.js"]

LABEL application=ci-nodejs-docker