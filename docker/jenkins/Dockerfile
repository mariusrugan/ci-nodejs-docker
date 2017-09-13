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
RUN apt-get update && \
 curl -fsSLO https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKER:-17.06.2-ce}.tgz && \
 tar --strip-components=1 -xvzf docker-${DOCKER:-17.06.2-ce}.tgz -C /usr/local/bin && \
 curl -L https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE:-1.16.1}/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose && \
 chmod +x /usr/local/bin/docker-compose && \
 apt-get install -y dos2unix sudo && \
 dos2unix /usr/share/jenkins/ref/plugins.txt && \
 /usr/local/bin/install-plugins.sh < /usr/share/jenkins/ref/plugins.txt && \
 dos2unix /entrypoint.sh && apt-get --purge remove -y dos2unix && rm -rf /var/lib/apt/lists/* && \
 chmod 755 /entrypoint.sh

ENTRYPOINT ["/bin/bash","-c","./entrypoint.sh"]

ENV JAVA_OPTS -Dhudson.model.DirectoryBrowserSupport.CSP=""