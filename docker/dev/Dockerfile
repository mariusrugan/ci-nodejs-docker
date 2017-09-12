FROM mhart/alpine-node
MAINTAINER Francisco Berrocal <eu@chicocode.io>

# extra tools support
RUN apk add --no-cache make gcc g++ python

# Application working directory
WORKDIR /app

# Copy package manifest & wait-for script
COPY app/package.json app/yarn.lock docker/dev/wait-for ./

# Run application dependency resolve
RUN yarn install

# Expose application port
EXPOSE 8080

# Copy application
COPY app .

# Set entrypoint to wait for
ENTRYPOINT ["./wait-for", "db:5432", "--"]

# Default running command
CMD ["yarn", "dev"]

LABEL application=ci-nodejs-docker