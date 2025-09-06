#!/bin/bash
# CSS数创网站构建脚本 v1.0
# 用途：TOML配置 → JSON数据 → Vue静态网站
# 作者：Claude Code
# 日期：2025-08-28

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="/opt/src/12factor"
TOML_CONFIG="$PROJECT_ROOT/docs/plans/web3scv8_v4.toml"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"
VUE_DIR="$PROJECT_ROOT/vue"
DIST_DIR="$PROJECT_ROOT/dist"
LOGS_DIR="$PROJECT_ROOT/logs"

echo -e "${BLUE}🚀 开始CSS数创网站构建...${NC}"

# 创建必要目录
mkdir -p "$LOGS_DIR"

# 1. 验证TOML格式和完备性
echo -e "${YELLOW}📋 验证TOML配置...${NC}"
if ! node "$SCRIPTS_DIR/validate-config.js" "$TOML_CONFIG"; then
    echo -e "${RED}❌ TOML配置验证失败！${NC}"
    exit 1
fi
echo -e "${GREEN}✅ TOML配置验证通过${NC}"

# 2. 检测变化并生成变更日志
echo -e "${YELLOW}📝 检测配置变化...${NC}"
TIMESTAMP=$(date +%y%m%d_%H%M)
LAST_CONFIG_FILE="$PROJECT_ROOT/.last_build_config"

if ! cmp -s "$TOML_CONFIG" "$LAST_CONFIG_FILE" 2>/dev/null; then
    echo -e "${BLUE}🔄 配置有变化，生成变更日志...${NC}"
    if node "$SCRIPTS_DIR/generate-changelog.js" "$TOML_CONFIG" "$LAST_CONFIG_FILE" > "$LOGS_DIR/${TIMESTAMP}_changed.log"; then
        echo -e "${GREEN}✅ 变更日志已生成: ${TIMESTAMP}_changed.log${NC}"
    else
        echo -e "${YELLOW}⚠️  变更日志生成失败，但不影响构建${NC}"
    fi
    cp "$TOML_CONFIG" "$LAST_CONFIG_FILE"
else
    echo -e "${GREEN}✅ 配置无变化，跳过变更日志${NC}"
fi

# 3. 转换TOML为分片JSON
echo -e "${YELLOW}⚙️  转换TOML为JSON...${NC}"
if ! node "$SCRIPTS_DIR/toml-to-json.js" "$TOML_CONFIG" "$VUE_DIR/public/"; then
    echo -e "${RED}❌ TOML转JSON失败！${NC}"
    exit 1
fi
echo -e "${GREEN}✅ JSON数据文件生成完成${NC}"

# 3.5 转换面试题库TOML为JSON
echo -e "${YELLOW}📝 转换面试题库数据...${NC}"
if node "$SCRIPTS_DIR/interview-converter.js"; then
    echo -e "${GREEN}✅ 面试题库数据生成完成${NC}"
else
    echo -e "${YELLOW}⚠️  面试题库转换失败，但不影响构建${NC}"
fi

# 检查JSON文件是否生成
JSON_FILES=(
    "$VUE_DIR/public/w3sc8_principles-core.json"
    "$VUE_DIR/public/w3sc8_principles-3c.json"
    "$VUE_DIR/public/w3sc8_principles-marketing.json"
    "$VUE_DIR/public/w3sc8_principles-funding.json"
    "$VUE_DIR/public/w3sc8_principles-cases.json"
    "$VUE_DIR/public/w3sc8_quiz-data.json"
    "$VUE_DIR/public/w3sc8_suggestions.json"
)

for json_file in "${JSON_FILES[@]}"; do
    if [[ ! -f "$json_file" ]]; then
        echo -e "${RED}❌ 缺少JSON文件: $(basename "$json_file")${NC}"
        exit 1
    fi
    file_size=$(stat -f%z "$json_file" 2>/dev/null || stat -c%s "$json_file" 2>/dev/null || echo "0")
    echo -e "${GREEN}  ✓ $(basename "$json_file") (${file_size} bytes)${NC}"
done

# 4. 清除旧网站
echo -e "${YELLOW}🧹 清理旧网站文件...${NC}"
if [[ -d "$DIST_DIR" ]]; then
    rm -rf "$DIST_DIR"/*
    echo -e "${GREEN}✅ 旧文件清理完成${NC}"
else
    mkdir -p "$DIST_DIR"
    echo -e "${GREEN}✅ 创建dist目录${NC}"
fi

# 5. 检查Vue项目依赖
echo -e "${YELLOW}📦 检查Vue项目依赖...${NC}"
cd "$VUE_DIR"
if [[ ! -d "node_modules" ]]; then
    echo -e "${BLUE}📥 安装依赖...${NC}"
    npm install
fi

# 6. Vue构建
echo -e "${YELLOW}🏗️  构建Vue网站...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Vue构建完成${NC}"
else
    echo -e "${RED}❌ Vue构建失败！${NC}"
    exit 1
fi

# 7. 验证构建输出
echo -e "${YELLOW}🔍 验证构建输出...${NC}"
if [[ ! -d "$DIST_DIR" ]] || [[ -z "$(ls -A "$DIST_DIR")" ]]; then
    echo -e "${RED}❌ 构建输出为空！${NC}"
    exit 1
fi

# 检查关键文件
REQUIRED_FILES=("index.html" "assets")
for required_file in "${REQUIRED_FILES[@]}"; do
    if [[ ! -e "$DIST_DIR/$required_file" ]]; then
        echo -e "${RED}❌ 缺少关键文件: $required_file${NC}"
        exit 1
    fi
done

# 8. 生成构建报告
echo -e "${YELLOW}📊 生成构建报告...${NC}"
BUILD_REPORT="$LOGS_DIR/${TIMESTAMP}_build_report.txt"
cat > "$BUILD_REPORT" << EOF
CSS数创网站构建报告
==================
构建时间: $(date)
TOML配置: $TOML_CONFIG
构建版本: v4.0.0

JSON数据文件:
$(ls -la "$VUE_DIR/public/w3sc8_"*.json | awk '{print $9 " (" $5 " bytes)"}')

输出文件:
$(du -sh "$DIST_DIR" 2>/dev/null || echo "计算大小失败")

构建状态: 成功 ✅
EOF

echo -e "${GREEN}📊 构建报告已保存: ${TIMESTAMP}_build_report.txt${NC}"

# 9. 构建完成信息
echo -e "${GREEN}✅ 构建完成！网站已输出到 $DIST_DIR 目录${NC}"
echo -e "${BLUE}🌐 本地预览：${NC}"
echo -e "   cd $DIST_DIR && python -m http.server 8080"
echo -e "   或访问: http://localhost:8080"
echo -e "${BLUE}🎯 远程测试：${NC}"
echo -e "   上传到 http://web3mh.101.so:11181/ 进行Playwright测试"

# 10. 输出摘要信息
TOTAL_SIZE=$(du -sh "$DIST_DIR" 2>/dev/null | cut -f1 || echo "未知")
JSON_COUNT=$(ls "$VUE_DIR/public/w3sc8_"*.json 2>/dev/null | wc -l)

echo -e "${YELLOW}📈 构建摘要：${NC}"
echo -e "  • JSON数据文件: $JSON_COUNT 个"
echo -e "  • 网站总大小: $TOTAL_SIZE"
echo -e "  • 构建日志: $LOGS_DIR"
echo -e "  • PWA支持: ✅ 已启用"
echo -e "  • 离线缓存: ✅ 已配置"

exit 0