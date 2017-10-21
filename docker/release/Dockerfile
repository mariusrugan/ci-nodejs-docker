FROM mhart/alpine-node AS dependency
MAINTAINER Francisco Berrocal <eu@chicocode.io>

WORKDIR /wdr/application

COPY package/package.json package/yarn.lock ./

RUN yarn install --production --emoji

FROM alpine:3.6

COPY --from=dependency /usr/bin/node /usr/bin/
COPY --from=dependency /usr/lib/libgcc* /usr/lib/libstdc* /usr/lib/

WORKDIR /wdr/application

COPY --from=dependency /wdr/application .
RUN mv /wdr/application/package.json /wdr/package.json

COPY package .

CMD ["node", "index.js"]

LABEL application=ci-nodejs-docker
