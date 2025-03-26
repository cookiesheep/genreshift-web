'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function FileUploader({ file, setFile, setFileContent, setError }) {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      
      // 读取文件内容
      const reader = new FileReader();
      reader.onload = () => {
        setFileContent(reader.result);
      };
      
      if (selectedFile.type === 'application/pdf') {
        // PDF需要特殊处理，这里简化为纯文本读取
        // 实际应用中应当使用pdf.js等库进行解析
        reader.readAsText(selectedFile);
      } else {
        reader.readAsText(selectedFile);
      }
      
      setError(null);
    }
  }, [setFile, setFileContent, setError]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/zip': ['.zip'],
    }
  });

  return (
    <div className="flex-1 flex flex-col">
      <div
        {...getRootProps()}
        className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-all ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
        } ${file ? 'bg-indigo-50' : ''}`}
      >
        <input {...getInputProps()} />
        
        {file ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800">{file.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {(file.size / 1024).toFixed(2)} KB · {file.type || '未知类型'}
            </p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setFileContent('');
              }}
              className="mt-4 px-3 py-1 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200 transition"
            >
              删除文件
            </button>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 text-center">
              {isDragActive ? '释放文件以上传' : '拖放或点击上传论文'}
            </h3>
            <p className="text-sm text-gray-500 mt-2 text-center">
              支持 PDF、TXT、DOCX 和 ZIP 文件
            </p>
          </>
        )}
      </div>
    </div>
  );
}
