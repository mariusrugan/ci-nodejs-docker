FROM mhart/alpine-node
MAINTAINER Francisco Berrocal <eu@chicocode.io>

LABEL application=ci-nodejs-docker

COPY docker/dev/wait-for ./
RUN chmod +x ./wait-for

WORKDIR /app

COPY app/package.json app/yarn.lock ./

RUN yarn install

COPY app .

ENTRYPOINT ["./wait-for", "db:5432", "--"]

CMD ["yarn", "dev"]

