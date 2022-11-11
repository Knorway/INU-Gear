FROM node:16
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY ./ ./
RUN yarn prisma generate
CMD [ "yarn", "dev" ]