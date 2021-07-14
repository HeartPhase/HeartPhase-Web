FROM node:14.17
WORKDIR /docker_env
COPY . .
RUN npm install
RUN npm install -g forever
CMD ["sh", "refresh.sh"]