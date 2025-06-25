
import React, { ReactNode, useState, useEffect, ChangeEvent } from 'react';
import { Theme, GeneratedPrompt, PromptMode } from './types';
import { LOCAL_STORAGE_THEME_KEY } from './constants';

// --- Icons ---
export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);


// --- UI Elements ---
export const Button: React.FC<{ onClick?: () => void; children: ReactNode; className?: string; type?: 'button' | 'submit' | 'reset'; disabled?: boolean; variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }> = ({ children, onClick, className = '', type = 'button', disabled = false, variant = 'primary' }) => {
  const baseStyle = "px-6 py-3 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-all duration-150 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100";
  
  let variantStyle = "";
  switch(variant) {
    case 'primary':
      variantStyle = "bg-primary text-primary-content hover:bg-primary-focus focus:ring-primary shadow-md hover:shadow-glow-primary-md";
      break;
    case 'secondary':
      variantStyle = "bg-secondary text-secondary-content hover:bg-secondary-focus focus:ring-secondary shadow-md hover:shadow-glow-secondary-md";
      break;
    case 'ghost':
      variantStyle = "bg-transparent text-primary hover:bg-primary/10 dark:text-primary dark:hover:bg-primary/20 focus:ring-primary";
      break;
    case 'danger':
      variantStyle = "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg";
      break;
  }

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variantStyle} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

export const Input: React.FC<{ id?: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; placeholder?: string; type?: string; className?: string; rows?: number; isTextArea?: boolean, maxLength?: number; }> = ({ id, value, onChange, placeholder, type = "text", className = '', rows, isTextArea = false, maxLength }) => {
  const commonStyles = "w-full p-3 bg-base-200-light dark:bg-base-200-dark text-content-light dark:text-content-dark border border-base-300-light dark:border-base-300-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-150 focus:shadow-glow-primary-sm";
  if (isTextArea) {
    return <textarea id={id} value={value} onChange={onChange} placeholder={placeholder} className={`${commonStyles} ${className}`} rows={rows || 4} maxLength={maxLength} />;
  }
  return <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} className={`${commonStyles} ${className}`} maxLength={maxLength} />;
};

