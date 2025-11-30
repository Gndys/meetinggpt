import { respData, respErr } from "@/lib/resp";

const MODEL_NAME = "gemini-3-pro-preview";
const MAX_SERVER_CHAR = 120000;

const MEETING_TYPE_LABELS: Record<string, string> = {
  strategy: "战略规划会",
  product: "产品评审会",
  sales: "销售/招商会",
  supply: "供应商谈判",
  review: "经营复盘会",
  other: "其他类型",
};

const PROMPT_HEADER = `# 角色定位
你是一位资深的内容编辑和信息架构师，擅长从冗长、口语化的逐字稿中提炼精华，
并将其重新组织成清晰、易读、有价值的内容。

# 任务目标
请对以下逐字稿进行深度分析和提炼，输出一份**既有核心摘要，又保留关键细节**的完整报告。

# 处理原则
1. **去口语化**：删除语气词、重复内容、无意义的停顿和口头禅
2. **重构逻辑**：不按时间线，而是按主题和重要性重新组织内容
3. **保留故事**：保留生动的案例、故事和具体例子，但用更简洁的语言转述
4. **提炼金句**：识别并标注高频出现、最具代表性的核心观点
5. **分层呈现**：提供不同颗粒度的内容（一句话总结→核心观点→详细拆解）

# 输出结构

## 第一部分：核心主题
用1-2个段落（150-200字），概括整个内容的核心主题、主讲人背景和最终目标。
让完全不了解的人能快速理解"这是关于什么的"。

## 第二部分：核心观点提炼（按重要性排序）
提炼出5-8个最核心的观点，每个观点包含：
- **【标题】核心概念的简洁命名**
- **核心思想**：用2-3句话解释这个观点
- **金句**：原文中最能代表这个观点的1-2句话（用引号标注）
- **为什么重要**：简要说明这个观点的价值或应用场景

## 第三部分：主题式详细拆解（保留细节版）
将内容按逻辑主题重新组织（不按时间顺序），每个主题下包含：
- 核心论点
- 支撑故事/案例（简化但保留关键情节）
- 可操作的方法/建议
- 相关金句

建议的主题分类（根据实际内容调整）：
- 心态/认知层面
- 方法论/技能层面  
- 人际关系层面
- 具体案例/故事
- 产品/工具介绍（如有）

## 第四部分：可视化知识卡片（可选）
如果内容中有清晰的方法论、流程或框架，用Markdown表格或列表形式呈现。

## 第五部分：元分析（处理思路说明）
简要说明你在处理这份逐字稿时：
- 识别出了哪些核心主题
- 删减了哪些类型的内容（如重复、跑题部分）
- 重点保留了哪些部分（如关键故事、方法论）
- 内容的整体质量和特点

# 注意事项
- 保持客观中立，不添加个人评价
- 如遇到明显的错误信息或前后矛盾，可在【】中注明
- 专业术语首次出现时给予简单解释
- 保留原文的语言风格特点（如口语化的金句可以保留）
- 如果内容过长，优先保证"闪电摘要"和"核心观点"部分的质量`;

type MeetingInfo = {
  title?: string;
  type?: string;
  focus?: string;
  participants?: string;
};

export async function POST(req: Request) {
  try {
    const { transcript, meetingInfo }: { transcript?: string; meetingInfo?: MeetingInfo } =
      await req.json();

    if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
      return respErr("transcript is required");
    }

    const apiKey = process.env.APIMART_API_KEY;
    if (!apiKey) {
      console.error("APIMART_API_KEY is missing");
      return respErr("summarize service not configured");
    }

    const baseUrl =
      (process.env.APIMART_BASE_URL || "https://api.apimart.ai/v1").replace(
        /\/$/,
        ""
      ) + "/chat/completions";

    const trimmedTranscript =
      transcript.length > MAX_SERVER_CHAR
        ? `${transcript.slice(0, MAX_SERVER_CHAR)}\n\n[内容因长度限制被截断，仅总结上述部分]`
        : transcript;

    const contextLines: string[] = [];
    if (meetingInfo?.title) {
      contextLines.push(`会议主题：${meetingInfo.title}`);
    }
    if (meetingInfo?.type) {
      const typeLabel =
        MEETING_TYPE_LABELS[meetingInfo.type] || meetingInfo.type;
      contextLines.push(`会议类型：${typeLabel}`);
    }
    if (meetingInfo?.participants) {
      contextLines.push(`主要发言人：${meetingInfo.participants}`);
    }
    if (meetingInfo?.focus) {
      contextLines.push(`组织者最关心的问题：${meetingInfo.focus}`);
    }

    const contextBlock =
      contextLines.length > 0
        ? `\n## 额外背景\n${contextLines.map((line) => `- ${line}`).join("\n")}\n`
        : "";

    const finalPrompt = `${PROMPT_HEADER}${contextBlock}\n## 待处理的逐字稿内容：\n${trimmedTranscript}`;

    const payload = {
      model: MODEL_NAME,
      temperature: 0.4,
      top_p: 0.9,
      messages: [
        {
          role: "system",
          content:
            "你是一位资深内容编辑，擅长将口语化会议逐字稿提炼为结构化纪要。",
        },
        {
          role: "user",
          content: finalPrompt,
        },
      ],
    };

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("apimart summarize failed", response.status, errorText);
      return respErr("summarize failed");
    }

    const data = await response.json();
    const summary = extractSummaryText(data);
    if (!summary) {
      console.error("apimart summarize empty response", data);
      return respErr("no summary returned");
    }

    return respData({
      summary,
    });
  } catch (error) {
    console.error("summarize api error", error);
    return respErr("summarize failed");
  }
}

function extractSummaryText(result: any): string {
  if (result?.choices?.length) {
    const choice = result.choices[0];
    if (typeof choice.message?.content === "string") {
      return choice.message.content.trim();
    }

    if (Array.isArray(choice.message?.content)) {
      return choice.message.content
        .map((part: any) =>
          typeof part === "string" ? part : part?.text || ""
        )
        .join("")
        .trim();
    }
  }

  if (result?.candidates?.length) {
    const parts = result.candidates[0]?.content?.parts;
    if (Array.isArray(parts)) {
      return parts
        .map((part: any) => part?.text || "")
        .join("\n")
        .trim();
    }
  }

  if (typeof result?.output_text === "string") {
    return result.output_text.trim();
  }

  return "";
}
