FROM node:16 as base

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

FROM base as test
RUN npm ci
COPY . .
RUN npm run test


FROM base as prod
COPY . .
ARG environment=development
ENV NODE_ENV=$environment
EXPOSE 4003
CMD ["node", "index.js" ]