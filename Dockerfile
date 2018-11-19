FROM node:9

RUN mkdir /src

WORKDIR /src

## Install packages using NPM 5 (bundled with the node:9 image)
COPY ./leaderboard/package.json /src/package.json
#COPY ./package-lock.json /src/package-lock.json
RUN npm config delete proxy
RUN npm install

## Add application code
COPY ./leaderboard/client /src/client
COPY ./leaderboard/server /src/server
COPY ./leaderboard/leaderboard.css /src/leaderboard.css
COPY ./leaderboard/index.html /src/index.html
COPY ./leaderboard/demo.gif /src/demo.gif
COPY ./leaderboard/start.sh /src/start.sh

## Set environment to "development" by default
ENV NODE_ENV development

## Allows port 3000 to be publicly available
EXPOSE 80

## The command uses nodemon to run the application
CMD ["./start.sh"]
