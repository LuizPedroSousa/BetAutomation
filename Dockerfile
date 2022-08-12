FROM node:14-alpine as common-build-stage

COPY . ./app

WORKDIR ./app

RUN mv ./scripts/api/init.sh / && chmod +x /init.sh && npm install

EXPOSE 3336

# Development build stage
FROM common-build-stage as development-build-stage

ENV NODE_ENV development

ENTRYPOINT ["/init.sh"]

# Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV production

CMD ["npm", "run", "start"]
