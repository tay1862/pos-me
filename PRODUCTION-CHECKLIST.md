# Production Readiness Checklist

## ✅ Pre-Deployment Checklist

### Security
- [ ] **เปลี่ยน PIN เริ่มต้น** - อย่าใช้ 1234, 1111, 2222, 3333
- [ ] **ตั้งรหัสผ่าน Database ที่แข็งแรง** - อย่างน้อย 16 ตัวอักษร
- [ ] **ตั้งค่า Firewall** - เปิดเฉพาะ port 22, 80, 443
- [ ] **ใช้ HTTPS** - ติดตั้ง SSL Certificate
- [ ] **ตรวจสอบ .env** - ไม่ commit ขึ้น Git

### Database
- [ ] **สร้าง Database** - PostgreSQL พร้อมใช้งาน
- [ ] **Run Migration** - `npx prisma db push`
- [ ] **Generate Client** - `npx prisma generate`
- [ ] **ลบข้อมูลตัวอย่าง** - หรือเพิ่มข้อมูลจริง
- [ ] **ตั้ง Auto Backup** - Backup ทุกวัน

### Application
- [ ] **Build สำเร็จ** - `npm run build` ไม่มี error
- [ ] **ทดสอบทุก Feature** - Login, Order, Kitchen, Reports
- [ ] **ทดสอบบนมือถือ** - ทุก screen ใช้งานได้
- [ ] **ตั้งค่า PM2** - Auto-restart on crash
- [ ] **ตั้งค่า Nginx** - Reverse proxy

### Performance
- [ ] **Database Indexing** - เพิ่ม index ที่จำเป็น
- [ ] **Connection Pooling** - ตั้งค่า Prisma connection limit
- [ ] **Nginx Caching** - Cache static files
- [ ] **Compression** - Enable gzip

### Monitoring
- [ ] **Setup Logging** - PM2 logs
- [ ] **Error Tracking** - ติดตั้ง Sentry (optional)
- [ ] **Uptime Monitoring** - UptimeRobot (optional)
- [ ] **Database Monitoring** - ดู query performance

## 🔒 Security Best Practices

### 1. Database Security

```bash
# ใช้รหัสผ่านที่แข็งแรง
# ตัวอย่างที่ดี:
DATABASE_URL="postgresql://pos_user:Kx9#mP2$vL8@wQ5!nR7&hT4^jY6*bN3@localhost:5432/pos_db"

# ตัวอย่างที่ไม่ดี:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pos_db"
```

### 2. Environment Variables

```bash
# .env (ห้าม commit!)
DATABASE_URL="postgresql://..."
NODE_ENV="production"
```

```bash
# .gitignore (ต้องมี)
.env
.env.local
.env.production
```

### 3. Firewall Rules

```bash
# Ubuntu/Debian
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 4. SSL/TLS Certificate

```bash
# ใช้ Let's Encrypt (ฟรี)
sudo certbot --nginx -d yourdomain.com
sudo certbot renew --dry-run  # ทดสอบ auto-renew
```

### 5. Regular Updates

```bash
# อัพเดท dependencies
npm update
npm audit fix

# อัพเดท system
sudo apt update
sudo apt upgrade
```

## 📊 Performance Optimization

### 1. Prisma Connection Pool

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 2. Nginx Configuration

```nginx
# /etc/nginx/sites-available/pos-system
server {
    listen 80;
    server_name yourdomain.com;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    gzip_min_length 1000;

    # Cache static files
    location /_next/static {
        alias /var/www/pos-system/.next/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

## 🔄 Backup Strategy

### 1. Database Backup Script

```bash
#!/bin/bash
# /usr/local/bin/backup-pos-db.sh

BACKUP_DIR="/backup/pos"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="pos_db"

mkdir -p $BACKUP_DIR

# Backup database
pg_dump $DB_NAME > $BACKUP_DIR/pos_${DATE}.sql

# Keep only last 7 days
find $BACKUP_DIR -name "pos_*.sql" -mtime +7 -delete

# Compress old backups
find $BACKUP_DIR -name "pos_*.sql" -mtime +1 -exec gzip {} \;
```

### 2. Cron Job

```bash
# crontab -e
0 2 * * * /usr/local/bin/backup-pos-db.sh
```

## 🚨 Troubleshooting

### Common Issues

**1. Port 3000 already in use:**
```bash
pm2 delete all
lsof -ti:3000 | xargs kill -9
pm2 start npm --name "pos" -- start
```

**2. Database connection failed:**
```bash
# ตรวจสอบ PostgreSQL
sudo systemctl status postgresql
sudo systemctl restart postgresql

# ทดสอบ connection
psql -U pos_user -d pos_db -h localhost
```

**3. Nginx 502 Bad Gateway:**
```bash
# ตรวจสอบ app ทำงานหรือไม่
pm2 status
pm2 logs pos

# Restart nginx
sudo systemctl restart nginx
```

**4. Out of memory:**
```bash
# เพิ่ม swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 📱 Testing Checklist

### Before Go-Live

- [ ] ทดสอบ Login ด้วย PIN ทุกตัว
- [ ] ทดสอบสร้างออเดอร์
- [ ] ทดสอบ Send to Kitchen
- [ ] ทดสอบ Kitchen Display อัพเดทสถานะ
- [ ] ทดสอบ Move Table
- [ ] ทดสอบ Split Bill
- [ ] ทดสอบ Payment
- [ ] ทดสอบ Reports
- [ ] ทดสอบบนมือถือ (iOS, Android)
- [ ] ทดสอบบนแท็บเล็ต
- [ ] ทดสอบ Offline behavior
- [ ] ทดสอบ Multiple concurrent users

## 🎯 Go-Live Checklist

### Day 1
- [ ] เปิดระบบในเวลาที่ไม่ยุ่ง
- [ ] มีพนักงานที่เข้าใจระบบอยู่ด้วย
- [ ] เตรียมระบบสำรอง (กระดาษ, ปากกา)
- [ ] Monitor logs อย่างใกล้ชิด

### Week 1
- [ ] รวบรวม feedback จากพนักงาน
- [ ] ตรวจสอบ performance
- [ ] ตรวจสอบ error logs
- [ ] ปรับปรุงตามความจำเป็น

## 📞 Support

หากมีปัญหา:
1. ตรวจสอบ logs: `pm2 logs pos`
2. ตรวจสอบ database connection
3. Restart app: `pm2 restart pos`
4. Restart nginx: `sudo systemctl restart nginx`
5. ตรวจสอบ disk space: `df -h`
6. ตรวจสอบ memory: `free -h`

---

**Remember:** 
- เปลี่ยน PIN เริ่มต้นทันที!
- Backup database ทุกวัน!
- Monitor logs เป็นประจำ!
- Update dependencies เป็นระยะ!
