#!/bin/bash

# POS System - VPS Deployment Script
# Usage: bash deploy.sh

set -e

echo "🚀 Starting POS System Deployment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="pos-system"
APP_DIR="/var/www/$APP_NAME"
DB_NAME="pos_db"
DB_USER="pos_user"

echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
sudo apt update
sudo apt install -y nodejs npm postgresql postgresql-contrib nginx certbot python3-certbot-nginx

echo -e "${YELLOW}Step 2: Setting up PostgreSQL...${NC}"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database already exists"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD 'CHANGE_THIS_PASSWORD';" 2>/dev/null || echo "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo -e "${YELLOW}Step 3: Installing application...${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR
cd $APP_DIR

# If you're using git
# git clone <your-repo-url> .

npm install

echo -e "${YELLOW}Step 4: Setting up environment...${NC}"
cat > .env << EOF
DATABASE_URL="postgresql://$DB_USER:CHANGE_THIS_PASSWORD@localhost:5432/$DB_NAME"
NODE_ENV="production"
EOF

echo -e "${RED}⚠️  IMPORTANT: Edit .env and change the database password!${NC}"

echo -e "${YELLOW}Step 5: Database migration...${NC}"
npx prisma db push
npx prisma generate

echo -e "${YELLOW}Step 6: Building application...${NC}"
npm run build

echo -e "${YELLOW}Step 7: Installing PM2...${NC}"
sudo npm install -g pm2

echo -e "${YELLOW}Step 8: Starting application...${NC}"
pm2 start npm --name "$APP_NAME" -- start
pm2 save
pm2 startup | tail -n 1 | sudo bash

echo -e "${YELLOW}Step 9: Setting up Nginx...${NC}"
sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo -e "${YELLOW}Step 10: Setting up firewall...${NC}"
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
echo "y" | sudo ufw enable

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Edit .env and change the database password"
echo "2. Restart the app: pm2 restart $APP_NAME"
echo "3. If you have a domain, run: sudo certbot --nginx -d yourdomain.com"
echo "4. Change default PINs in Admin > Employees"
echo "5. Add your menu items in Admin > Menu"
echo ""
echo "Useful commands:"
echo "  pm2 logs $APP_NAME    - View logs"
echo "  pm2 restart $APP_NAME - Restart app"
echo "  pm2 monit             - Monitor app"
echo ""
echo "Access your POS system at: http://$(curl -s ifconfig.me)"
