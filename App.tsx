
import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode, ChangeEvent } from 'react';
import { HashRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { Theme, PromptMode, GeneratedPrompt, ApiKeyContextType, ThemeContextType } from './types';
import { LOCAL_STORAGE_API_KEY, LOCAL_STORAGE_THEME_KEY, APP_TITLE, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB, LOCAL_STORAGE_SAVED_PROMPTS_KEY } from './constants';
import { generatePrompt, translateText, generatePromptFromMedia } from './services/geminiService';
import { 
  Button, Input, LoadingSpinner, ApiKeyModal, PromptCard, ThemeToggle, SparklesIcon,
  Tabs, SunIcon, MoonIcon, TrashIcon, FileInput, UploadIcon
} from './components.tsx';

// --- Contexts ---
const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useApiKey = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (!context) throw new Error('useApiKey must be used within an ApiKeyProvider');
  return context;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

// --- Providers ---
const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyInternal] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem(LOCAL_STORAGE_API_KEY);
    if (storedKey) {
      setApiKeyInternal(storedKey);
    } else {
      setIsModalOpen(true); 
    }
  }, []);

  const setApiKey = (key: string | null) => {
    if (key) {
      localStorage.setItem(LOCAL_STORAGE_API_KEY, key);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_API_KEY);
    }
    setApiKeyInternal(key);
  };
  
  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, isModalOpen, openModal: () => setIsModalOpen(true), closeModal: () => setIsModalOpen(false) }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme | null;
    return storedTheme || Theme.Dark;
  });

  useEffect(() => {
    document.documentElement.classList.remove(Theme.Light, Theme.Dark);
    document.documentElement.classList.add(theme);
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === Theme.Light ? Theme.Dark : Theme.Light));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


