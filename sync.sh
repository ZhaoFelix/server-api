echo "开始同步数据..."
echo "拉取最新的资源仓库"
git pull
echo "安装依赖"
npm install 
echo "启动项目"
pm2 restart online


