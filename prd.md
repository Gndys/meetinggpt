会议摘要工具 PRD（产品需求文档）

一、产品概述

1.1 产品定位
面向家电行业高管的智能会议助手 —— 一款让老板们"看得懂、用得爽、感觉牛"的AI会议管理工具

核心价值主张：
- 💼 **为老板节省时间**：1小时会议，3分钟掌握核心
- 🎯 **为决策提供依据**：自动提取关键决策点和待办事项
- 🔒 **私有化部署**：数据安全，商业机密不外泄
  
1.2 目标用户画像
- 主要用户：家电行业企业主、高管（40-60岁）
- 使用场景：经销商会议、产品评审会、战略规划会、供应商谈判
- 痛点：会议多、信息杂、记不住、跟进难
  

---

二、产品功能架构

2.1 核心功能模块

模块1：智能上传与识别
功能点：
✓ 支持多格式上传（MP3/WAV/M4A/MP4视频提取音频）
✓ 拖拽上传 + 批量上传
✓ 自动识别说话人（2-10人）
✓ 方言识别（粤语/四川话等家电行业常见方言）
✓ 实时进度显示（转写进度条 + 预计完成时间）

亮点设计：
🎤 上传后自动识别会议类型（产品会/销售会/战略会）
⚡ 1小时录音 < 5分钟出结果

模块2：逐字稿生成与编辑
功能点：
✓ 高精度逐字稿（准确率 >95%）
✓ 时间轴标注（可点击跳转到对应音频位置）
✓ 说话人标识（张总/李经理/供应商A）
✓ 在线编辑修正
✓ 关键词高亮（金额/日期/产品型号）

亮点设计：
📌 自动识别行业术语（压缩机/能效比/渠道价/返点）
🎨 重要内容自动加粗（"必须""一定要""deadline"）

模块3：AI智能总结（核心卖点）
功能点：
✓ 使用你的自定义提示词
✓ 多维度总结输出：
  - 会议概要（3句话说清楚）
  - 核心决策（老板拍板的事）
  - 待办事项（谁/做什么/什么时候）
  - 风险提示（潜在问题预警）
  - 数据看板（提到的关键数字）

亮点设计：
🎯 家电行业专属模板：
  - 产品评审会模板（成本/定价/上市时间）
  - 经销商会议模板（销量/库存/政策）
  - 供应商谈判模板（价格/账期/质量）
  
💡 智能追问功能：
  "张总提到的Q2销量目标具体是多少？"
  "李经理负责的三个事项是什么？"

模块4：报告导出与分享
功能点：
✓ 多格式导出（PDF/Word/PPT/Excel）
✓ 精美排版（带公司Logo和配色）
✓ 分级权限分享（仅摘要/含逐字稿/完整版）
✓ 微信/邮件一键发送
✓ 生成专属链接（可设置访问密码）

亮点设计：
📊 自动生成PPT汇报版（适合向上级汇报）
📱 移动端适配（老板在车上也能看）


---

三、产品差异化设计（让人觉得牛逼的点）

3.1 视觉冲击力
首页设计：
- 大屏数据看板：累计处理X小时会议，节省X天时间
- 动态效果：上传时的音波可视化动画
- 科技感配色：深蓝+金色（符合家电行业审美）
- 3D图表展示：会议分析结果用立体图表呈现

3.2 行业专业度
内置家电行业知识库：
✓ 自动识别产品型号（如"KFR-35GW"）
✓ 理解行业黑话（"砍价""窜货""压货"）
✓ 关联历史会议（"上次讨论这个问题的结论是..."）

3.3 智能化体验
AI助手"小智"：
- 会议前：提醒准备议题
- 会议中：实时记录（可选）
- 会议后：自动发送摘要给参会人
- 追踪待办事项完成情况

3.4 数据安全背书
展示点：
🔐 本地部署选项（数据不出企业内网）
🏆 通过ISO27001认证（即使还没有，也要规划）
⚖️ 签署保密协议


---

四、产品页面结构

4.1 页面流程图
登录页
  ↓
工作台（Dashboard）
  ├─ 快速上传入口
  ├─ 最近会议列表
  ├─ 数据统计看板
  └─ 待办事项提醒
  ↓
