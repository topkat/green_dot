# # FROM node:18 AS builder
# FROM node:18

# RUN curl -fsSL https://bun.sh/install | bash

# ENV BUN_INSTALL="/root/.bun"
# ENV PATH="$BUN_INSTALL/bin:$PATH"

# WORKDIR /app

# COPY package.json .
# # COPY package-lock.json* .
# COPY turbo.json .

# COPY . .

# RUN rm -rf node_modules
# # RUN rm package-lock.json


# RUN yarn add turbo@1.10.0 --dev -W

# RUN yarn add typescript@5.2.2 --dev -W

# RUN yarn install

# RUN yarn build:prod

# # FROM node:18-alpine

# # COPY --from=builder /app/apps/backend/dist /app/dist
# # COPY --from=builder /app/node_modules /app/node_modules
# # COPY --from=builder /app/package.json /app/package.json

# # WORKDIR /app

# # RUN yarn

# EXPOSE 9086

# CMD ["node","apps/backend/dist/app.js"]



# FROM node:18 AS builder

# WORKDIR /app

# COPY . .

# RUN yarn install

# RUN yarn build:prod

# FROM node:18 AS runtime

# WORKDIR /app

# COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json

# COPY --from=builder /app/packages ./packages
# COPY --from=builder /app/db ./db

# COPY --from=builder /app/dist-files.tar ./

# RUN tar -xf dist-files.tar && rm dist-files.tar

# EXPOSE 9086

# CMD ["node","apps/backend/dist/app.js"]

# COPY --from=builder /app/apps/backend/dist ./dist

# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/apps/backend/package.json ./package.json
# COPY --from=builder /app/yarn.lock ./yarn.lock

# COPY --from=builder /app/packages/appConfigShared/dist ./packages/appConfigShared/dist
# COPY --from=builder /app/packages/backend-db-shared/dist ./packages/backend-db-shared/dist
# COPY --from=builder /app/packages/backend-sdk-helpers/dist ./packages/backend-sdk-helpers/dist
# COPY --from=builder /app/packages/backend-shared/dist ./packages/backend-shared/dist
# COPY --from=builder /app/packages/core-backend/dist ./packages/core-backend/dist

# COPY --from=builder /app/SDKs ./SDKs
# COPY --from=builder /app/db ./db

FROM node:18 

WORKDIR /app

COPY package.json .
COPY package-lock.json* .
COPY turbo.json .

COPY . .

RUN rm -rf node_modules

RUN yarn install

RUN yarn build:prod

EXPOSE 9086

CMD ["node","apps/backend/dist/app.js"]