export const FileInput: React.FC<{ id?: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; accept?: string; className?: string; label?: string; disabled?: boolean }> = ({ id, onChange, accept, className = '', label = "Chọn tệp", disabled = false }) => {
  return (
    <label htmlFor={id || 'file-input'} className={`inline-block cursor-pointer ${className}`}>
      <div className={`flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-content rounded-lg hover:bg-secondary-focus focus-within:ring-2 focus-within:ring-secondary focus-within:ring-opacity-75 transition-colors duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <UploadIcon className="w-5 h-5" />
        <span>{label}</span>
      </div>
      <input id={id || 'file-input'} type="file" className="hidden" onChange={onChange} accept={accept} disabled={disabled} />
    </label>
  );
};

export const LoadingSpinner: React.FC<{ size?: number; className?: string }> = ({ size = 8, className='' }) => (
  <div className={`animate-spin rounded-full h-${size} w-${size} border-t-2 border-b-2 border-primary ${className}`}></div>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-neutral-dark/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-base-100-light dark:bg-base-200-dark p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-slide-in-up border border-base-300-light dark:border-base-300-dark">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-content-light dark:text-content-dark">{title}</h2>
          <button onClick={onClose} className="text-content-muted-light dark:text-content-muted-dark hover:text-content-light dark:hover:text-content-dark text-2xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const Tabs: React.FC<{ tabs: { label: string; value: string }[]; activeTab: string; onTabChange: (tabValue: string) => void; className?: string }> = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`flex border-b border-base-300-light dark:border-base-300-dark mb-4 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-3 py-2 sm:px-4 sm:py-2 -mb-px font-medium text-sm sm:text-base transition-colors duration-150
            ${activeTab === tab.value
              ? 'border-b-2 border-primary text-primary dark:text-primary'
              : 'border-b-2 border-transparent text-content-muted-light dark:text-content-muted-dark hover:text-content-light dark:hover:text-content-dark hover:border-base-300-light dark:hover:border-base-300-dark/70'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// --- Specific Components ---
export const ThemeToggle: React.FC<{ theme: Theme; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-base-200-light dark:hover:bg-base-300-dark text-content-muted-light dark:text-content-muted-dark transition-colors"
      aria-label={theme === Theme.Dark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
    >
      {theme === Theme.Dark ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
    </button>
  );
};

export const ApiKeyModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (key: string) => void; currentKey: string | null }> = ({ isOpen, onClose, onSave, currentKey }) => {
  const [key, setKey] = useState(currentKey || '');

  useEffect(() => {
    setKey(currentKey || '');
  }, [currentKey, isOpen]);

  const handleSave = () => {
    onSave(key);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cài đặt Khóa API Gemini">
      <div className="space-y-4">
        <p className="text-sm text-content-muted-light dark:text-content-muted-dark">
          Nhập Khóa API Google Gemini của bạn. Khóa của bạn sẽ được lưu trữ cục bộ trong trình duyệt và sẽ không được chia sẻ.
        </p>
        <Input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Nhập Khóa API của bạn"
        />
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="ghost">Hủy</Button>
          <Button onClick={handleSave} variant="primary">Lưu Khóa</Button>
        </div>
      </div>
    </Modal>
  );
};

interface PromptCardProps {
  prompt: GeneratedPrompt;
  onEdit: (id: string, newEnglishText: string, newVietnameseText: string) => void;
  onDelete?: (id: string) => void;
  isSavedPrompt?: boolean;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, onEdit, onDelete, isSavedPrompt = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTextEn, setEditTextEn] = useState(prompt.english);
  const [editTextVi, setEditTextVi] = useState(prompt.vietnamese);

  useEffect(() => {
    setEditTextEn(prompt.english);
    setEditTextVi(prompt.vietnamese);
  }, [prompt.english, prompt.vietnamese, isEditing]); // Reset edit text if prompt changes externally or editing starts

  const handleCopy = (text: string, lang: string) => {
    navigator.clipboard.writeText(text)
      .then(() => alert(`Prompt ${lang} đã được sao chép!`)) // Replace with a toast
      .catch(err => console.error(`Không thể sao chép văn bản ${lang}: `, err));
  };
  
  const handleSaveEdit = () => {
    onEdit(prompt.id, editTextEn, editTextVi);
    setIsEditing(false);
  };

  const PromptDisplayBlock: React.FC<{
    language: string;
    text: string;
    editText: string;
    setEditText: (value: string) => void;
  }> = ({ language, text, editText, setEditText }) => (
    <div className="flex-1 w-full p-3 bg-base-100-light dark:bg-base-100-dark rounded-lg shadow-inner min-h-[150px] flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-primary">{language}</h3>
        <Button onClick={() => handleCopy(isEditing ? editText : text, language)} variant="ghost" className="text-xs px-2 py-1">
          <CopyIcon className="w-4 h-4 mr-1 inline-block"/> Sao chép
        </Button>
      </div>
      {isEditing ? (
        <Input
          isTextArea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          rows={8}
          className="w-full text-sm font-mono flex-grow focus:border-primary !bg-opacity-50 dark:!bg-opacity-50" // ensure bg is slightly different
        />
      ) : (
        <pre className="text-sm text-content-light dark:text-content-dark whitespace-pre-wrap flex-grow font-mono overflow-x-auto p-2">
          {text || `Không có prompt ${language.toLowerCase()} nào.`}
        </pre>
      )}
    </div>
  );

  return (
    <div className="bg-base-200-light dark:bg-base-200-dark dark:hover:bg-gradient-to-br dark:hover:from-base-200-dark dark:hover:to-primary/5 p-4 sm:p-6 rounded-xl shadow-web3-card dark:shadow-web3-card-dark dark:hover:shadow-web3-card-hover-dark animate-fade-in border border-base-300-light dark:border-base-300-dark dark:hover:border-primary/30 transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <PromptDisplayBlock language="English" text={prompt.english} editText={editTextEn} setEditText={setEditTextEn} />
        <PromptDisplayBlock language="Tiếng Việt" text={prompt.vietnamese} editText={editTextVi} setEditText={setEditTextVi} />
      </div>
      
      <div className="flex flex-wrap gap-2 items-center justify-end pt-4 border-t border-base-300-light dark:border-base-300-dark">
        {isEditing ? (
          <Button onClick={handleSaveEdit} variant="primary" className="text-sm px-3 py-1.5"><SaveIcon className="w-4 h-4 mr-1 inline-block"/> Lưu thay đổi</Button>
        ) : (
          <Button onClick={() => setIsEditing(true)} variant="secondary" className="text-sm px-3 py-1.5"><EditIcon className="w-4 h-4 mr-1 inline-block"/> Chỉnh sửa</Button>
        )}
        {onDelete && isSavedPrompt && (
          <Button onClick={() => onDelete(prompt.id)} variant="danger" className="text-sm px-3 py-1.5"><TrashIcon className="w-4 h-4 mr-1 inline-block"/> Xóa</Button>
        )}
      </div>

      {(isSavedPrompt || prompt.fileInfo) && (
         <div className="text-xs text-content-muted-light dark:text-content-muted-dark mt-3 pt-2 border-t border-base-300-light/50 dark:border-base-300-dark/50">
            Chế độ: {prompt.mode || "Không có"}
            {prompt.fileInfo && `, Tệp: ${prompt.fileInfo.name} (${prompt.fileInfo.type})`}
            {prompt.userHint && `, Gợi ý: "${prompt.userHint}"`}
            {isSavedPrompt && `, Đã lưu: ${new Date(prompt.timestamp).toLocaleDateString()}`}
         </div>
      )}
    </div>
  );
};