上传页面
  ├─ 拖拽上传区
  ├─ 会议信息填写（标题/参会人/类型）
  └─ 高级设置（说话人数量/方言选择）
  ↓
处理中页面（进度展示）
  ↓
结果页面
  ├─ 左侧：逐字稿（可编辑）
  ├─ 右侧：AI摘要
  └─ 顶部：播放器 + 导出按钮
  ↓
导出/分享页面

4.2 关键页面设计要点

工作台（让老板一眼看到价值）：
- 本月节省时间：XX小时
- 待办事项完成率：XX%
- 会议效率评分：XX分
- 热力图：哪些时间段会议最多
  
结果页（核心展示页）：
- 顶部卡片：会议基本信息 + 一句话总结
- 标签页切换：摘要/逐字稿/待办/数据
- 侧边栏：快速跳转到关键时刻
- 底部：AI信心度显示（"本次总结准确度95%"）
  

---

五、技术实现方案

5.1 技术栈建议
前端：React + Tailwind CSS（现代化UI）
后端：Python FastAPI（处理AI任务）
语音转文字：
  - 阿里云/腾讯云ASR（成本低）
  - Whisper（开源，可本地部署）
AI总结：
  - GPT-4 / Claude（你的提示词）
  - 可选本地大模型（如千问/ChatGLM）
存储：阿里云OSS + MySQL
部署：Docker容器化

5.2 成本控制
初期（演示版）：
- 使用云服务API
- 限制免费额度（每月10次）
- 成本：约500-1000元/月

规模化后：
- 自建Whisper服务
- 批量购买API额度
- 成本：约0.5-1元/小时录音


---

六、商业化策略

6.1 定价模型
免费版：
- 每月3次转写
- 基础摘要功能
- 带水印导出

专业版：¥299/月
- 无限次转写
- 全部AI模板
- 无水印导出
- 优先处理

企业版：¥2999/年
- 支持团队协作
- 私有化部署选项
- 定制提示词
- 专属客服

6.2 推广策略（针对家电行业）
1. 制作震撼Demo视频
   - 拍摄真实会议场景
   - 展示3分钟出结果的过程
   - 对比传统人工记录的痛苦

2. 行业展会展示
   - 带iPad现场演示
   - 准备家电行业案例
   - 设计精美宣传册

3. KOL背书
   - 找1-2个家电行业老板试用
   - 录制使用感言视频
   - "我们公司每周节省10小时"

4. 内容营销
   - 发布《家电老板如何开高效会议》
   - 制作对比图：用vs不用的区别


---

七、MVP开发计划（最小可行产品）

第一阶段（2周）：核心功能
- ✅ 上传音频文件
- ✅ 调用ASR生成逐字稿
- ✅ 调用AI生成摘要（用你的提示词）
- ✅ 简单的结果展示页面
  
第二阶段（2周）：体验优化
- ✅ 美化UI界面
- ✅ 添加进度显示
- ✅ 导出PDF功能
- ✅ 移动端适配
  
第三阶段（2周）：差异化功能
- ✅ 家电行业模板
- ✅ 说话人识别
- ✅ 待办事项提取
- ✅ 数据看板
  
第四阶段（持续）：打磨细节
- ✅ 性能优化
- ✅ 收集反馈迭代
- ✅ 准备商业化
  

---

八、演示话术建议

给家电老板看时这样说：

开场（10秒抓住注意力）：
"X总您好，我给您看个东西——这是我们上周一个家电经销商会议，2小时的录音，我上传到系统里..."

（操作上传，展示进度条）

"您看，不到3分钟，系统自动生成了完整的会议记录和总结。"

展示结果（30秒）：
（打开摘要页面）

"您看这里，会议核心就这三点：
1. Q2销量目标50万台
2. 新品定价2999元
3. 给经销商的返点提高2个点
  
3. 下面是待办事项，谁负责什么，什么时候完成，一目了然。"

痛点共鸣（20秒）：
"我知道您每天会议特别多，以前都是助理记录，整理一次要半天，还容易漏掉关键信息。现在有了这个工具，开完会直接发给所有人，省时间还不会有遗漏。"

