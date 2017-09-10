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

# INPUT: Source folder of application here (Compatible with nodemon live reload)
#VOLUME /app/src

# OUTPUT: Build artefacts are output here
VOLUME /target

# OUTPUT: Test reports are output here
VOLUME /coverage

# Expose application port
EXPOSE 8080

# Default running command
CMD ["yarn", "dev"]

LABEL application=ci-nodejs-docker