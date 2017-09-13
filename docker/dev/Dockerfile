FROM mhart/alpine-node
MAINTAINER Francisco Berrocal <eu@chicocode.io>

COPY docker/dev/wait-for ./

RUN chmod +x ./wait-for & chmod 775 ./wait-for

WORKDIR /app

COPY app/package.json app/yarn.lock docker/dev/wait-for ./

RUN yarn install

COPY app .

ENTRYPOINT ["./wait-for", "db:5432", "--"]

CMD ["yarn", "dev"]

LABEL application=ci-nodejs-docker