技术背书（10秒）：
"我们用的是最新的AI技术，连方言都能识别，而且数据全程加密，绝对安全。"

行动召唤：
"X总，我给您开个账号，您下次开会试试？我保证能帮您节省至少一半的会议管理时间。"


---

九、风险与应对

风险
应对方案
转写准确率不够
提供编辑功能；强调"AI辅助，人工审核"
老板不会用
提供上门培训；制作傻瓜式教程视频
担心数据安全
提供本地部署方案；签署保密协议
价格太贵
强调ROI：节省的人力成本 > 软件费用
竞品出现
深耕家电行业，做垂直领域专家


---

十、成功指标

产品层面：
- 转写准确率 > 95%
- 处理速度：1小时录音 < 5分钟
- 用户满意度 > 4.5分（5分制）
  
商业层面：
- 3个月内获得10个付费客户
- 6个月内实现收支平衡
- 获得2-3个标杆客户案例
  
个人品牌层面：
- 在行业内建立"AI会议专家"的形象
- 获得至少5个客户的推荐背书
- 为后续业务拓展打下基础
  

---

总结：为什么这个产品能让人觉得牛逼？

1. 解决真痛点：老板最缺的就是时间，你帮他省时间
2. 效果可视化：3分钟出结果，立竿见影
3. 专业度高：懂家电行业，不是通用工具
4. 技术有门槛：AI+语音识别，不是谁都能做
5. 有商业价值：能直接转化为收入，不是玩具
  
最关键的： 你要传递的不是"我做了个工具"，而是"我能用AI技术帮家电企业提升效率、降低成本、抓住商机"。这个产品只是你能力的一个证明，真正的价值是你对行业的理解 + 技术实现能力。


会议摘要工具技术栈方案

根据你的情况（00后刚毕业，要快速出产品展示），我给你**3套方案**，从易到难：


---

方案一：快速上线方案（推荐⭐⭐⭐⭐⭐）

适合场景
- 2-3周快速做出MVP
- 成本可控（初期每月500元内）
- 技术门槛低，容易维护
- 适合演示和小规模商用
  
技术栈

前端
Next.js 14 (React框架)
├─ 原因：
│  ✓ 开箱即用，不用配置一堆东西
│  ✓ 自带路由、API接口
│  ✓ SEO友好（后期做官网推广有用）
│  ✓ Vercel一键部署，免费额度够用
│
├─ UI组件库：
│  ├─ shadcn/ui（现代化，可定制）
│  ├─ Tailwind CSS（快速写样式）
│  └─ Framer Motion（做动画效果，显得高级）
│
└─ 状态管理：
   └─ Zustand（比Redux简单100倍）

示例代码结构：
/app
  /dashboard          # 工作台
  /upload            # 上传页面
  /meeting/[id]      # 会议详情
  /api
    /transcribe      # 转写接口
    /summarize       # 总结接口
/components
  /ui                # shadcn组件
  /meeting           # 业务组件
/lib
  /api-clients       # API调用封装

后端
Next.js API Routes (服务端)
├─ 为什么不单独写后端？
│  ✓ 前后端一体，部署简单
│  ✓ 减少跨域问题
│  ✓ 一个人开发效率高
│
└─ 核心逻辑：
   ├─ 文件上传处理
   ├─ 调用第三方API
   └─ 数据库操作

或者用 Supabase（推荐）：
Supabase (Backend as a Service)
├─ 数据库：PostgreSQL（自带）
├─ 存储：文件上传（自带）
├─ 认证：用户登录（自带）
├─ 实时订阅：进度推送（自带）
└─ 优势：
   ✓ 免费额度：500MB数据库 + 1GB存储
   ✓ 不用写后端代码
   ✓ 自动生成API
   ✓ 有现成的React Hooks

核心服务

1. 语音转文字（ASR）
推荐：阿里云智能语音服务
├─ 价格：2.5元/小时（录音文件识别）
├─ 优势：
│  ✓ 中文准确率高（95%+）
│  ✓ 支持方言（粤语、四川话等）
│  ✓ 自动断句、说话人分离
│  ✓ 文档清晰，接入快
└─ 备选：
   ├─ 腾讯云ASR（价格类似）
   └─ 讯飞语音（老牌，稳定）

