FROM node:18-slim

WORKDIR /usr/src/app
COPY ./compiled ./compiled
RUN chmod +x compiled/main

EXPOSE 3000
ENTRYPOINT ["./compiled/main"]