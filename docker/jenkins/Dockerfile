FROM jenkins/jenkins
MAINTAINER Francisco Berrocal <eu@chicocode.io>

# Change to root user
USER root

# Docker and Docker Compose versions installed
ARG DOCKER=17.06.2-ce
ARG DOCKER_COMPOSE=1.16.1

COPY entrypoint.sh /
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt

# Install docker, docker compose & dos2unix, sudo
RUN set -x && \
 apk update && \
 curl -fsSLO https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKER:-17.06.2-ce}.tgz && \
 tar --strip-components=1 -xvzf docker-${DOCKER:-17.06.2-ce}.tgz -C /usr/local/bin && \
 apk --no-cache add --update --repository http://dl-3.alpinelinux.org/alpine/edge/community/ dos2unix shadow && \
 apk add sudo && \
 dos2unix /usr/share/jenkins/ref/plugins.txt && \
 /usr/local/bin/install-plugins.sh < /usr/share/jenkins/ref/plugins.txt && \
 dos2unix /entrypoint.sh && apk del dos2unix && \
 chmod 755 /entrypoint.sh && \
 apk add --no-cache -t .deps ca-certificates curl && \
 GLIBC_VERSION='2.23-r3' && \
 curl -Lo /etc/apk/keys/sgerrand.rsa.pub https://raw.githubusercontent.com/sgerrand/alpine-pkg-glibc/master/sgerrand.rsa.pub && \
 curl -Lo glibc.apk https://github.com/sgerrand/alpine-pkg-glibc/releases/download/$GLIBC_VERSION/glibc-$GLIBC_VERSION.apk && \
 curl -Lo glibc-bin.apk https://github.com/sgerrand/alpine-pkg-glibc/releases/download/$GLIBC_VERSION/glibc-bin-$GLIBC_VERSION.apk && \
 apk update && \
 apk add glibc.apk glibc-bin.apk && \
 rm -rf /var/cache/apk/* && \
 rm glibc.apk glibc-bin.apk && \
 apk del .deps && \
 apk add --no-cache -t .deps ca-certificates curl && \
 DOCKER_COMPOSE_URL=https://github.com$(curl -L https://github.com/docker/compose/releases/latest | grep -Eo 'href="[^"]+docker-compose-Linux-x86_64' | sed 's/^href="//') && \
 curl -Lo /usr/local/bin/docker-compose $DOCKER_COMPOSE_URL && \
 chmod a+rx /usr/local/bin/docker-compose && \
 docker-compose version && \
 apk del .deps

ENTRYPOINT ["/bin/bash","-c","./entrypoint.sh"]

ENV JAVA_OPTS -Dhudson.model.DirectoryBrowserSupport.CSP=""