代码示例：
// lib/transcribe.ts
import RPCClient from '@alicloud/pop-core'

export async function transcribeAudio(fileUrl: string) {
  const client = new RPCClient({
    accessKeyId: process.env.ALI_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALI_ACCESS_KEY_SECRET,
    endpoint: 'https://nls-meta.cn-shanghai.aliyuncs.com',
    apiVersion: '2019-02-28'
  })
  
  const response = await client.request('SubmitTask', {
    AppKey: process.env.ALI_APP_KEY,
    FileLink: fileUrl,
    EnableWords: true,
    EnableSpeakerDiarization: true // 说话人分离
  })
  
  return response
}

2. AI总结（LLM）
推荐：OpenAI GPT-4 Turbo
├─ 价格：
│  ├─ 输入：$0.01 / 1K tokens
│  └─ 输出：$0.03 / 1K tokens
│  └─ 一次总结约0.5-1元
├─ 优势：
│  ✓ 效果最好
│  ✓ API稳定
│  ✓ 支持长文本（128K tokens）
└─ 备选：
   ├─ Claude 3.5 Sonnet（效果好，便宜）
   ├─ 通义千问（国内，便宜，但效果稍差）
   └─ Deepseek（超便宜，1元能总结几百次）

代码示例：
// lib/summarize.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function summarizeMeeting(transcript: string, customPrompt: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: customPrompt // 你的自定义提示词
      },
      {
        role: "user",
        content: `会议逐字稿：\n\n${transcript}`
      }
    ],
    temperature: 0.3 // 降低随机性，提高准确性
  })
  
  return response.choices[0].message.content
}

3. 文件存储
推荐：阿里云OSS
├─ 价格：0.12元/GB/月（存储）
├─ 流量：0.5元/GB（下行）
└─ 初期成本：每月10-50元

或者用 Supabase Storage（免费1GB）

4. 数据库
Supabase PostgreSQL（推荐）
或
PlanetScale（MySQL，免费5GB）

表结构设计：
users (用户表)
├─ id
├─ email
├─ name
└─ created_at

meetings (会议表)
├─ id
├─ user_id
├─ title
├─ audio_url
├─ duration
├─ status (processing/completed/failed)
├─ created_at
└─ updated_at

transcripts (逐字稿表)
├─ id
├─ meeting_id
├─ content (JSONB: 包含时间轴、说话人)
└─ created_at

summaries (摘要表)
├─ id
├─ meeting_id
├─ summary_type (overview/decisions/todos)
├─ content
└─ created_at

部署方案
前端 + API：Vercel（免费）
├─ 自动CI/CD
├─ 全球CDN
├─ 免费SSL证书
└─ 每月100GB流量

数据库：Supabase（免费）
存储：阿里云OSS（按量付费）
域名：阿里云（首年9元）

总成本：每月 < 100元（初期）


---

方案二：专业方案（可扩展）

适合场景
- 预计用户量会快速增长
- 需要更多自定义功能
- 有一定后端开发经验
  
技术栈

前端
React 18 + Vite
├─ TypeScript（类型安全）
├─ TanStack Query（数据请求管理）
├─ Zustand（状态管理）
├─ shadcn/ui + Tailwind
└─ Vite PWA（支持离线使用）

后端
Python FastAPI
├─ 为什么选Python？
│  ✓ AI生态最好（处理音频、调用模型方便）
│  ✓ FastAPI性能好，写起来快
│  ✓ 异步支持（处理长时间任务）
│
├─ 核心库：
│  ├─ fastapi（Web框架）
│  ├─ sqlalchemy（ORM）
│  ├─ celery（异步任务队列）
│  ├─ redis（缓存 + 任务队列）
│  ├─ pydub（音频处理）
│  └─ openai / anthropic（AI SDK）
│
└─ 项目结构：
   /app
     /api
       /v1
         /endpoints
           - upload.py
           - meetings.py
           - transcribe.py
     /core
       - config.py
       - security.py
     /models
       - meeting.py
       - user.py
     /services
       - transcription.py
       - summarization.py
     /tasks
       - celery_worker.py

