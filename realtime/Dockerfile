# ============================================
# REALTIME DOCKERFILE - Compatible with npm v11
# ============================================

FROM node:20-alpine AS development

WORKDIR /app

RUN apk add --no-cache dumb-init

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 1234

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start:dev"]

# ==========================================
# PRODUCTION STAGE
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY src ./src

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache dumb-init
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

USER nodejs
EXPOSE 1234

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
