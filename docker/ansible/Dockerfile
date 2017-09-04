FROM alpine
MAINTAINER Francisco Berrocal <eu@chicocode.io>

RUN apk add --no-cache ansible

COPY delay.yml /ansible/delay.yml

WORKDIR /ansible

ENTRYPOINT ["ansible-playbook"]
CMD ["delay.yml"]