echo "开始同步配置文件"
mv ~/env.js ~/server-api/config/env.js
echo "配置文件同步完成"

echo "开始同步数据..."
echo "拉取最新的资源仓库"
git pull

echo "安装依赖"
npm install 

echo "启动项目"
pm2 restart online


