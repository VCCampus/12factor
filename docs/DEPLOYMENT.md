# 部署文档 - 3C数创学习平台

**版本**: 1.0.0  
**最后更新**: 2025-08-28  
**技术栈**: Vue 3 + Vite + TypeScript + Tailwind CSS + PWA

## 📋 部署前准备

### 系统要求
- Node.js >= 18.0.0
- npm >= 9.0.0
- 支持现代JavaScript的Web服务器

### 浏览器兼容性
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 部署步骤

### 1. 克隆代码库
```bash
git clone https://github.com/VCCampus/12factor.git
cd 12factor/vue
```

### 2. 安装依赖
```bash
npm install
```

### 3. 构建生产版本
```bash
npm run build
```
构建产物将生成在 `dist/` 目录。

### 4. 部署到静态服务器

#### Nginx配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    
    # PWA支持
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, must-revalidate";
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Service Worker
    location /sw.js {
        add_header Cache-Control "no-cache";
        add_header Service-Worker-Allowed "/";
    }
    
    # Manifest
    location /manifest.json {
        add_header Content-Type "application/manifest+json";
    }
    
    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
```

#### Apache配置示例
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/dist
    
    <Directory /path/to/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # 启用重写引擎
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # 缓存配置
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
        Header set Cache-Control "max-age=31536000, public, immutable"
    </FilesMatch>
    
    # Service Worker
    <Files "sw.js">
        Header set Cache-Control "no-cache"
    </Files>
</VirtualHost>
```

### 5. 云平台部署

#### Vercel
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

#### Netlify
```bash
# 安装Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy --prod --dir=dist
```

#### GitHub Pages
```bash
# 修改vite.config.ts中的base路径
# base: '/12factor/'

# 构建并部署
npm run build
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

## 📊 性能优化

### 构建优化结果
- **构建时间**: 12.26秒
- **Bundle大小**:
  - Vendor: 154.97 KB (gzip: 58.16 KB)
  - Main: 28.90 KB (gzip: 9.67 KB)
  - CSS: 30.15 KB (gzip: 5.39 KB)
- **总计**: ~214 KB (gzip: ~73 KB)

### 性能指标
- **首屏加载**: < 3秒 (3G网络)
- **页面切换**: < 500ms
- **离线可用**: 100%核心功能
- **PWA评分**: > 90分

## 🔍 验证部署

### 功能检查清单
- [ ] 首页正常加载
- [ ] 原则页面可访问
- [ ] 闪卡功能正常
- [ ] 测试功能可用
- [ ] 分析页面显示
- [ ] 成就系统工作
- [ ] 数据导出功能
- [ ] PWA安装提示
- [ ] 离线模式可用
- [ ] 响应式布局正常

### 性能测试
```bash
# 使用Lighthouse测试
lighthouse https://your-domain.com --view

# 使用WebPageTest
curl -X POST "https://www.webpagetest.org/runtest.php?url=your-domain.com&f=json"
```

## 🛠️ 维护和监控

### 日志监控
- 检查浏览器控制台错误
- 监控Service Worker状态
- 跟踪缓存命中率

### 更新部署
1. 更新代码
2. 修改版本号
3. 重新构建：`npm run build`
4. 部署新版本
5. Service Worker将自动更新缓存

### 回滚步骤
```bash
# 切换到上一个版本
git checkout [previous-version-tag]

# 重新构建
npm install
npm run build

# 部署
# [根据你的部署方式]
```

## 📱 PWA配置

### Service Worker更新
Service Worker采用自动更新策略：
- 用户刷新页面时检查更新
- 发现新版本时提示用户
- 用户确认后立即更新

### 离线策略
- **静态资源**: 预缓存核心文件
- **数据文件**: 首次加载后缓存
- **API请求**: 缓存优先，失败时使用网络

## 🔐 安全建议

1. **启用HTTPS**: PWA功能需要HTTPS
2. **设置CSP头部**: 防止XSS攻击
3. **限制CORS**: 仅允许必要的跨域请求
4. **定期更新依赖**: 修复安全漏洞

## 🆘 故障排除

### 常见问题

#### 1. Service Worker未注册
- 确保HTTPS环境
- 检查sw.js路径
- 清除浏览器缓存

#### 2. 离线模式不工作
- 检查缓存配置
- 验证manifest.json
- 重新安装PWA

#### 3. 构建失败
- 删除node_modules重新安装
- 清除缓存：`npm cache clean --force`
- 检查Node.js版本

## 📞 支持联系

- GitHub Issues: https://github.com/VCCampus/12factor/issues
- 技术文档: /opt/src/12factor/docs/

---
*部署文档版本: 1.0.0*  
*生成时间: 2025-08-28*