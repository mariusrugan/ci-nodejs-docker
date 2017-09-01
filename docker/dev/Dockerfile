FROM mhart/alpine-node
MAINTAINER Francisco Berrocal <eu@chicocode.io>

# Application working directory
WORKDIR /application

# Copy package dependency manifest
COPY package.json yarn.lock ./

# Run application dependency resolve
RUN yarn install

# Source folder of application as volume (Compatible with nodemon live reload)
VOLUME ["src"]

# Copy source application
COPY src src

# Expose application port
EXPOSE 8080

# Default running command
CMD ["yarn", "test"]

LABEL application=ci-nodejs-docker