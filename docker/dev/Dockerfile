FROM mhart/alpine-node
MAINTAINER Francisco Berrocal <eu@chicocode.io>

# Application working directory
WORKDIR /app

# Copy package dependency manifest
COPY app/package.json app/yarn.lock ./

# Run application dependency resolve
RUN yarn install

# INPUT: Source folder of application here (Compatible with nodemon live reload)
VOLUME /app

# OUTPUT: Build artefacts are output here
VOLUME /target

# OUTPUT: Test reports are output here
VOLUME /coverage

# Expose application port
EXPOSE 8080

# Default running command
CMD ["yarn", "dev"]

LABEL application=ci-nodejs-docker