核心代码示例：
# app/api/v1/endpoints/transcribe.py
from fastapi import APIRouter, UploadFile, BackgroundTasks
from app.services.transcription import transcribe_audio
from app.tasks.celery_worker import process_meeting_task

router = APIRouter()

@router.post("/transcribe")
async def transcribe_meeting(
    file: UploadFile,
    background_tasks: BackgroundTasks
):
    # 保存文件
    file_path = await save_upload_file(file)
    
    # 创建会议记录
    meeting = create_meeting(file_path)
    
    # 添加到后台任务队列
    background_tasks.add_task(
        process_meeting_task.delay,
        meeting.id
    )
    
    return {"meeting_id": meeting.id, "status": "processing"}

# app/tasks/celery_worker.py
from celery import Celery
from app.services.transcription import transcribe_audio
from app.services.summarization import summarize_transcript

celery_app = Celery('tasks', broker='redis://localhost:6379/0')

@celery_app.task
def process_meeting_task(meeting_id: int):
    meeting = get_meeting(meeting_id)
    
    # 1. 转写音频
    transcript = transcribe_audio(meeting.audio_url)
    save_transcript(meeting_id, transcript)
    
    # 2. AI总结
    summary = summarize_transcript(transcript)
    save_summary(meeting_id, summary)
    
    # 3. 更新状态
    update_meeting_status(meeting_id, "completed")
    
    return {"status": "success"}

数据库
PostgreSQL 15
├─ 主数据库
├─ 支持JSONB（存储复杂数据）
└─ 全文搜索（搜索会议内容）

Redis
├─ 缓存（用户会话、热点数据）
├─ 任务队列（Celery broker）
└─ 实时进度（WebSocket状态）

部署
Docker Compose
├─ nginx（反向代理）
├─ frontend（React容器）
├─ backend（FastAPI容器）
├─ celery-worker（任务处理）
├─ postgresql
└─ redis

云服务器：
├─ 阿里云ECS（2核4G，约100元/月）
└─ 或腾讯云轻量服务器


---

方案三：本地化部署方案（高端客户）

适合场景
- 给大企业客户用
- 数据安全要求高
- 可以收更高的价格
  
技术栈

核心差异
语音识别：
├─ Whisper（OpenAI开源模型）
│  ✓ 本地运行，不依赖外部API
│  ✓ 支持多语言
│  ✓ 准确率高
│  └─ 需要GPU服务器（或用CPU慢慢跑）
│
└─ FunASR（阿里达摩院开源）
   ✓ 专门优化中文
   ✓ 支持实时识别
   └─ 模型较小，CPU也能跑

AI总结：
├─ 本地大模型：
│  ├─ ChatGLM3-6B（清华开源）
│  ├─ Qwen-14B（阿里通义千问）
│  └─ Llama 3（Meta开源）
│
└─ 部署方案：
   ├─ Ollama（一键部署本地模型）
   ├─ vLLM（推理加速）
   └─ LangChain（模型调用封装）

Whisper集成示例：
# app/services/local_transcription.py
import whisper
import torch

class LocalTranscriptionService:
    def __init__(self):
        # 加载模型（首次会下载）
        device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = whisper.load_model("large-v3", device=device)
    
    def transcribe(self, audio_path: str):
        result = self.model.transcribe(
            audio_path,
            language="zh",  # 中文
            task="transcribe",
            word_timestamps=True,  # 词级时间戳
            initial_prompt="这是一段家电行业的会议录音"  # 提示词
        )
        
        return {
            "text": result["text"],
            "segments": result["segments"],  # 带时间轴
            "language": result["language"]
        }

本地大模型调用：
# app/services/local_llm.py
from langchain.llms import Ollama
from langchain.prompts import PromptTemplate

class LocalLLMService:
    def __init__(self):
        self.llm = Ollama(model="qwen:14b")
    
    def summarize(self, transcript: str, custom_prompt: str):
        prompt = PromptTemplate(
            input_variables=["transcript"],
            template=custom_prompt + "\n\n会议内容：\n{transcript}"
        )
        
        chain = prompt | self.llm
        summary = chain.invoke({"transcript": transcript})
        
        return summary

