import React, { useState, useEffect, useRef, useCallback } from 'react';
import LS from '../../../SecureLocalStorage';
import axios from 'axios';
import { ChatboatApiLogApi } from '../Chatbot/service';
import { Button } from '@mui/material'
import { ChatBotTokenBaseUrl, NewBotURL } from '../../../BaseUrl/Baseurl';
const chatbotStyles = `
.response-content {
    margin-top: 8px;
}
.response-media {
    max-width: 100%;
    margin-top: 8px;
    border-radius: 8px;
    overflow: hidden;
}
.response-media img, .response-media video {
    max-width: 100%;
    max-height: 200px;
    display: block;
}
.response-media audio {
    width: 100%;
}
.response-pdf {
    display: inline-block;
    padding: 8px 12px;
    background-color: var(--button-bg);
    color: var(--text-color);
    border-radius: 4px;
    text-decoration: none;
    margin-top: 8px;
}
.response-pdf:hover {
    background-color: var(--accent-color);
    color: white;
}
.chatbot-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--accent-color);
    color: white;
    border: none;
    cursor: pointer;
    z-index: 1000;
    transition: all 0.3s ease;
}
.chatbot-toggle:hover {
    transform: scale(1.1);
}
.chatbot-container {
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 30%;
    height: 60%;
    background-color: var(--bg-colorbot);
    border-radius: 12px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 1000;
    transition: all 0.3s ease;
    border: 1px solid var(--border-color);
}
.chatbot-container.hidden {
    transform: translateY(20px);
    opacity: 0;
    visibility: hidden;
}
.chatbot-header {
    background-color: var(--header-bg);
    padding: 6px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border-color);
}
.chatbot-header-content {
    display: flex;
    align-items: center;
    gap: 5px;
}
.chatbot-icon {
    width: 24px;
    height: 24px;
    color: var(--accent-color);
}
.chatbot-header h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-color);
}
.chatbot-header-actions {
    display: flex;
    gap: 8px;
}
.chatbot-header button {
    background: var(--button-bg);
    border: none;
    color: var(--icon-color);
    cursor: pointer;
    padding: 6px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}
.chatbot-header button:hover {
    color: var(--icon-hover);
    background-color: var(--accent-color);
}
.chatbot-messages {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.message {
    max-width: 80%;
    padding: 8px 12px;
    border-radius: 12px;
    line-height: 1.4;
    font-size: 14px;
    word-wrap: break-word;
    color: var(--text-color);
}
.user-message {
    align-self: flex-end;
    background-color: var(--message-bg-user);
    border-bottom-right-radius: 4px;
}
.bot-message {
    align-self: flex-start;
    background-color: var(--message-bg-bot);
    border-bottom-left-radius: 4px;
    position: relative;
}
.chatbot-input-area {
    padding: 5px;
    border-top: 1px solid var(--border-color);
    background-color: var(--header-bg);
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.chatbot-input-row {
    display: flex;
    gap: 2px;
}
.chatbot-input {
    flex: 1;
    padding: 5px;
    border-radius: 18px;
    border: 1px solid var(--border-color);
    background-color: var(--input-bg);
    color: var(--input-text);
    font-size: 12px;
    outline: none;
    resize: none;
    min-height: 30px;
    max-height: 70px;
}
.chatbot-input:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 1px var(--accent-color);
}
.send-button {
    background-color: var(--accent-color);
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    flex-shrink: 0;
}
.send-button:hover {
    background-color: #357ae8;
}
.send-button:disabled {
    background-color: #666;
    cursor: not-allowed;
}
.file-upload-wrapper {
    position: relative;
}
.file-upload-label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-color: var(--input-bg);
    color: var(--text-color);
    cursor: pointer;
    border: 1px dashed var(--border-color);
    flex-shrink: 0;
}
.file-upload-label:hover {
    border-color: var(--accent-color);
}

.file-upload-input {
    display: none;
}
.chatbot-controls-row {
    display: flex;
    justify-content: space-evenly;
    align-items: revert;
    padding-top: 2px;
}
.model-selector {
    padding: 5px;
    border-radius: 6px;
    background-color: var(--input-bg);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    cursor: pointer;
    font-size: 10px;
    width: 75%;
}
.loading-dots {
    display: inline-flex;
    align-items: center;
    height: 14px;
}
.loading-dots span {
    width: 6px;
    height: 6px;
    margin: 0 2px;
    background-color: var(--text-color);
    border-radius: 50%;
    display: inline-block;
    animation: bounce 1.4s infinite ease-in-out both;
}
.loading-dots span:nth-child(1) {
    animation-delay: -0.32s;
}
.loading-dots span:nth-child(2) {
    animation-delay: -0.16s;
}
@keyframes bounce {
    0%, 80%, 100% {
        transform: scale(0);
    }
    40% {
        transform: scale(1);
    }
}
/* File preview styles */
.file-preview {
    max-width: 100%;
    margin-top: 8px;
    border-radius: 8px;
    overflow: hidden;
}
.file-preview img, .file-preview video {
    max-width: 100%;
    max-height: 200px;
    display: block;
}
.file-preview audio {
    width: 100%;
}
.file-link {
    display: inline-block;
    padding: 8px 12px;
    background-color: var(--button-bg);
    color: var(--text-color);
    border-radius: 4px;
    text-decoration: none;
    margin-top: 8px;
}
.file-link:hover {
    background-color: var(--accent-color);
    color: white;
}
/* Menu styles */
.chatbot-menu {
    position: absolute;
    bottom: 110%;
    background-color: var(--menu-bg);
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    min-width: 150px;
    z-index: 1001;
    display: none;
    border: 1px solid var(--border-color);
}
.chatbot-menu.show {
    display: block;
}
.menu-item {
    padding: 8px 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
}
.menu-item:hover {
    background-color: var(--accent-color);
    color: white;
}
.menu-item svg {
    width: 16px;
    height: 16px;
}
/* Feedback styles */
.feedback-buttons {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    justify-content: flex-end;
}
.feedback-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.feedback-button.copy.active {
    color: var(--accent-color);
}
.feedback-button.copy:hover {
    color: var(--accent-color);
}
.feedback-button.copy {
    transition: color 0.2s ease;
}
.feedback-button.positive:hover {
    color: var(--positive-color);
}
.feedback-button.negative:hover {
    color: var(--negative-color);
}
.feedback-button.active.positive {
    color: var(--positive-color);
}
.feedback-button.active.negative {
    color: var(--negative-color);
}
/* HTML menu styles */
.chatbot-menu-preview {
    padding: 8px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}
.chatbot-menu-preview ul {
    list-style: none;
    padding: 0;
    margin: 8px 0 0 0;
}
.chatbot-menu-preview li {
    padding: 6px 0;
}
.menu-linkchtbot {
    color: var(--accent-color) !important ;
    text-decoration: none;
    // display: flex;
    align-items: center;
    gap: 8px;
}
.menu-linkchtbot:hover {
    text-decoration: underline;
}
.error-message {
    color: var(--negative-color);
    font-size: 0.9em;
    margin-top: 4px;
}
.chatbot-copy-msg {
    color: green;
    font-size: 0.9em;
}
/* Accessibility focus styles */
button:focus, input:focus, textarea:focus, select:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
}
/* Scrollbar styling */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
    background: var(--accent-color);
}
.smooth-scroll {
    scroll-behavior: smooth;
}
#chatbotFileList {
    scrollbar-width: thin;
    scrollbar-color: var(--border-color) var(--bg-colorbot);
    padding-right: 4px; /* Give space for scrollbar */
}
#chatbotFileList::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
#chatbotFileList::-webkit-scrollbar-track {
    background: var(--bg-colorbot);
    border-radius: 3px;
}
#chatbotFileList::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 3px;
}
/* Calculate max-height based on 2 rows (assuming 30px height per item + margins) */
#chatbotFileList {
    max-height: calc(2 * (30px + 6px)); /* 2 rows * (item height + gap) */
    overflow-y: auto;
}
.chatbot-file-chip {
    height: 30px;
    box-sizing: border-box;
    flex-shrink: 0; /* Prevent chips from shrinking */
}
.chatbot-menu-preview {
    margin-top: 12px;
    padding: 8px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.chatbot-menu-preview ul {
    list-style: none;
    padding: 0;
    margin: 8px 0 0 0;
}

.chatbot-menu-preview li {
    padding: 6px 0;
}
`;
const rootStyles = `
:root {
    // --bg-colorbot: #1a1a1a;
    --text-color: #f0f0f0;
    --input-bg: #2d2d2d;
    --input-text: #ffffff;
    --border-color: #444;
    --accent-color: #4d90fe;
    --message-bg-user: #2d2d2d;
    --message-bg-bot: #333333;
    --icon-color: #aaa;
    --icon-hover: #fff;
    --header-bg: #222;
    --button-bg: #3a3a3a;
    --menu-bg: #2a2a2a;
    --positive-color: #4CAF50;
    --negative-color: #F44336;
}
[data-theme="light"] {
    --bg-colorbot: #f5f5f5;
    --text-color: #333333;
    --input-bg: #ffffff;
    --input-text: #333333;
    --border-color: #ddd;
    --accent-color: #1a73e8;
    --message-bg-user: #e3f2fd;
    --message-bg-bot: #ffffff;
    --icon-color: #666;
    --icon-hover: #000;
    --header-bg: #f0f0f0;
    --button-bg: #e0e0e0;
    --menu-bg: #ffffff;
    --positive-color: #4CAF50;
    --negative-color: #F44336;
}`;