// --- Layout Components ---
const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { openModal } = useApiKey();

  return (
    <header className="bg-base-100-light dark:bg-neutral-dark shadow-md sticky top-0 z-40 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            <SparklesIcon className="w-8 h-8"/>
            <span>{APP_TITLE}</span>
          </Link>
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            <NavLink to="/" className={({isActive}) => `px-2 py-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium ${isActive ? 'text-primary dark:text-primary bg-primary/10 dark:bg-primary/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>Trang chủ</NavLink>
            <NavLink to="/generator" className={({isActive}) => `px-2 py-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium ${isActive ? 'text-primary dark:text-primary bg-primary/10 dark:bg-primary/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>Tạo Prompt</NavLink>
            <Button onClick={openModal} variant="ghost" className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">Khóa API</Button>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
      </nav>
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-base-200-light dark:bg-neutral-dark text-center py-8 mt-12 border-t border-gray-300 dark:border-gray-700">
    <p className="text-gray-600 dark:text-gray-400 text-sm">&copy; {new Date().getFullYear()} {APP_TITLE}. Đã đăng ký bản quyền.</p>
    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Sáng tạo với AI dành cho người đam mê AI.</p>
  </footer>
);

const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-base-100-light dark:bg-base-100-dark text-gray-800 dark:text-gray-100 transition-colors duration-300">
    <Header />
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
    <Footer />
  </div>
);

// --- Page Content Components ---
const HomePageContent: React.FC = () => {
  useEffect(() => {
    document.title = `${APP_TITLE} - Trang Chủ`;
  }, []);

  return (
    <div className="space-y-16 animate-fade-in">
      <section className="text-center py-16 md:py-24 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent dark:from-primary/70 dark:via-secondary/70 dark:to-accent/70 shadow-2xl animate-pulse-glow">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Mở Khóa Sáng Tạo AI với <span className="block sm:inline">{APP_TITLE}</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10">
          Tạo prompt mạnh mẽ, có cấu trúc cho văn bản, hình ảnh và video. Tăng tốc quy trình làm việc AI của bạn với công cụ trực quan, lấy cảm hứng từ Web3 của chúng tôi.
        </p>
        <Link to="/generator">
          <Button variant="primary" className="text-lg px-8 py-4 bg-blue text-primary hover:bg-gray-100 shadow-xl">
            Bắt đầu Tạo Prompt <SparklesIcon className="w-5 h-5 ml-2 inline"/>
          </Button>
        </Link>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        {[
          { title: "Prompt Văn Bản & Media", description: "Tạo prompt qua văn bản chi tiết hoặc tải lên hình ảnh/video để AI phân tích và mô tả.", icon: <SparklesIcon className="w-12 h-12 text-primary mx-auto mb-4"/> },
          { title: "Đa Ngôn Ngữ", description: "Prompt được tạo ra bằng tiếng Anh và tiếng Việt, hiển thị song song để dễ dàng so sánh.", icon: <MoonIcon className="w-12 h-12 text-secondary mx-auto mb-4"/> },
          { title: "Lưu & Chỉnh Sửa Thư Viện", description: "Lưu giữ những prompt tốt nhất của bạn, chỉnh sửa bất cứ lúc nào và xây dựng thư viện hướng dẫn AI yêu thích.", icon: <SunIcon className="w-12 h-12 text-accent mx-auto mb-4"/> }
        ].map(feature => (
          <div key={feature.title} className="p-8 bg-base-200-light dark:bg-base-200-dark rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 text-center">
            {feature.icon}
            <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
          </div>
        ))}
      </section>
      
      <section className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Tại sao chọn {APP_TITLE}?</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Nền tảng của chúng tôi kết hợp AI tiên tiến với giao diện đẹp mắt, thân thiện với người dùng. Sử dụng phương pháp tiếp cận có cấu trúc để thiết kế prompt, hoặc tạo prompt trực tiếp từ media của bạn. Tận hưởng kết quả đa ngôn ngữ, khả năng chỉnh sửa prompt mạnh mẽ và lưu trữ cục bộ các sáng tạo yêu thích của bạn.
          </p>
      </section>
    </div>
  );
};

const StructuredInputItem: React.FC<{
  id: string;
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}> = ({ id, label, description, value, onChange, placeholder, rows = 3 }) => (
  <div className="mb-6 p-4 border border-base-300-light dark:border-base-300-dark rounded-lg bg-base-100-light dark:bg-base-200-dark/30 shadow-sm">
    <label htmlFor={id} className="block text-lg font-semibold text-primary mb-1">{label}</label>
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{description}</p>
    <Input
      isTextArea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="text-sm"
    />
  </div>
);

const PromptGeneratorPageContent: React.FC = () => {
  const { apiKey, openModal } = useApiKey();
  
  const [currentInputMode, setCurrentInputMode] = useState<'structured' | 'image' | 'video'>('structured');
  
  // Structured input states
  const [taskInput, setTaskInput] = useState('');
  const [contextInput, setContextInput] = useState('');
  const [requirementsInput, setRequirementsInput] = useState('');
  const [languageFormatInput, setLanguageFormatInput] = useState('');
  const [examplesInput, setExamplesInput] = useState('');

  // Media input states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [mediaUserHint, setMediaUserHint] = useState('');
  
  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompt[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<GeneratedPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSavedPromptsTab, setActiveSavedPromptsTab] = useState<'current' | 'saved'>('current');

  const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/heic', 'image/heif'];
  const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/mpeg', 'video/mov', 'video/avi', 'video/x-flv', 'video/webm', 'video/x-matroska', 'image/gif'];


  useEffect(() => {
    document.title = `${APP_TITLE} - Tạo Prompt`;
    if (!apiKey) {
      openModal();
    }
    const storedSavedPrompts = localStorage.getItem(LOCAL_STORAGE_SAVED_PROMPTS_KEY);
    if (storedSavedPrompts) {
      setSavedPrompts(JSON.parse(storedSavedPrompts));
    }
  }, [apiKey, openModal]);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSelectedFile(null);
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFilePreviewUrl(null);

    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`Tệp quá lớn. Kích thước tối đa là ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    if (currentInputMode === 'image' && !ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError(`Loại tệp ảnh không hợp lệ. Các loại được chấp nhận: ${ACCEPTED_IMAGE_TYPES.map(t=>t.split('/')[1]).join(', ')}.`);
      return;
    }
    if (currentInputMode === 'video' && !ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      setError(`Loại tệp video không hợp lệ. Các loại được chấp nhận: ${ACCEPTED_VIDEO_TYPES.map(t=>t.split('/')[1]).join(', ')}.`);
      return;
    }
    
    setSelectedFile(file);
    if (currentInputMode === 'image' && ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setFilePreviewUrl(URL.createObjectURL(file));
    }
    e.target.value = ''; // Reset file input
  };
  
  const resetInputs = () => {
    // Structured
    setTaskInput('');
    setContextInput('');
    setRequirementsInput('');
    setLanguageFormatInput('');
    setExamplesInput('');
    // Media
    setSelectedFile(null);
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFilePreviewUrl(null);
    setMediaUserHint('');
    setError(null);
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      openModal();
      setError("Cần có Khóa API để tạo prompt.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedPrompts([]); 

    let englishPromptCore = "";
    let promptModeToSet: PromptMode = PromptMode.Text;
    let fileInfoPayload: GeneratedPrompt['fileInfo'] | undefined = undefined;
    let userHintPayload: string | undefined = undefined;
    let originalInputPayload: string | undefined = undefined;

    try {
      if (currentInputMode === 'structured') {
        promptModeToSet = PromptMode.Structured;
        if (!taskInput.trim() || !contextInput.trim()) {
          setError("Đối với nhập liệu có cấu trúc, vui lòng điền ít nhất 'Nhiệm vụ' và 'Ngữ cảnh'.");
          setIsLoading(false);
          return;
        }
        const combinedUserInput = `Vui lòng tạo một prompt AI chất lượng cao, sẵn sàng sử dụng dựa trên các thông số kỹ thuật chi tiết sau.
Kết quả cuối cùng CHỈ NÊN là chính prompt đó, không lặp lại các tiêu đề mục (Nhiệm vụ, Ngữ cảnh, v.v.) và không có bất kỳ nhận xét giới thiệu hoặc kết luận nào.

[Task]:
${taskInput}

[Context]:
${contextInput}

[Requirements]:
${requirementsInput}

[Language/Format Output for the final prompt]:
${languageFormatInput}

[Examples (optional, to guide the style of the final prompt)]:
${examplesInput}
`;
        originalInputPayload = combinedUserInput;
        englishPromptCore = await generatePrompt(apiKey, combinedUserInput);
      } else if (currentInputMode === 'image' || currentInputMode === 'video') {
        promptModeToSet = currentInputMode === 'image' ? PromptMode.Image : PromptMode.Video;
        if (!selectedFile) {
          setError(`Vui lòng chọn một tệp ${currentInputMode === 'image' ? 'hình ảnh' : 'video'}.`);
          setIsLoading(false);
          return;
        }
        fileInfoPayload = { name: selectedFile.name, type: selectedFile.type };
        userHintPayload = mediaUserHint.trim() || undefined;
        englishPromptCore = await generatePromptFromMedia(apiKey, selectedFile, mediaUserHint);
      } else {
        throw new Error("Chế độ nhập không hợp lệ.");
      }
      
      let vietnamesePromptCore = "Đang chờ dịch sang tiếng Việt hoặc dịch thất bại.";
      if (englishPromptCore && englishPromptCore.trim() !== "") {
        try {
          vietnamesePromptCore = await translateText(apiKey, englishPromptCore, 'Vietnamese');
        } catch (translateError) {
          console.warn("Không thể dịch sang tiếng Việt:", translateError);
           vietnamesePromptCore = `Lỗi dịch: ${(translateError as Error).message}`;
        }
      } else if (!englishPromptCore || englishPromptCore.trim() === "") {
         englishPromptCore = "Tạo prompt thất bại hoặc trả về rỗng.";
         vietnamesePromptCore = "Tạo prompt thất bại hoặc trả về rỗng."; // Ensure VI also has this error
      }

      let finalEnglishPrompt = englishPromptCore;
      let finalVietnamesePrompt = vietnamesePromptCore;

      if (promptModeToSet === PromptMode.Image) {
        const englishPrefix = "Generate an image with the following request: ";
        const vietnamesePrefix = "Tạo ảnh theo yêu cầu sau: ";
        finalEnglishPrompt = englishPrefix + englishPromptCore;
        // Prefix Vietnamese even if it's an error/fallback, to maintain structure
        finalVietnamesePrompt = vietnamesePrefix + vietnamesePromptCore; 
      } else if (promptModeToSet === PromptMode.Video) {
        const englishPrefix = "Generate a video with the following request: ";
        const vietnamesePrefix = "Tạo video theo yêu cầu sau: ";
        finalEnglishPrompt = englishPrefix + englishPromptCore;
        finalVietnamesePrompt = vietnamesePrefix + vietnamesePromptCore;
      }
      
      const newPrompt: GeneratedPrompt = {
        id: Date.now().toString(),
        english: finalEnglishPrompt,
        vietnamese: finalVietnamesePrompt,
        mode: promptModeToSet,
        timestamp: Date.now(),
        ...(originalInputPayload && { originalInput: originalInputPayload }),
        ...(fileInfoPayload && { fileInfo: fileInfoPayload }),
        ...(userHintPayload && { userHint: userHintPayload }),
      };
      setGeneratedPrompts([newPrompt]); 
      setActiveSavedPromptsTab('current');

    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi không xác định trong quá trình tạo prompt.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPrompt = (id: string, newEnglishText: string, newVietnameseText: string) => {
    const updater = (prev: GeneratedPrompt[]) => 
      prev.map(p => p.id === id ? {...p, english: newEnglishText, vietnamese: newVietnameseText} : p);
    
    if (activeSavedPromptsTab === 'current') {
      setGeneratedPrompts(updater);
    }
    setSavedPrompts(prevSaved => {
        const updated = updater(prevSaved);
        localStorage.setItem(LOCAL_STORAGE_SAVED_PROMPTS_KEY, JSON.stringify(updated));
        return updated;
    });
  };

  const handleSavePrompt = (promptToSave: GeneratedPrompt) => {
    const updatedSavedPrompts = [promptToSave, ...savedPrompts.filter(p => p.id !== promptToSave.id)];
    setSavedPrompts(updatedSavedPrompts);
    localStorage.setItem(LOCAL_STORAGE_SAVED_PROMPTS_KEY, JSON.stringify(updatedSavedPrompts));
    alert("Đã lưu prompt!"); // Replace with toast
  };
  
  const handleDeleteSavedPrompt = (id: string) => {
    const updatedSavedPrompts = savedPrompts.filter(p => p.id !== id);
    setSavedPrompts(updatedSavedPrompts);
    localStorage.setItem(LOCAL_STORAGE_SAVED_PROMPTS_KEY, JSON.stringify(updatedSavedPrompts));
  };
  
  const inputModeTabs = [
    { label: 'Văn bản cấu trúc', value: 'structured' },
    { label: 'Từ hình ảnh', value: 'image' },
    { label: 'Từ video', value: 'video' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="p-4 sm:p-6 md:p-8 bg-base-200-light dark:bg-base-200-dark rounded-xl shadow-xl border border-primary/30">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-white">Studio Tạo Prompt</h2>
        
        <Tabs
          tabs={inputModeTabs}
          activeTab={currentInputMode}
          onTabChange={(mode) => {
            setCurrentInputMode(mode as 'structured' | 'image' | 'video');
            resetInputs(); 
            setGeneratedPrompts([]); 
          }}
          className="mb-6"
        />

        {currentInputMode === 'structured' && (
          <div className="space-y-4 animate-fade-in">
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              Sử dụng các trường dưới đây để xác định chính xác prompt AI bạn muốn tạo. Càng nhiều chi tiết, kết quả càng tốt.
            </p>
            <StructuredInputItem id="task-input" label="📌 Nhiệm vụ" description="Mô tả những gì bạn muốn AI làm (ví dụ: Viết, Thiết kế, Tạo)." value={taskInput} onChange={setTaskInput} placeholder="VD: Tạo mô tả hình ảnh cảnh quan thành phố cyberpunk." rows={2} />
            <StructuredInputItem id="context-input" label="📋 Ngữ cảnh" description="Cung cấp thông tin nền hoặc mục tiêu tổng thể (ví dụ: cho trình tạo nghệ thuật AI, đối tượng mục tiêu)." value={contextInput} onChange={setContextInput} placeholder="VD: Cho Midjourney, hướng tới phong cách điện ảnh và u ám." rows={3}/>
            <StructuredInputItem id="requirements-input" label="🧠 Yêu cầu" description="Liệt kê các nhu cầu cụ thể (ví dụ: định dạng, độ dài, phong cách, từ khóa). Sử dụng gạch đầu dòng." value={requirementsInput} onChange={setRequirementsInput} placeholder="- Đèn neon, tòa nhà cao tầng, ô tô bay.\n- Thời tiết mưa, ban đêm, không khí bí ẩn." rows={4}/>
            <StructuredInputItem id="language-format-input" label="🌐 Ngôn ngữ/Định dạng" description="Chỉ định kết quả mong muốn (ví dụ: văn bản, JSON, tiếng Anh & tiếng Việt)." value={languageFormatInput} onChange={setLanguageFormatInput} placeholder="VD: Kết quả dạng văn bản. Chỉ tiếng Anh." rows={2}/>
            <StructuredInputItem id="examples-input" label="🧪 Ví dụ (Tùy chọn)" description="Cung cấp ví dụ để hướng dẫn phong cách của AI." value={examplesInput} onChange={setExamplesInput} placeholder="VD: 'Ảnh một khu rừng thanh bình, giờ vàng, phong cách điện ảnh.'" rows={3}/>
          </div>
        )}

        {(currentInputMode === 'image' || currentInputMode === 'video') && (
          <div className="space-y-6 animate-fade-in">
             <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              Tải lên một tệp {currentInputMode === 'image' ? 'hình ảnh' : 'video'}. AI sẽ phân tích và tạo ra một prompt mô tả.
              Bạn có thể thêm một gợi ý tùy chọn để hướng dẫn quá trình tạo.
            </p>
            <div>
              <FileInput 
                id="media-file-input"
                onChange={handleFileChange} 
                accept={currentInputMode === 'image' ? ACCEPTED_IMAGE_TYPES.join(',') : ACCEPTED_VIDEO_TYPES.join(',')}
                label={`Chọn tệp ${currentInputMode === 'image' ? 'Ảnh' : 'Video'}`}
                disabled={isLoading}
              />
              {selectedFile && <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">Đã chọn: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>}
            </div>

            {currentInputMode === 'image' && filePreviewUrl && (
              <div className="mt-4 p-2 border border-base-300-light dark:border-base-300-dark rounded-lg inline-block shadow-sm">
                <img src={filePreviewUrl} alt="Xem trước ảnh đã chọn" className="max-w-xs max-h-64 rounded"/>
              </div>
            )}
            
            <div>
              <label htmlFor="media-hint-input" className="block text-sm font-medium text-content-light dark:text-content-dark mb-1">Gợi ý tùy chọn</label>
              <Input
                id="media-hint-input"
                isTextArea
                value={mediaUserHint}
                onChange={(e) => setMediaUserHint(e.target.value)}
                placeholder={`VD: Tập trung vào cảm xúc. Mô tả theo phong cách nghệ thuật giả tưởng. Tối đa 150 ký tự.`}
                rows={2}
                className="text-sm"
                maxLength={150}
              />
            </div>
          </div>
        )}
        
        {error && <p className="mt-4 text-red-500 dark:text-red-400 text-sm p-3 bg-red-500/10 rounded-md">{error}</p>}
        
        <Button onClick={handleGenerate} disabled={isLoading} variant="primary" className="w-full sm:w-auto mt-6 py-3 text-base">
          {isLoading ? <LoadingSpinner size={5} className="mr-2 inline-block" /> : <SparklesIcon className="w-5 h-5 mr-2 inline-block"/>}
          Tạo Prompt Tinh Chỉnh
        </Button>
      </section>

      <section>
         <Tabs
            tabs={[
              { label: `Prompt Hiện Tại (${generatedPrompts.length})`, value: 'current' },
              { label: `Prompt Đã Lưu (${savedPrompts.length})`, value: 'saved' },
            ]}
            activeTab={activeSavedPromptsTab}
            onTabChange={(tab) => setActiveSavedPromptsTab(tab as 'current' | 'saved')}
          />

        {isLoading && activeSavedPromptsTab === 'current' && (
          <div className="flex flex-col justify-center items-center py-10 text-center">
            <LoadingSpinner size={12} />
            <p className="ml-0 mt-4 text-lg">Đang tạo kiệt tác của bạn...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Quá trình này có thể mất một chút thời gian, đặc biệt đối với tệp media.</p>
          </div>
        )}
        
        {activeSavedPromptsTab === 'current' && !isLoading && generatedPrompts.length === 0 && (
           <p className="text-center text-gray-500 dark:text-gray-400 py-6">Prompt được tạo của bạn sẽ xuất hiện ở đây.</p>
        )}

        {activeSavedPromptsTab === 'current' && generatedPrompts.map((prompt) => (
          <div key={prompt.id} className="mb-6 mt-4">
            <PromptCard prompt={prompt} onEdit={handleEditPrompt} />
            {prompt.english !== "Prompt generation failed." && !prompt.english.startsWith("Prompt generation failed") && 
             !prompt.english.startsWith("Generate an image with the following request: Tạo prompt thất bại") && 
             !prompt.english.startsWith("Generate a video with the following request: Tạo prompt thất bại") && (
              <Button onClick={() => handleSavePrompt(prompt)} variant="secondary" className="mt-3 text-sm px-3 py-1.5 float-right">
                  <SparklesIcon className="w-4 h-4 mr-1 inline-block"/> Lưu Prompt Này
              </Button>
            )}
            <div className="clear-both"></div> {/* Clear float */}
          </div>
        ))}
        
        {activeSavedPromptsTab === 'saved' && (
          savedPrompts.length > 0 ? (
            <div className="space-y-6 mt-4">
              {savedPrompts.map((prompt) => (
                 <PromptCard key={prompt.id} prompt={prompt} onEdit={handleEditPrompt} onDelete={handleDeleteSavedPrompt} isSavedPrompt={true} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-6">Bạn chưa lưu prompt nào. Hãy tạo và lưu lại những prompt yêu thích của bạn!</p>
          )
        )}
      </section>
    </div>
  );
};


// --- App Component ---
function App() {
  return (
    <ThemeProvider>
      <ApiKeyProvider>
        <HashRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePageContent />} />
              <Route path="/generator" element={<PromptGeneratorPageContent />} />
            </Routes>
          </MainLayout>
          <ApiKeyModalWrapper />
        </HashRouter>
      </ApiKeyProvider>
    </ThemeProvider>
  );
}

// Helper component to use context for ApiKeyModal
const ApiKeyModalWrapper: React.FC = () => {
  const { apiKey, setApiKey, isModalOpen, closeModal } = useApiKey();
  return <ApiKeyModal isOpen={isModalOpen} onClose={closeModal} onSave={setApiKey} currentKey={apiKey} />;
}

export default App;
