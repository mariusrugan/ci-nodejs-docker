FROM mhart/alpine-node
MAINTAINER Francisco Berrocal <eu@chicocode.io>

# extra tools support
RUN apk add --no-cache make gcc g++ python

# Application working directory
WORKDIR /app

# Copy package tooling files
COPY app .

# Run application dependency resolve
RUN yarn install

# Expose application port
EXPOSE 8080

# Default running command
CMD ["yarn", "dev"]

LABEL application=ci-nodejs-docker