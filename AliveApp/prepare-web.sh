#!/bin/bash
# 部署前準備腳本：將 Web 版 package.json 複製為主要 package.json

echo "正在準備 Web 部署..."
cp package.web.json package.json
echo "✓ 已使用 Web 版 package.json"
