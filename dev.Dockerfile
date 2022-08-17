# FROM node:18-alpine

# WORKDIR /app

# # Install dependencies based on the preferred package manager
# COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# RUN \
#   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
#   elif [ -f package-lock.json ]; then npm ci; \
#   elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
#   else echo "Lockfile not found." && exit 1; \
#   fi

# COPY . .

# RUN npx prisma generate
# # RUN npx prisma migrate dev
# # RUN npx prisma db seed

# CMD npx next dev


# ---------------------------------------------------------------


FROM node:18-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

COPY prisma ./prisma

RUN npm install
RUN npx prisma generate
RUN rm -rf prisma

# don't copy source, mount it via volume

# volumes folders must be created and chowned before docker-compose creates them as root
# create them during docker build
RUN mkdir -p .next
RUN chown node:node . node_modules .next
RUN chown -R node:node node_modules/.prisma

USER node

# debug
# RUN ls -la node_modules/.prisma/client

# EXPOSE 3001
# ENV PORT 3001

CMD npm run start:dev