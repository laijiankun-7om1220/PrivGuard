import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// 设置 PDF.js worker - 使用本地 worker 文件
if (typeof window !== 'undefined') {
  // 使用本地 worker 文件，避免 CORS 问题
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export const parseWordFile = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Word file parsing error:', error);
    throw new Error('Word 文件解析失败');
  }
};

export const parseTxtFile = async (file: File): Promise<string> => {
  try {
    const text = await file.text();
    return text;
  } catch (error) {
    console.error('TXT file parsing error:', error);
    throw new Error('TXT 文件解析失败');
  }
};

export const parsePdfFile = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // 遍历所有页面提取文本
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // 提取页面文本
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('PDF file parsing error:', error);
    throw new Error('PDF 文件解析失败');
  }
};

export const parseFile = async (file: File): Promise<string> => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  
  // 检查文件类型或扩展名
  if (
    fileType === 'application/msword' ||
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.doc') ||
    fileName.endsWith('.docx')
  ) {
    return await parseWordFile(file);
  } else if (
    fileType === 'text/plain' ||
    fileName.endsWith('.txt')
  ) {
    return await parseTxtFile(file);
  } else if (
    fileType === 'application/pdf' ||
    fileName.endsWith('.pdf')
  ) {
    return await parsePdfFile(file);
  } else {
    throw new Error('不支持的文件格式，仅支持 Word (doc, docx)、TXT 和 PDF 文件');
  }
};
