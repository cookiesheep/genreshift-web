'use client';

/**
 * 提取内容中的关键词和出现次数
 * @param {string} text 要分析的文本内容
 * @returns {string[]} 关键词数组
 */
export const extractKeywords = (text) => {
  // 简单的关键词提取
  const words = text.toLowerCase().split(/\s+|[,.;:"'?!，。；：""'？！]/);
  const stopWords = new Set(['the', 'a', 'an', 'in', 'on', 'at', 'of', 'to', 'and', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'this', 'that', 'these', 'those', '的', '了', '和', '与', '是', '在', '有', '被']);
  
  // 统计词频
  const wordCount = {};
  words.forEach(word => {
    if (word.length > 1 && !stopWords.has(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });
  
  // 排序并返回前10个
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
};

/**
 * 生成离线后备内容
 * @param {string} content 原始内容
 * @param {object} parameters 转换参数
 * @returns {string} 生成的Markdown内容
 */
export const generateOfflineContent = (content, parameters) => {
  if (!content) return '';
  
  // 提取内容
  const extractedContent = content.substring(0, 1000);
  const sentences = extractedContent.split(/[.!?。！？]+/).filter(s => s.trim().length > 0);
  const keywords = extractKeywords(extractedContent);
  
  const language = parameters.language === 'zh' ? 'zh' : 'en';
  const style = parameters.outputStyle;
  const resultLength = parameters.length;
  
  if (language === 'zh') {
    return generateChineseFallback(sentences, keywords, style, resultLength);
  } else {
    return generateEnglishFallback(sentences, keywords, style, resultLength);
  }
};

/**
 * 生成中文后备内容
 */
const generateChineseFallback = (sentences, keywords, style, resultLength) => {
  // 提取标题
  const title = sentences[0]?.trim() || '论文概述';
  
  // 根据风格选择模板
  let template = '';
  
  if (style === 'news') {
    template = `# ${title.length > 20 ? title.substring(0, 20) + '...' : title}\n\n`;
    template += `**关键要点**: ${keywords.slice(0, 5).join('、')}\n\n`;
    template += `${sentences.slice(0, 3).join('。')}。\n\n`;
    
    if (resultLength !== 'short') {
      template += `## 研究背景\n\n${sentences.slice(3, 5).join('。')}。\n\n`;
      template += `## 研究方法\n\n据研究团队介绍，他们采用了创新的研究方法进行分析。${sentences.slice(5, 7).join('。')}。\n\n`;
    }
    
    if (resultLength === 'long') {
      template += `## 研究意义\n\n这项研究对${keywords[0]}领域具有重要意义。${sentences.slice(7, 10).join('。')}。\n\n`;
      template += `## 未来展望\n\n研究团队表示，未来将继续深入研究这一问题，进一步探索${keywords.slice(1, 3).join('和')}的关系。\n\n`;
    }
    
    template += `*注：本内容由系统离线生成，仅作参考。由于网络原因，无法获取完整的转换结果。*`;
  } else if (style === 'blog') {
    template = `# 探索${keywords[0]}的新视角：${title.length > 15 ? title.substring(0, 15) + '...' : title}\n\n`;
    template += `近期，一项关于${keywords.slice(0, 3).join('、')}的研究引起了我的注意。${sentences.slice(0, 3).join('。')}。\n\n`;
    
    if (resultLength !== 'short') {
      template += `## 为什么这很重要？\n\n${sentences.slice(3, 6).join('。')}。这些发现对于理解${keywords[0]}具有重要意义。\n\n`;
    }
    
    if (resultLength === 'long') {
      template += `## 深入分析\n\n如果仔细分析这项研究，我们可以发现几个关键点：\n\n- ${keywords[0]}与${keywords[1]}之间存在密切关联\n- 研究方法新颖，采用了创新的分析框架\n- 结果对${keywords[2]}领域提供了新的思路\n\n`;
      template += `## 我的看法\n\n个人认为，这项研究虽然有价值，但仍有改进空间。未来研究可以更深入地探索${keywords.slice(3, 5).join('和')}的关系。\n\n`;
    }
    
    template += `*注：本内容由系统离线生成，仅作参考。由于网络原因，无法获取完整的转换结果。*`;
  } else {
    // 摘要
    template = `# ${title}摘要\n\n`;
    template += `**核心概念**: ${keywords.slice(0, 5).join('、')}\n\n`;
    template += `${sentences.slice(0, 3).join('。')}。\n\n`;
    
    if (resultLength !== 'short') {
      template += `## 主要内容\n\n${sentences.slice(3, 8).join('。')}。\n\n`;
    }
    
    if (resultLength === 'long') {
      template += `## 研究结论\n\n基于以上内容，研究得出以下结论：\n\n- 关于${keywords[0]}的新发现\n- ${keywords[1]}与${keywords[2]}的关系\n- 对${keywords[3]}理论的验证\n\n`;
    }
    
    template += `*注：本内容由系统离线生成，仅作参考。由于网络原因，无法获取完整的转换结果。*`;
  }
  
  return template;
};

/**
 * 生成英文后备内容
 */
const generateEnglishFallback = (sentences, keywords, style, resultLength) => {
  // 提取标题
  const title = sentences[0]?.trim() || 'Paper Overview';
  
  // 根据风格选择模板
  let template = '';
  
  if (style === 'news') {
    template = `# ${title.length > 20 ? title.substring(0, 20) + '...' : title}\n\n`;
    template += `**Key Points**: ${keywords.slice(0, 5).join(', ')}\n\n`;
    template += `${sentences.slice(0, 3).join('. ')}.\n\n`;
    
    if (resultLength !== 'short') {
      template += `## Research Background\n\n${sentences.slice(3, 5).join('. ')}.\n\n`;
      template += `## Methodology\n\nAccording to the research team, they employed innovative research methods for analysis. ${sentences.slice(5, 7).join('. ')}.\n\n`;
    }
    
    if (resultLength === 'long') {
      template += `## Significance\n\nThis research has important implications for the field of ${keywords[0]}. ${sentences.slice(7, 10).join('. ')}.\n\n`;
      template += `## Future Prospects\n\nThe research team stated that they will continue to study this issue in depth, further exploring the relationship between ${keywords.slice(1, 3).join(' and ')}.\n\n`;
    }
    
    template += `*Note: This content is generated offline by the system for reference only. Due to network issues, the complete conversion result cannot be obtained.*`;
  } else if (style === 'blog') {
    // Blog style in English
    template = `# A New Perspective on ${keywords[0]}: ${title.length > 15 ? title.substring(0, 15) + '...' : title}\n\n`;
    template += `Recently, a study on ${keywords.slice(0, 3).join(', ')} caught my attention. ${sentences.slice(0, 3).join('. ')}.\n\n`;
    
    if (resultLength !== 'short') {
      template += `## Why This Matters\n\n${sentences.slice(3, 6).join('. ')}. These findings are significant for understanding ${keywords[0]}.\n\n`;
    }
    
    if (resultLength === 'long') {
      template += `## In-Depth Analysis\n\nIf we analyze this research carefully, we can identify several key points:\n\n- There is a close connection between ${keywords[0]} and ${keywords[1]}\n- The research method is novel, using an innovative analytical framework\n- The results provide new insights for the field of ${keywords[2]}\n\n`;
      template += `## My Take\n\nPersonally, I believe that while this research is valuable, there is still room for improvement. Future research could explore more deeply the relationship between ${keywords.slice(3, 5).join(' and ')}.\n\n`;
    }
    
    template += `*Note: This content is generated offline by the system for reference only. Due to network issues, the complete conversion result cannot be obtained.*`;
  } else {
    // Summary in English
    template = `# Summary of ${title}\n\n`;
    template += `**Core Concepts**: ${keywords.slice(0, 5).join(', ')}\n\n`;
    template += `${sentences.slice(0, 3).join('. ')}.\n\n`;
    
    if (resultLength !== 'short') {
      template += `## Main Content\n\n${sentences.slice(3, 8).join('. ')}.\n\n`;
    }
    
    if (resultLength === 'long') {
      template += `## Research Conclusions\n\nBased on the above content, the study draws the following conclusions:\n\n- New findings about ${keywords[0]}\n- The relationship between ${keywords[1]} and ${keywords[2]}\n- Validation of theories regarding ${keywords[3]}\n\n`;
    }
    
    template += `*Note: This content is generated offline by the system for reference only. Due to network issues, the complete conversion result cannot be obtained.*`;
  }
  
  return template;
};

/**
 * Markdown渲染函数
 * @param {string} text Markdown文本
 * @returns {string} 渲染后的HTML
 */
export const renderMarkdown = (text) => {
  if (!text) return '';
  
  return text
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-6">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-3 mt-5">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mb-2 mt-4">$1</h3>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-200 dark:border-gray-700 pl-4 py-2 my-3 text-gray-600 dark:text-gray-300 italic">$1</blockquote>')
    // 有序列表
    .replace(/^(\d+)\. (.*$)/gim, '<div class="ml-5 list-decimal"><li>$2</li></div>')
    // 无序列表
    .replace(/^- (.*$)/gim, '<div class="ml-5 list-disc"><li>$1</li></div>')
    // 代码块
    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded-md my-3 overflow-x-auto"><code>$1</code></pre>')
    // 链接
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank">$1</a>')
    // 段落
    .replace(/\n\n/gim, '</p><p class="my-2">')
    .replace(/\n/gim, '<br />');
}; 