硬件要求
最低配置（CPU方案）：
├─ CPU：8核
├─ 内存：16GB
├─ 硬盘：500GB SSD
└─ 处理速度：1小时录音需要20-30分钟

推荐配置（GPU方案）：
├─ CPU：16核
├─ 内存：32GB
├─ GPU：RTX 4090 / A100
├─ 硬盘：1TB SSD
└─ 处理速度：1小时录音需要3-5分钟

成本：
├─ 自建服务器：2-5万
└─ 云GPU服务器：约5-10元/小时（按需使用）


---

我的推荐：混合方案 ⭐⭐⭐⭐⭐

为什么混合？
初期演示阶段：
└─ 用方案一（云API）
   ✓ 快速上线
   ✓ 成本低
   ✓ 效果好

获得付费客户后：
└─ 逐步引入方案三（本地化）
   ✓ 作为高端版本卖
   ✓ 差异化定价
   ✓ 提高客单价

具体技术栈

前端：Next.js 14 + shadcn/ui + Tailwind
├─ 快速开发
├─ 界面现代化
└─ 部署简单

后端：Next.js API Routes + Supabase
├─ 初期够用
├─ 后期可迁移到FastAPI
└─ 渐进式升级

语音识别：
├─ 云端版：阿里云ASR
└─ 本地版：Whisper（Docker镜像）

AI总结：
├─ 云端版：GPT-4 / Claude
└─ 本地版：Qwen-14B（Ollama）

数据库：Supabase PostgreSQL
├─ 免费额度够初期用
└─ 后期可自建

文件存储：
├─ 云端版：阿里云OSS
└─ 本地版：MinIO（开源对象存储）

部署：
├─ 云端版：Vercel
└─ 本地版：Docker Compose


---

开发路线图

Week 1-2：基础框架
# 1. 初始化项目
npx create-next-app@latest meeting-summary --typescript
cd meeting-summary

# 2. 安装依赖
npm install @supabase/supabase-js
npm install @supabase/auth-helpers-nextjs
npm install openai
npm install zustand
npm install @tanstack/react-query
npm install framer-motion

# 3. 添加shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add tabs

# 4. 配置Supabase
# 在 .env.local 添加：
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
ALI_ACCESS_KEY_ID=your_ali_key
ALI_ACCESS_KEY_SECRET=your_ali_secret

Week 3-4：核心功能
- ✅ 文件上传组件
- ✅ 调用阿里云ASR
- ✅ 调用OpenAI总结
- ✅ 结果展示页面
  
Week 5-6：优化体验
- ✅ 进度显示
- ✅ 实时推送（Supabase Realtime）
- ✅ 导出PDF
- ✅ 移动端适配
  

---

成本估算

初期（每月处理100小时录音）
阿里云ASR：2.5元/小时 × 100 = 250元
OpenAI API：1元/次 × 100 = 100元
阿里云OSS：约20元
服务器（Vercel）：免费
数据库（Supabase）：免费
域名：9元/年
─────────────────────────
总计：约370元/月

规模化后（每月处理1000小时）
方案A（继续用云API）：
├─ ASR：2500元
├─ LLM：1000元
├─ 存储：200元
├─ 服务器：500元
└─ 总计：4200元/月

方案B（自建Whisper）：
├─ GPU服务器：2000元/月
├─ LLM API：1000元
├─ 存储：200元
└─ 总计：3200元/月（更划算）


---

给你的建议

1. 第一个月：用Next.js + Supabase + 云API，快速做出能演示的版本
2. 拿到第一个客户后：优化UI，增加家电行业特色功能
3. 有10个付费客户后：考虑自建Whisper，降低成本
4. 有企业客户要本地部署：打包Docker镜像，收更高的价格
  
最重要的：先把产品做出来，让老板看到效果，再考虑技术优化。技术栈可以迭代，但机会不等人！

需要我帮你搭建初始项目吗？我可以直接给你写好配置文件和核心代码。