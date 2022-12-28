FROM node:14-bullseye

RUN mkdir /app/

WORKDIR /app/

RUN chown node:node /app/

USER node

COPY --chown=node:node . /app/

RUN npm ci

USER root
RUN chown node:node -R /app/public/images

EXPOSE 3001

CMD ["npm", "run", "deploy"]
