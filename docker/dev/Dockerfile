FROM mhart/alpine-node
MAINTAINER Francisco Berrocal <eu@chicocode.io>

# extra tools support
RUN apk add --no-cache make gcc g++ python

# Application working directory
WORKDIR /app

# Copy package manifest
COPY app/package.json app/yarn.lock ./

# Run application dependency resolve
RUN yarn install

# Copy application
COPY app .

# Expose application port
EXPOSE 8080

# Default running command
CMD ["yarn", "dev"]

LABEL application=ci-nodejs-docker