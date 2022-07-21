FROM node:14.17.5
ENV NODE_ENV=prod

WORKDIR /usr/app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

CMD ["npm", "run", "start-build"]