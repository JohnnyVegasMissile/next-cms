# # Step 1. Rebuild the source code only when needed
# FROM node:18-alpine AS builder

# WORKDIR /app

# # Install dependencies based on the preferred package manager
# COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# # Omit --production flag for TypeScript devDependencies
# RUN \
#   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
#   elif [ -f package-lock.json ]; then npm ci; \
#   elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
#   else echo "Lockfile not found." && exit 1; \
#   fi


# COPY . .

# # Environment variables must be present at build time
# # https://github.com/vercel/next.js/discussions/14030
# # ARG ENV_VARIABLE
# # ENV ENV_VARIABLE=${ENV_VARIABLE}
# # ARG NEXT_PUBLIC_ENV_VARIABLE
# # ENV NEXT_PUBLIC_ENV_VARIABLE=${NEXT_PUBLIC_ENV_VARIABLE}
# ARG SITE_URL
# ENV SITE_URL=${SITE_URL}
# ARG DATABASE_URL
# ENV DATABASE_URL=${DATABASE_URL}
# ARG PORT
# ENV PORT=${PORT}

# # Uncomment the following line to disable telemetry at build time
# ENV NEXT_TELEMETRY_DISABLED 1

# RUN npx prisma generate
# RUN npx prisma migrate deploy
# RUN npx prisma db push
# RUN npx prisma db seed

# RUN npm run build
# # RUN yarn build

# # Generate sitemap
# RUN npx next-sitemap

# # Step 2. Production image, copy all the files and run next
# FROM node:18-alpine AS runner

# WORKDIR /app

# # Don't run production as root
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# USER nextjs

# COPY --from=builder /app/public ./public
# COPY --from=builder /app/next.config.js .
# COPY --from=builder /app/package.json .

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# # Environment variables must be redefined at run time
# ARG SITE_URL
# ENV SITE_URL=${SITE_URL}
# ARG DATABASE_URL
# ENV DATABASE_URL=${DATABASE_URL}
# ARG PORT
# ENV PORT=${PORT}

# # Uncomment the following line to disable telemetry at run time
# ENV NEXT_TELEMETRY_DISABLED 1

# CMD node server.js

# ----------------------------------------------------------------------

# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
# https://github.dev/kachar/yadi

ARG BASE=node:16-alpine

#------ target dependencies

# Install dependencies only when needed
FROM ${BASE} AS dependencies

RUN apk update \
	&& apk add --no-cache openssl curl libc6-compat \
	&& rm -rf /var/lib/apt/lists/* \
	&& rm -rf /var/cache/apk/*

RUN openssl version && curl --version
RUN curl -sf https://gobinaries.com/tj/node-prune | sh

WORKDIR /app
COPY package.json yarn.lock ./
COPY prisma ./prisma

RUN yarn install --production=true --frozen-lockfile --ignore-scripts \
    && npx prisma generate \
    && node-prune \
    && cp -R node_modules prod_node_modules \
    && yarn install --production=false --prefer-offline \
    && npx prisma generate \
    && rm -rf prisma \
    && yarn cache clean
    
#------ target bulider

# Rebuild the source code only when needed
FROM ${BASE} AS builder
WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

# only for SSG pages
ARG ARG_DATABASE_URL
ENV DATABASE_URL=$ARG_DATABASE_URL

# NEXTAUTH_URL required at build time for CustomHead SEO
ARG ARG_NEXTAUTH_URL
ENV NEXTAUTH_URL=$ARG_NEXTAUTH_URL

# debug
RUN echo "DATABASE_URL=$DATABASE_URL"
RUN echo "NEXTAUTH_URL=$NEXTAUTH_URL"

# ENV DEBUG=*

# npx prisma migrate deploy && npx prisma db seed - not needed
# connect to existing db with data
# build reads DATABASE_URL env, and needs dev dependencies
RUN yarn build && rm -rf node_modules

#------ target production

# Production image, copy all the files and run next
FROM ${BASE} AS production
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=dependencies /app/prod_node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/.next ./.next
# use schema from container
COPY --from=builder --chown=node:node /app/prisma ./prisma

# volumes
COPY --from=builder --chown=node:node /app/uploads ./uploads

# in command in d-c.yml
RUN chmod 766 -R uploads

USER node

EXPOSE 3001
ENV PORT 3001

ENV NEXT_TELEMETRY_DISABLED 1

# run migrate and seed here
CMD ["yarn", "cmd:start:prod"]