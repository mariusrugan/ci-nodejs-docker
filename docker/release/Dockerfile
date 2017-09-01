FROM mhart/alpine-node AS dependency
MAINTAINER Francisco Berrocal <eu@chicocode.io>

# Application working directory
WORKDIR /application

# Copy package dependency manifest
COPY package.json yarn.lock ./

# Run application dependency resolve
RUN yarn install --production

# Multi stage build
FROM alpine:3.6

# Copy build binaries
COPY --from=dependency /usr/bin/node /usr/bin/
COPY --from=dependency /usr/lib/libgcc* /usr/lib/libstdc* /usr/lib/

# Application working directory
WORKDIR /application

# Copy artifacts from previous build
COPY --from=dependency /application .

# Copy application source
COPY src src

EXPOSE 8080

CMD ["node", "-r", "@std/esm", "src/index.js"]

LABEL application=ci-nodejs-docker