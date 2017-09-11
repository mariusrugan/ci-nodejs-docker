FROM jenkins/jenkins
MAINTAINER Francisco Berrocal <eu@chicocode.io>

# Change to root user
USER root

# Docker and Docker Compose versions installed
ARG DOCKER=17.06.2-ce
ARG DOCKER_COMPOSE=1.16.1

# Install docker
RUN curl -fsSLO https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKER:-17.06.2-ce}.tgz && \
 tar --strip-components=1 -xvzf docker-${DOCKER:-17.06.2-ce}.tgz -C /usr/local/bin

# Install docker compose
RUN curl -L https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE:-1.16.1}/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
RUN chmod +x /usr/local/bin/docker-compose

# Install dos2unix
RUN apt-get update && apt-get install -y dos2unix

# Add Jenkins plugins
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt

# Fix line endings before install plugins
RUN dos2unix /usr/share/jenkins/ref/plugins.txt && apt-get --purge remove -y dos2unix && rm -rf /var/lib/apt/lists/*

# Install jenkins plugins
RUN /usr/local/bin/install-plugins.sh < /usr/share/jenkins/ref/plugins.txt

# Add jenkins user to docker group to enable docker cli for Jenkins
RUN addgroup --system docker && adduser jenkins docker && newgrp docker

ENV JAVA_OPTS -Dhudson.model.DirectoryBrowserSupport.CSP=""

# Change back to jenkins user
USER jenkins