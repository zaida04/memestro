FROM memestro/base as API_BUILD_IMAGE
WORKDIR /usr/app

COPY ./services/api/package.json ./services/api/tsconfig.json ./services/api/nodemon.json services/api/
RUN yarn install
COPY ./services/api/src/. services/api/src/
RUN cd services/api && yarn run build

WORKDIR /usr/app/services/api
CMD [ "yarn", "run", "start" ]