# Deployment Guide

## Production Deployment

### Environment Variables

Create a production `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://your-mongodb-connection-string
JWT_SECRET=your-super-secure-jwt-secret-key
NODE_ENV=production
```

### Build for Production

1. **Build the React app**:
   ```bash
   cd client
   npm run build
   ```

2. **Serve static files from Express** (add to `server/index.js`):
   ```javascript
   // Serve static files from React build
   if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, '../client/build')));
     
     app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, '../client/build/index.html'));
     });
   }
   ```

### Deployment Options

#### Option 1: Traditional VPS/Server

1. **Install Node.js and MongoDB** on your server
2. **Clone the repository**
3. **Install dependencies**: `npm run install-all`
4. **Set up environment variables**
5. **Build the client**: `cd client && npm run build`
6. **Start with PM2**:
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name "sales-expense-app"
   pm2 startup
   pm2 save
   ```

#### Option 2: Heroku

1. **Create a Heroku app**
2. **Add MongoDB Atlas addon** or use external MongoDB
3. **Set environment variables** in Heroku dashboard
4. **Add build script** to root package.json:
   ```json
   {
     "scripts": {
       "heroku-postbuild": "cd client && npm install && npm run build"
     }
   }
   ```
5. **Deploy**: `git push heroku main`

#### Option 3: Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN npm run install-all

# Copy source code
COPY . .

# Build client
RUN cd client && npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server/index.js"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/sales_expense_db
      - JWT_SECRET=your-jwt-secret
      - NODE_ENV=production
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### Security Considerations

1. **Use HTTPS** in production
2. **Set secure JWT secret** (64+ characters)
3. **Enable CORS** only for your domain
4. **Use environment variables** for all secrets
5. **Regular security updates**
6. **Database backups**
7. **Rate limiting** for API endpoints

### Performance Optimization

1. **Enable gzip compression**
2. **Use CDN** for static assets
3. **Database indexing**
4. **Caching strategies**
5. **Load balancing** for high traffic

### Monitoring

1. **Application logs**
2. **Database monitoring**
3. **Error tracking** (Sentry, etc.)
4. **Performance monitoring**
5. **Uptime monitoring**