const NewChatBot = () => {
    const generateId = (format) => {
        return format.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };
    const [isOpen, setIsOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState("dark");
    const [apiMode, setApiMode] = useState(true);
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showFileMenu, setShowFileMenu] = useState(false);
    const [uploadedFileList, setUploadedFileList] = useState([])
    const [error, setError] = useState('');
    const [copyMessage, setCopyMessage] = useState(false);
    const messagesEndRef = useRef(null);
    const userInputRef = useRef(null);
    const fileUploadRef = useRef(null);
    const fileMenuRef = useRef(null);
    const apiToggleButtonRef = useRef(null);
    const [tokennnnn, setTokennnnn] = useState(null)
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)
    const [addresLocation, setAddresLocation] = useState(null)
    const [sessionId, setSessionId] = useState(generateId("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"));
    const [requestId, setRequestId] = useState(generateId("xxxx-xxxx-xxxx"));
    // const [longitude,setLongitude]=useState(null)
    const [documentUploadState, setDocumentUploadState] = useState(false)
    const DownloadFromURL = (URL) => {
        console.warn("URL", URL)
        if (URL) {
            var link = document.createElement('a');
            link.href = URL;
            link.download = URL?.split('/').pop();
            link.dispatchEvent(new MouseEvent('click'));
        }
    }
    // Initial values from localStorage (as in the original code)
    const sId = localStorage.getItem("sid");
    const chatApiEndpoint = `${NewBotURL}${sId}/chat/`;
    const docApiEndpoint = `${NewBotURL}document/${sId}/chat/`;
    const supportedFileTypes = {
        pdf: ["application/pdf"],
    };


    const addMessage = useCallback((sender, content, type = 'text', mediaUrl = null, uploadedData = [], uuId = null, listComplexType = null, listData = [], fullresponce = null) => {
        console.warn('sender', sender)
        console.warn('content', content)
        console.warn('mediaUrl', mediaUrl)
        console.warn('uploadedData', uploadedData)
        console.warn('listComplexType', listComplexType)
        console.warn('type', type)

        // sender -sender (bot,apiresp)
        // content - user enter message 
        // listComplexType--list complex type
        ///listData --list data for map list

        setMessages(prevMessages => {
            if (type == "TEXT") {
                // Bold: **text**
                let html = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Italic: *text*
                html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
                // Links: [text](url)
                html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
                // Code blocks: ```code```
                html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
                // Inline code: `code`
                html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
                // New lines
                html = html.replace(/\n/g, '<br>');
                return [...prevMessages, { sender, content: html, type: "html", mediaUrl, uuId }]
            }
            if (type == "DOWNLOADABLE") {
                return [...prevMessages, { sender, content, type: type, mediaUrl, uploadedData, uuId }]
            }
            if (type == "COMPLEX" && listComplexType == "LIST") {
                return [...prevMessages, { sender, content, type: "COMPLEXLIST", mediaUrl, uploadedData, uuId, complexListData: listData, message: fullresponce?.data?.complex?.metaData?.message }]
            }
            if (type == "COMPLEX") {
                return [...prevMessages, { sender, content, type: type, mediaUrl, uploadedData, uuId }]
            }
            return [...prevMessages, { sender, content, type, mediaUrl, uuId }]
        });
    }, []);
    const clearError = () => setError('');
    const adjustTextareaHeight = () => {
        if (userInputRef.current) {
            userInputRef.current.style.height = 'auto';
            userInputRef.current.style.height = `${userInputRef.current.scrollHeight}px`;
        }
    };
    const setTheme = useCallback((theme) => {
        setCurrentTheme(theme);
        document.documentElement.setAttribute("data-theme", theme);
        setCurrentTheme(theme);
        if (apiToggleButtonRef.current) {
            apiToggleButtonRef.current.style.backgroundColor = apiMode ? "var(--accent-color)" : "";
            apiToggleButtonRef.current.style.color = apiMode ? "white" : "";
        }
    }, [apiMode]);
    const toggleTheme = useCallback(() => {
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
    }, [currentTheme, setTheme]);
    const toggleApiMode = useCallback(() => {
        setApiMode(prevMode => {
            const newMode = !prevMode;
            addMessage("bot", newMode ? "Switched to API mode." : "Switched to Document mode.");
            return newMode;
        });
    }, [addMessage]);
    const clearChat = () => {
        setMessages([]);
        setUploadedFiles([]);
    };
    const toggleChatbot = () => {
        setIsOpen(prev => {
            const newState = !prev;
            if (newState) {
                setTimeout(() => userInputRef.current?.focus(), 0);
            } else {
                clearChat();
                setSessionId(generateId("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"));
                setRequestId(generateId("xxxx-xxxx-xxxx"));
                addMessage("bot", "Hello! I'm your AI assistant. How can I help you today?");
            }
            return newState;
        });
    };
    const closeChatbot = () => {
        setIsOpen(false);
        clearChat();
        setSessionId(generateId("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"));
        setRequestId(generateId("xxxx-xxxx-xxxx"));
        addMessage("bot", "Hello! I'm your AI assistant. How can I help you today?");
    };
    const setFileInputAccept = (type) => {
        if (fileUploadRef.current) {
            fileUploadRef.current.accept = supportedFileTypes[type]?.join(',') || '*/*';
        }
    };


    ////////////////////////////////

    const handleFileUpload = (files) => {
        const newFiles = Array.from(files).map(file => ({
            d: generateId("xxxx-xxxx-xxxx"),
            name: file.name,
            file // 
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]); // Assuming setUploadedFiles is a state setter function
        clearError(); // Assuming clearError is a function defined elsewhere
    };

    ////////////////////////////////
    // const handleFileUpload = (files) => {
    //     const newFiles = Array.from(files).map(file => ({
    //         ...file,
    //         id: generateId("xxxx-xxxx-xxxx"),
    //         name: file.name,
    //         type: file.type,
    //         size: file.size
    //     }));
    //     setUploadedFiles(prev => [...prev, ...newFiles]);
    //     clearError();
    // };
    const removeFile = (fileId) => {
        setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    };
    const sendMessage = async (transactionid = null) => {
        const messageText = userInput?.trim();
        if (!transactionid && !messageText && uploadedFiles.length === 0) {
            return;
        }
        addMessage("user", messageText);
        setUserInput('');
        setUploadedFiles([]); // Clear files after sending
        // Show loading dots
        addMessage("bot", `<div class="loading-dots"><span></span><span></span><span></span></div>`, 'html');
        try {
            const url = apiMode ? chatApiEndpoint : docApiEndpoint;
            const formData = new FormData();
            const payload = {
                messages: [{
                    role: "user",
                    content: uploadedFiles?.length ? "file upload" : transactionid ? transactionid : userInput
                }],
                tools: [],
                context: {
                    userId: LS.get("LSsEmpCode"),
                    requestId: requestId,
                    sessionId: sessionId,
                    jwtToken: tokennnnn,
                    companyCode: LS.get("LSsCompanyCode"),
                    roleId: LS.get("LSGrobelRoleId"),
                },
                provider: "OPENAI",
                properties: {
                    GPS_LOCATION: addresLocation,
                    GPS_COORDINATE: `${latitude},${longitude}`,
                    CLIENT_IP: "",
                    USER_AGENT: navigator.userAgent,
                    DEVICE_TYPE: navigator.userAgent,
                    OS_TYPE: navigator.platform,
                    REFERRER_URL: window.location.href,
                    PAGE_URL: window.location.href,
                    CHANNEL: "WEBCHAT",
                    LOCATION: {}
                }
            };
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            formData.append("payload", JSON.stringify(payload));
            if (uploadedFiles?.length) {
                Array.from(uploadedFiles).forEach(file => {
                    formData.append("files", file?.file);
                });
            } else {
                const dummyFileContent = "Hello, this is dummy file content";
                const blob = new Blob([dummyFileContent], { type: "text/plain" });
                const dummyFile = new File([blob], "dummy.txt", { type: "text/plain" });
                formData.append("files", dummyFile);
            }



            // Prepare headers
            const headers = {
                "s-secret-key": localStorage.getItem("bai-sk"),
                "Authorization": `Bearer sk_7J-vQR2q56OUI-uG9p-KkwlA_1WoM0oKTUdWOxn8q9w`
            };
            const response = await axios.post(url, formData, { headers });
            if (!response.status == 200) {
                const errorData = response;
                throw new Error(errorData.message || "Failed to send message");
            }
            if (response?.data?.text?.includes("Please upload supporting documents")) {
                setDocumentUploadState(true)
            } else {
                setDocumentUploadState(false)
            }
            setUserInput("")
            setUploadedFileList([])
            setMessages(prevMessages => prevMessages.filter(msg => !msg.content?.includes("loading-dots")));
            console.warn("response", response)
            if (response.data?.text) {
                addMessage("bot", response.data?.text, response.data?.type, null, response?.data?.complex?.data?.length ? response?.data?.complex?.data : [], response?.data?.uuId, response);
                const LogBody = {
                    sCompanyCode: LS.get('LSsCompanyCode'),
                    EndPoint: chatApiEndpoint,
                    sApiInputName: "",
                    sApiOutput: response?.status,
                    Thread_id: response.data?.uuId,
                    UserMessage: userInput,
                    ChatBotResponse: response.data?.text || "",
                    Status: "",
                    sEmpCode: LS.get("LSsEmpCode"),
                };
                return ChatboatApiLogApi(LogBody)
            }
            if (response.data?.type == "DOWNLOADABLE") {
                return addMessage("bot", response.data, response.data?.type, null, [], response?.data?.uuId, response?.data?.complex?.metaData?.type, response?.data?.complex?.data, response);
            }
            // let CreateBotMsg = response.data?.menu?.map(vv => vv.name).join(',\n')
            return addMessage("bot", response.data?.menu, response.data?.type, null, [], response?.data?.uuId, response?.data?.complex?.metaData?.type, response?.data?.complex?.data, response);
        } catch (error) {
            setError(error.message || "An error occurred.");
            // Remove loading dots if an error occurs
            setMessages(prevMessages => prevMessages.filter(msg => !msg.content?.includes("loading-dots")));
            addMessage("bot", "Sorry, I'm having trouble connecting right now. Please try again later.");
        } finally {
            userInputRef.current.style.height = 'auto'; // Reset textarea height
        }
    };
    const LikeDislikeHandler = async ({ uuid, message }) => {
        let URL = `${chatApiEndpoint}${message}/${uuid}`
        const headers = {
            "s-secret-key": localStorage.getItem("bai-sk"),
            "Authorization": `Bearer sk_7J-vQR2q56OUI-uG9p-KkwlA_1WoM0oKTUdWOxn8q9w`
        };
        // Make sure to pass the headers as the second argument to the axios.put method
        const response = await axios.put(URL, {}, { headers });
        if (response?.status == 200) {
            setMessages((prev) => {
                let copy = [...prev]
                let FindIndex = copy?.findIndex(vv => vv?.uuId == uuid)
                let EditVal = copy[FindIndex]
                EditVal = { ...EditVal, LikeDislike: message }
                copy[FindIndex] = EditVal
                return copy
            })
        }
    }
    // Scrolls to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Initialize theme and initial message on component mount
    useEffect(() => {
        setTheme(currentTheme);
        const styleTag = document.createElement('style');
        styleTag.innerHTML = rootStyles + chatbotStyles;
        document.head.appendChild(styleTag);
        return () => {
            document.head.removeChild(styleTag);
        };
    }, [addMessage, currentTheme, setTheme]);
    useEffect(async () => {
        localStorage.setItem('bai-sk', 'sk_7J-vQR2q56OUI-uG9p-KkwlA_1WoM0oKTUdWOxn8q9w')
        localStorage.setItem('sid', 'PRqa55Js4bRqs-Vcj20HqA')
        localStorage.setItem('documentId', '2000021')
        const handleClickOutside = (event) => {
            if (fileMenuRef.current && !fileMenuRef.current.contains(event.target)) {
                setShowFileMenu(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);
    // Update API mode button style
    useEffect(() => {
        if (apiToggleButtonRef.current) {
            apiToggleButtonRef.current.style.backgroundColor = apiMode ? "var(--accent-color)" : "";
            apiToggleButtonRef.current.style.color = apiMode ? "white" : "";
        }
    }, [apiMode]);
    useEffect(async () => {
        addMessage("bot", "Hello! I'm your AI assistant. How can I help you today?");
        let token = await fetch(ChatBotTokenBaseUrl, {
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer sk_7J-vQR2q56OUI-uG9p-KkwlA_1WoM0oKTUdWOxn8q9w`
            },
            method: "POST",
            body: JSON.stringify({
                sCompanyCode: LS.get("LSsCompanyCode"),
                UserName: LS.get("LSsEmpCode"),
                SecretKey: "YIn72vUt3FL3AP80"
            })
        }).then(resp => resp.json())
        setTokennnnn(token.TokenId)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (potion) => {
                let FindAddress = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${potion.coords.latitude}&lon=${potion.coords.longitude}&addressdetails=1`).then(resp => resp.json())
                setAddresLocation(FindAddress?.display_name)
                setLongitude(potion.coords.longitude)
                setLatitude(potion.coords.latitude)
            })
        }
    }, [])

    useEffect(() => {
        let JoinData = uploadedFileList?.join(',')
        setUserInput(JoinData)
    }, [uploadedFileList])

    return (
        <>
            <button className="chatbot-toggle" aria-label="Open chatbot" onClick={toggleChatbot}>
                <i className='fa-solid fa-paper-plane' />
            </button>
            {
                isOpen ? <div className={`chatbot-container `}
                              style={{ background: currentTheme == "dark" ? "#1a1a1a" : "#f5f5f5" }}
                >
                    <div className="chatbot-header">
                        <div style={{ color: 'white' }} className="chatbot-header-content">
                        </div>
                        <div className="chatbot-header-actions">
                            <button
                                aria-label="Toggle API mode"
                                onClick={toggleApiMode}
                                ref={apiToggleButtonRef}
                            >
                                <i className='fa-solid fa-file' />
                            </button>
                            <button aria-label="Toggle theme" onClick={toggleTheme}>
                                <i className="fa-solid fa-sun" />
                            </button>
                            <button aria-label="Toggle theme" onClick={() => setMessages([])}>
                                <i className="fa-solid fa-refresh" />
                            </button>
                            <button aria-label="Close chatbot" onClick={closeChatbot}>
                                <i className='fa-solid fa-xmark' />
                            </button>

                        </div>
                    </div>
                    <div className="chatbot-messages" role="log" aria-live="polite">
                        {messages
                            ?.filter(vv => (vv?.content?.length && vv?.sender == "user") || (vv?.sender == "bot"))
                            ?.map((msg, index) => (
                                <div key={index} id={msg?.uuId} className={`message ${msg.sender}-message`} onClick={() => console.warn(msg)}>
                                    {
                                        msg?.type === "MENU" ?
                                            msg?.content?.map((menulist) => (
                                                <li onClick={() => {
                                                    setUserInput(menulist?.name)
                                                }}>
                                                    <a style={{ cursor: 'pointer', color: '#4d90fe' }} className="menu-linkchtbot" >
                                                        {menulist?.name}
                                                    </a>
                                                </li>
                                            )) :

                                            msg.type === "DOWNLOADABLE" ?
                                                <div className="response-content">
                                                    <span>Click below button to download file :</span>
                                                    <br />
                                                    <br />
                                                    <Button
                                                        sx={{ textTransform: 'none' }}
                                                        type="button"
                                                        variant="contained"
                                                        onClick={() => {
                                                            console.warn("msg?.content", msg)
                                                            console.warn("msg?.content", msg?.content)
                                                            DownloadFromURL(msg?.content?.link)
                                                        }}
                                                    >
                                                        Download
                                                    </Button>
                                                    <br />
                                                    {/* <a
                                                        href={msg?.content}
                                                        title='click here to download'
                                                        style={{ color: '#0a9dce', fontWeight: 700, textDecoration: 'underline' }}
                                                        target="_blank"
                                                        className="response-download"
                                                    >
                                                        <u> {msg?.content?.split('/').pop()}</u>
                                                    </a> */}

                                                </div>
                                                :
                                                msg.type === 'COMPLEX' ?
                                                    <div
                                                        onClick={() => {
                                                            console.warn(msg)
                                                        }}
                                                        style={{ marginTop: '10px', fontSize: '13px', color: 'gray' }}
                                                        key={msg?.uuId}
                                                    >
                                                        <span style={{ color: 'var(--text-color)', fontSize: '11px' }}> {msg?.content}</span><br />
                                                        <span style={{ color: 'var(--text-color)', fontSize: '11px' }}> Please submit one of the documents below to proceed </span>
                                                        <br />
                                                        <strong>Uploaded Documents:</strong>

                                                        {
                                                            msg?.uploadedData?.map(uplodlist => (
                                                                <div

                                                                    style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}
                                                                >
                                                                    <label
                                                                        style={{ display: 'flex', background: " var(--input-bg)", color: "var(--input-text)", border: "1px solid var(--border-color)", alignItems: 'center', padding: '6px 10px', borderRadius: '18px', fontSize: '13px', gap: "6px", cursor: 'pointer', maxWidth: '100%' }}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            value={uplodlist?.fileName}
                                                                            style={{ marginRight: '6px' }}
                                                                            onChange={(event) => {
                                                                                setUploadedFileList((prev) => {
                                                                                    let DataCopy = [...prev]
                                                                                    if (event?.target.checked) {
                                                                                        DataCopy = [...DataCopy, uplodlist?.fileName]
                                                                                        return DataCopy
                                                                                    }
                                                                                    let Remove = DataCopy?.filter(vvv => vvv != uplodlist?.fileName)
                                                                                    return Remove
                                                                                })
                                                                            }}
                                                                        />
                                                                        <span
                                                                            title={uplodlist?.fileName}
                                                                            style={{
                                                                                maxWidth: '120px',
                                                                                whiteSpace: 'nowrap'
                                                                            }}
                                                                        >
                                                                            {uplodlist?.fileName}

                                                                        </span>
                                                                        <a
                                                                            href={uplodlist?.fileUrl}
                                                                            target="_blank"
                                                                            style={{ color: '#4d90fe', marginLeft: '6px' }}
                                                                        >📄</a>
                                                                    </label>

                                                                </div>
                                                            ))
                                                        }

                                                    </div> :
                                                    msg?.type == "COMPLEXLIST" ? (
                                                            <div className="chatbot-menu-preview">
                                                                <strong>{msg?.message}</strong>
                                                                <ul>
                                                                    {msg?.complexListData?.map((valval) => (
                                                                        <li>
                                                                        <span style={{ cursor: 'pointer' }} className="menu-linkchtbot" onClick={() => {
                                                                            // setUserInput(valval?.key)
                                                                            sendMessage(valval?.key)
                                                                        }}>
                                                                            {valval?.value}
                                                                        </span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ) :

                                                        msg.type === 'html' ? (
                                                            <span dangerouslySetInnerHTML={{ __html: msg.content }}></span>
                                                        ) : (
                                                            <span>{msg.content}</span>
                                                        )
                                    }
                                    <div className="feedback-buttons" hidden={msg?.uuId?.length ? false : true}>
                                        <button className={`feedback-button positive ${msg?.LikeDislike == "thumbsUp" ? "active" : ""}`} onClick={() => {
                                            LikeDislikeHandler({
                                                uuid: msg?.uuId,
                                                message: "thumbsUp"
                                            })
                                        }}>
                                            <i className="fa-regular fa-thumbs-up" ></i>
                                        </button>

                                        <button

                                            // className="feedback-button negative" 
                                            className={`feedback-button negative ${msg?.LikeDislike == "thumbsDown" ? "active" : ""}`}
                                            onClick={() => {
                                                LikeDislikeHandler({
                                                    uuid: msg?.uuId,
                                                    message: "thumbsDown"
                                                })
                                            }}>
                                            <i className="fa-regular fa-thumbs-down"></i>
                                        </button>

                                        <button className="feedback-button copy" onClick={() => {
                                            let contentElement = document.getElementById(msg?.uuId);
                                            if (contentElement) {
                                                const textarea = document.createElement('textarea');
                                                textarea.value = contentElement.textContent; // Get the text content of the div
                                                document.body.appendChild(textarea); // Append it to the body
                                                textarea.select(); // Select the content
                                                document.execCommand('copy'); // Copy the content to clipboard
                                                document.body.removeChild(textarea);
                                                setCopyMessage(true)
                                                setTimeout(() => {
                                                    setCopyMessage(false)
                                                }, 2000)
                                            } else {
                                                console.error('Element not found');
                                            }
                                        }}>
                                            <i className="fa-regular fa-copy"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        <div ref={messagesEndRef} /> {/* Scroll to this element */}
                    </div>
                    <div className="chatbot-input-area">
                        <div className="chatbot-input-row">
                            <textarea
                                className="chatbot-input"
                                id="chatbotUserInput"
                                placeholder="Type your message..."
                                rows="1" // Start with 1 row, adjust dynamically
                                aria-label="Chat input"
                                value={userInput}
                                onChange={(e) => {
                                    setUserInput(e.target.value);
                                    adjustTextareaHeight();
                                    clearError();
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                                ref={userInputRef}
                            ></textarea>

                            <button
                                className="send-button"
                                id="chatbotSendButton"
                                aria-label="Send message"
                                onClick={() => sendMessage()}
                                disabled={userInput.trim() === '' && uploadedFiles.length === 0}
                            >
                                <i className='fa-solid fa-paper-plane' />
                            </button>
                        </div>

                        <div id="chatbotFileList" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', overflowY: 'auto' }}>
                            {uploadedFiles.map(file => (
                                <div onClick={() => {
                                    console.warn(file)
                                }} key={file.id} className="chatbot-file-chip" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--input-bg)', borderRadius: '15px', padding: '4px 10px', gap: '5px', fontSize: '12px', color: 'var(--text-color)' }}>
                                    <span>{file.name}</span>
                                    <button
                                        onClick={() => removeFile(file.id)}
                                        style={{ background: 'none', border: 'none', color: 'var(--icon-color)', cursor: 'pointer', padding: '0', fontSize: '14px', lineHeight: '1' }}
                                        aria-label={`Remove file ${file.name}`}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="chatbot-controls-row" hidden={apiMode ? false : true}>
                            <div className="file-upload-wrapper">
                                <button
                                    className="file-upload-label"
                                    role="button"
                                    aria-label="Upload file"
                                    hidden={!documentUploadState}
                                    tabIndex="0"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowFileMenu(prev => !prev);
                                    }}
                                >
                                    <i className='fa-solid fa-upload' />
                                    <input
                                        type="file"
                                        id="chatbotFileUpload"
                                        className="file-upload-input"
                                        aria-hidden="true"
                                        ref={fileUploadRef}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                handleFileUpload(e.target.files);
                                            }
                                        }}
                                        multiple
                                    />
                                </button>
                                <div className={`chatbot-menu ${showFileMenu ? 'show' : ''}`} ref={fileMenuRef}>
                                    {Object.keys(supportedFileTypes).map(type => (
                                        <div
                                            key={type}
                                            className="menu-item"
                                            data-type={type}
                                            onClick={() => {
                                                setFileInputAccept(type);
                                                fileUploadRef.current.click();
                                                setShowFileMenu(false);
                                            }}
                                        >

                                            {type === 'pdf' && (
                                                <i className='fa-solid fa-file-text' />
                                            )}

                                            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <select className="model-selector" id="chatbotModelSelector" aria-label="Select AI model" style={{ alignSelf: 'end' }}>
                                <option value="OPENAI">OpenAI</option>
                                <option value="DEEPSEEK">DeepSeek</option>
                            </select>

                        </div>
                        {error && <div id="chatbotError" className="error-message">{error}</div>}
                        {copyMessage && <div id="chatbotCopyMsg" className="chatbot-copy-msg">Copied!</div>}
                    </div>
                </div> : null
            }

        </>
    );
};
export default NewChatBot;