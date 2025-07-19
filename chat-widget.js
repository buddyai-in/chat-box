    // Complete Chatbot Implementation with File Support, HTML Menu, Feedback, and Response Handling
    document.addEventListener('DOMContentLoaded', function() {
        // Create and inject the chatbot HTML structure
        const chatbotHTML = `
        <style>
            :root {
                --custom-header-bg:#222;
                --bg-color: #1a1a1a;
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
                --custom-header-bg: #1a73e8;
                --bg-color: #f5f5f5;
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
            }
            
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
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: var(--accent-color);
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
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
                width: 450px;
                height: 600px;
                background-color: var(--bg-color);
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
                background-color: var(--custom-header-bg);
                padding: 12px 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid var(--border-color);
            }

            .chatbot-header-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .chatbot-icon {
                width: 24px;
                height: 24px;
                color: var(--accent-color);
            }

            .chatbot-header h3 {
                margin: 0;
                font-size: 16px;
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
                padding: 12px;
                display: flex;
                flex-direction: column;
                gap: 8px;
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
                padding: 12px;
                border-top: 1px solid var(--border-color);
                background-color: var(--header-bg);
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .chatbot-input-row {
                display: flex;
                gap: 8px;
                flex-direction: column;
            }

            .chatbot-input {
                flex: 1;
                padding: 10px 12px;
                border-radius: 18px;
                border: 1px solid var(--border-color);
                background-color: var(--input-bg);
                color: var(--input-text);
                font-size: 14px;
                outline: none;
                resize: none;
                min-height: 40px;
                max-height: 120px;
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
                width: 40px;
                height: 40px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s;
                padding-top: 2px;
                flex-shrink: 0;
                padding-left: 3px;
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
                width: 40px;
                height: 40px;
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

            .file-upload-label svg {
                pointer-events: none;
            }

            .file-upload-input {
                display: none;
            }

            .chatbot-controls-row {
                display: flex;
                justify-content: space-between;
                align-items: revert;
                padding-top: 2px;
            }

            .model-selector {
                padding: 10px;
                border-radius: 6px;
                background-color: var(--input-bg);
                color: var(--text-color);
                border: 1px solid var(--border-color);
                cursor: pointer;
                font-size: 12px;
                
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
                bottom: 114%;
                left: 0;
                background-color: var(--menu-bg);
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                padding: 8px;
                min-width: 200px;
                z-index: 1001;
                display: none;
                border: 1px solid var(--border-color);
            }
            
            .chatbot-menu.show {
                display: block;
            }
            
            .menu-item {
                padding: 8px 12px;
                cursor: pointer;
                border-radius: 4px;
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

            .menu-link {
                color: var(--accent-color);
                text-decoration: none;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .menu-link:hover {
                text-decoration: underline;
            }

            /* Error message */
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

            ::-webkit-scrollbar-track {
                background: var(--bg-color);
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
                scrollbar-color: var(--border-color) var(--bg-color);
                padding-right: 4px; /* Give space for scrollbar */
            }

            #chatbotFileList::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }

            #chatbotFileList::-webkit-scrollbar-track {
                background: var(--bg-color);
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

            .default-prompt-input {
                transition: all 0.3s ease;
                height: 30px;
                font-size: 13px;
                padding: 6px 10px;
                border-radius: 12px;
                border: 1px solid var(--border-color);
                background-color: var(--input-bg);
                color: var(--input-text);
                width: 100%;
                resize: none;
            }

            .default-prompt-input:focus {
                height: 60px;
                font-size: 14px;
                border-color: var(--accent-color);
                box-shadow: 0 0 0 1px var(--accent-color);
            }

            
            .chatbot-default-input {
                width: 100%;
                padding: 10px 12px;
                border-radius: 18px;
                border: 1px solid var(--border-color);
                background-color: var(--input-bg);
                color: var(--input-text);
                font-size: 14px;
                outline: none;
                height: 40px;
                max-height: 40px;
                transition: all 0.2s ease;
                resize: none;
                overflow-y: auto;
                box-sizing: border-box;
                scrollbar-width: thin;
                scrollbar-color: var(--border-color) var(--bg-color);
            }

            .chatbot-default-input::-webkit-scrollbar {
                width: 6px;
            }

            .chatbot-default-input::-webkit-scrollbar-track {
                background: var(--bg-color);
                border-radius: 3px;
            }

            .chatbot-default-input::-webkit-scrollbar-thumb {
                background-color: var(--border-color);
                border-radius: 3px;
            }

            .chatbot-default-input::-webkit-scrollbar-thumb:hover {
                background-color: var(--accent-color);
            }

            .chatbot-default-input:focus {
                border-color: var(--accent-color);
                box-shadow: 0 0 0 1px var(--accent-color);
            }

            .reset-chat {
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

            .reset-chat:hover {
                color: var(--icon-hover);
                background-color: var(--accent-color);
            }

        </style>

        <button id="chatbotToggle" class="chatbot-toggle" aria-label="Open chatbot">
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
        </button>

        <div id="chatbotContainer" class="chatbot-container hidden">
            <div class="chatbot-header">
                <div style="color:white" class="chatbot-header-content">
                <!--    <img style="height:30px" src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" -->
                <!--    <h3>BuddyAI</h3> -->
                </div>
                <div class="chatbot-header-actions">
                    <button class="api-toggle" aria-label="Toggle API mode">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 2H4C2.89543 2 2 2.343 2 4V20C2 21.105 2.89543 22 4 22H20C21.105 22 22 21.105 22 20V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M21.5 2.5L16 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M15 2.5L21 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="theme-toggle" aria-label="Toggle theme">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor"/>
                            <path d="M12 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M12 20V22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M4.92993 4.92999L6.33993 6.33999" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M17.6599 17.66L19.0699 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M2 12H4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M20 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M6.33993 17.66L4.92993 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M19.0699 4.92999L17.6599 6.33999" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                    <button class="reset-chat" aria-label="Reset chat">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 6V9L16 5L12 1V4C7.58 4 4 7.58 4 12C4 13.57 4.46 15.03 5.24 16.26L6.7 14.8C6.25 13.97 6 13.01 6 12C6 8.69 8.69 6 12 6ZM18.76 7.74L17.3 9.2C17.74 10.04 18 10.99 18 12C18 15.31 15.31 18 12 18V15L8 19L12 23V20C16.42 20 20 16.42 20 12C20 10.43 19.54 8.97 18.76 7.74Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="close-chatbot" aria-label="Close chatbot">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="chatbot-messages" id="chatbotMessages" role="log" aria-live="polite">
                <!-- Messages will be inserted here -->
            </div>
            
            <div class="chatbot-input-area">
                <div class="chatbot-input-row">
                    <textarea 
                        class="chatbot-input" 
                        id="chatbotUserInput" 
                        placeholder="Type your message..." 
                        rows="4"
                        aria-label="Chat input"
                    ></textarea>
                   <textarea 
                        id="defaultPromptInput" 
                        placeholder="Enter default prompt..." 
                        class="chatbot-default-input" 
                        rows="1"
                    ></textarea>
                </div>          
                <div id="chatbotFileList" class="chatbot-file-list" style="display: flex; flex-direction: row; gap: 6px; margin-top: 10px; flex-wrap: wrap; max-height: 72px; overflow-y: auto;"></div>
                <div class="chatbot-controls-row">
                    <div class="file-upload-wrapper">
                        <button class="file-upload-label" role="button" aria-label="Upload file" tabindex="0" id="fileMenuButton">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input type="file" id="chatbotFileUpload" class="file-upload-input" aria-hidden="true" accept="image/*,video/*,audio/*,.pdf,.html" multiple>
                        </button>
                        
                        <div class="chatbot-menu" id="fileMenu">
                            <div class="menu-item" data-type="image">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 16L8.586 11.414C8.961 11.039 9.47 10.828 10 10.828C10.53 10.828 11.039 11.039 11.414 11.414L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M14 14L15.586 12.414C15.961 12.039 16.47 11.828 17 11.828C17.53 11.828 18.039 12.039 18.414 12.414L20 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M3 20H21C21.552 20 22 19.552 22 19V5C22 4.448 21.552 4 21 4H3C2.448 4 2 4.448 2 5V19C2 19.552 2.448 20 3 20Z" stroke="currentColor" stroke-width="2"/>
                                </svg>
                                <span>Image</span>
                            </div>
                            <div class="menu-item" data-type="video">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M14 5H3C1.895 5 1 5.895 1 7V17C1 18.105 1.895 19 3 19H14C15.105 19 16 18.105 16 17V7C16 5.895 15.105 5 14 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span>Video</span>
                            </div>
                            <div class="menu-item" data-type="audio">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 1C10.343 1 9 2.343 9 4V12C9 13.657 10.343 15 12 15C13.657 15 15 13.657 15 12V4C15 2.343 13.657 1 12 1Z" stroke="currentColor" stroke-width="2"/>
                                    <path d="M19 10V12C19 15.866 15.866 19 12 19C8.134 19 5 15.866 5 12V10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M12 19V23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                                <span>Audio</span>
                            </div>
                            <div class="menu-item" data-type="pdf">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 2H6C4.895 2 4 2.895 4 4V20C4 21.105 4.895 22 6 22H18C19.105 22 20 21.105 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M8 12H10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M8 16H10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M14 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M14 16H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                                <span>PDF</span>
                            </div>
                            <div class="menu-item" data-type="html">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 3H20L18.5 19.5L12 21L5.5 19.5L4 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M17 7H7.5L8 12H16.5L16 17L12 18L8 17L7.75 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span>HTML</span>
                            </div>
                        </div>
                    </div>
                    
                    <select class="model-selector" id="chatbotModelSelector" aria-label="Select AI model" style="align-self:end">
                        <option value="OPENAI">OpenAI</option>  
                        <option value="DEEPSEEK">DeepSeek</option> 
                    </select>
                    
                    <button class="send-button" id="chatbotSendButton" aria-label="Send message" disabled>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div id="chatbotError" class="error-message"></div>
                <div id="chatbotCopyMsg" class="chatbot-copy-msg"></div>
            </div>
        </div>
        `;

        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if(isLoggedIn) {
            // Inject the chatbot HTML into the body
            document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        }

        // Chatbot Class
        class Chatbot {

            constructor() {
                // DOM elements
                this.container = document.getElementById('chatbotContainer');
                this.toggleButton = document.getElementById('chatbotToggle');
                this.messagesContainer = document.getElementById('chatbotMessages');
                this.userInput = document.getElementById('chatbotUserInput');
                this.defaultPrompt = document.getElementById('defaultPromptInput');
                this.sendButton = document.getElementById('chatbotSendButton');
                this.fileUpload = document.getElementById('chatbotFileUpload');
                this.fileMenuButton = document.getElementById('fileMenuButton');
                this.fileMenu = document.getElementById('fileMenu');
                this.modelSelector = document.getElementById('chatbotModelSelector');
                this.themeToggle = document.querySelector('.theme-toggle');
                this.apiToggle = document.querySelector('.api-toggle');
                this.closeButton = document.querySelector('.close-chatbot');
                this.errorDisplay = document.getElementById('chatbotError');
                this.chatbotCopyMsg = document.getElementById('chatbotCopyMsg');
                this.resetButton = document.querySelector('.reset-chat');

                // State
                this.isOpen = false;
                this.currentTheme = localStorage.getItem('chatbot-theme') || 'dark';
                this.apiMode = true;
                this.sessionId = this.generateSessionId();
                this.requestId = this.generateRequestId();
                this.uploadedFiles = [];
                this.messageFeedback = {};
                this.selectedDocumentFiles = [];

                this.sId = localStorage.getItem('sid');
                this.sdocumentIdId = localStorage.getItem('documentId');
                // Configuration
                let env = localStorage.getItem('profile');
                
            this.chatApiEndpoint = 'https://'+env+'.api.chat.buddyai.in/v2/api/'+this.sId+'/chat/';
            this.docApiEndpoint = 'https://'+ env+'api.chat.buddyai.in/v2/api/document/'+this.sId+'/chat/';
                this.supportedFileTypes = {
                    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
                    video: ['video/mp4', 'video/webm', 'video/ogg'],
                    audio: ['audio/mpeg', 'audio/ogg', 'audio/wav'],
                    pdf: ['application/pdf'],
                    html: ['text/html']
                };

                // Initialize state

                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                if(true) {
                    // Initialize
                    this.init();
                }

            }

            init() {
                // Set initial theme
                this.setTheme(this.currentTheme);
                this.sId = localStorage.getItem('sid');

                // Event listeners
                this.toggleButton.addEventListener('click', () => this.toggleChatbot());
                this.closeButton.addEventListener('click', () => this.closeChatbot());
                this.themeToggle.addEventListener('click', () => this.toggleTheme());
                this.apiToggle.addEventListener('click', () => this.toggleApiMode());

                this.userInput.addEventListener('input', () => {
                    this.sendButton.disabled = this.userInput.value.trim() === '' && this.uploadedFiles.length === 0 && this.defaultPrompt.value.trim() === '';
                    this.clearError();
                });

                this.defaultPrompt.addEventListener('input', () => {
                    this.sendButton.disabled = this.userInput.value.trim() === '' && this.uploadedFiles.length === 0 && this.defaultPrompt.value.trim() === '';
                    this.clearError();
                });

                this.userInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (!this.sendButton.disabled) {
                            this.sendMessage();
                        }
                    }
                });

                this.sendButton.addEventListener('click', () => this.sendMessage());

                // File menu handlers
                this.fileMenuButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.fileMenu.classList.toggle('show');
                });

                document.addEventListener('click', () => {
                    this.fileMenu.classList.remove('show');
                });

                this.fileMenu.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const menuItem = e.target.closest('.menu-item');
                    if (menuItem) {
                        const type = menuItem.dataset.type;
                        this.setFileInputAccept(type);
                        this.fileUpload.click();
                        this.fileMenu.classList.remove('show');
                    }
                });

                this.fileUpload.addEventListener('change', () => {
                    if (this.fileUpload.files && this.fileUpload.files.length > 0) {
                        this.handleFileUpload(this.fileUpload.files);
                    }
                });

                // Initial welcome message
                setTimeout(() => {
                    this.addMessage('bot', "Hello! I'm your AI assistant. How can I help you today?");
                }, 500);

                const defaultPromptInput = document.getElementById('defaultPromptInput');
                defaultPromptInput.addEventListener('input', () => {
                    defaultPromptInput.style.height = 'auto';
                    defaultPromptInput.style.height = Math.min(defaultPromptInput.scrollHeight, 120) + 'px';
                });

                this.resetButton.addEventListener('click', () => this.resetChat());
            }

            generateSessionId() {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        const r = Math.random() * 16 | 0;
                        const v = c === 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
            }

            generateRequestId() {
                return  'xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
                    const r = Math.random() * 16 | 0;
                    const v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }

            getAuthToken() {
                // In a real implementation, you would get this from your auth system
                return localStorage.getItem('jwt');
            }

            getsSecretKey() {
                // In a real implementation, you would get this from your auth system
                return localStorage.getItem('bai-sk');
            }

            getUserId() {
                return localStorage.getItem('userId');
            }

            toggleChatbot() {
                this.isOpen = !this.isOpen;
                if (this.isOpen) {
                    this.container.classList.remove('hidden');
                    this.userInput.focus();
                } else {
                    this.container.classList.add('hidden');
                    // Clear chat and generate new session when closed
                    this.clearChat();
                    this.requestId = this.generateRequestId();
                    this.sessionId = this.generateSessionId();
                    this.addMessage('bot', "Hello! I'm your AI assistant. How can I help you today?");
                }
            }

            clearChat() {
                this.messagesContainer.innerHTML = '';
                this.uploadedFiles = [];
                this.messageFeedback = {};
            }

            closeChatbot() {
                this.isOpen = false;
                this.container.classList.add('hidden');
                // Clear chat and generate new session when closed
                this.clearChat();
                this.sessionId = this.generateSessionId();
                this.requestId = this.generateRequestId();
                this.addMessage('bot', "Hello! I'm your AI assistant. How can I help you today?");
            }

            setTheme(theme) {
                this.currentTheme = theme;
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('chatbot-theme', theme);
            }

            toggleTheme() {
                const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
                this.setTheme(newTheme);
            }

            toggleApiMode() {
                this.apiMode = !this.apiMode;
                this.apiToggle.style.backgroundColor = this.apiMode ? 'var(--accent-color)' : '';
                this.apiToggle.style.color = this.apiMode ? 'white' : '';
                this.addMessage('bot', this.apiMode ?
                    'Switched to API mode.' :
                    'Switched to Document mode.');
                
                if (this.fileMenuButton) {
                    this.fileMenuButton.style.display = this.apiMode ? 'flex' : 'none';
                }
            }

            setFileInputAccept(type) {
                this.fileUpload.accept = this.supportedFileTypes[type].join(',');
            }

            handleFileUpload(files) {

                const newFiles = Array.from(files);

            newFiles.forEach(file => {
            this.uploadedFiles.push(file);
            const fileId = this.generateMessageId();

            const fileChip = document.createElement('div');
            fileChip.classList.add('chatbot-file-chip');
            fileChip.setAttribute('data-id', fileId);
            fileChip.style.cssText = `
                display: flex;
                align-items: center;
                background: var(--input-bg);
                color: var(--input-text);
                padding: 4px 8px;
                border-radius: 20px;
                font-size: 13px;
                border: 1px solid var(--border-color);
                gap: 6px;
                width: 135px;
            `;

            fileChip.innerHTML = `
                <span style="white-space: nowrap; max-width: 100px; overflow: hidden; text-overflow: ellipsis;">${file.name}</span>
                <button style="background: none; border: none; color: red; font-size: 14px; cursor: pointer;" aria-label="Remove file">❌</button>
            `;

            fileChip.querySelector('button').addEventListener('click', () => {
                this.uploadedFiles = this.uploadedFiles.filter(f => f.name !== file.name);
                fileChip.remove();
                this.sendButton.disabled = this.userInput.value.trim() === '' && this.uploadedFiles.length === 0 && this.defaultPrompt.value.trim() === '';
            });

            document.getElementById('chatbotFileList').appendChild(fileChip);
        });

        this.sendButton.disabled = this.userInput.value.trim() === '' && this.uploadedFiles.length === 0 && this.defaultPrompt.value.trim() === '';


            }

            getFileType(mimeType) {
                for (const [type, mimes] of Object.entries(this.supportedFileTypes)) {
                    if (mimes.includes(mimeType)) {
                        return type;
                    }
                }
                return 'file';
            }

            formatFileSize(bytes) {
                if (bytes === 0) return '0 Bytes';
                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
            }

            adjustTextareaHeight() {
                this.userInput.style.height = 'auto';
                this.userInput.style.height = Math.min(this.userInput.scrollHeight, 120) + 'px';
            }

            clearError() {
                this.errorDisplay.textContent = '';
            }

            showError(message) {
                this.errorDisplay.textContent = message;
            }

            clearCopyMsg() {
                this.chatbotCopyMsg.textContent = '';
            }

            showCopyMsg(message) {
                this.chatbotCopyMsg.textContent = message;
            }

            async sendMessage() {
                let userText = this.userInput.value.trim();
                let df = this.defaultPrompt.value.trim();

                if (userText === '' && this.uploadedFiles.length === 0 && df === '') return;

                console.log('apiMode:', this.apiMode);

                // Add user message to chat
                if (userText) {
                    this.addMessage('user', userText);
                }

                if (userText === '') {
                    userText = 'file upload';
                }

                this.userInput.value = '';
                this.userInput.style.height = '40px';
                this.sendButton.disabled = true;

                // Add loading indicator for bot response
                const botMessage = this.addMessage('bot', '');

                try {
                    // Prepare the request
                    const formData = new FormData();
                    const payload = {
                        messages: [
                            {
                                role: "user",
                                content: userText,
                            }
                        ],
                        tools: [],
                        context: {
                            userId: this.getUserId(),
                            requestId: this.requestId,
                            sessionId: this.sessionId,
                            jwtToken: this.getAuthToken(),
                        },
                        provider: this.modelSelector.value,
                        properties: {}
                    };

                    if (!this.apiMode) {
                        const obj = {
                            documentId: localStorage.getItem('documentId'),
                            type : "MULTI_FILE",
                            clientId : "2000003"
                        }
                        payload.properties = obj
                    }

                    if (df !== '') {
                        payload.messages.push({
                            role: "system",
                            content: df,
                        });
                    };
                    
                    // Add JSON payload to FormData
                    formData.append('payload', JSON.stringify(payload));

                    if (this.apiMode) {
                        const dummyContent = new Blob(["Hello, this is dummy file content"], { type: "text/plain" });
                        const dummyFile = new File([dummyContent], "dummy.txt", { type: "text/plain" });
                        formData.append('files',dummyFile);
                    } else {
                        // Add all uploaded files
                        this.uploadedFiles.forEach(file => {
                            formData.append('files', file);
                        });
                    }
                    
                let url = this.chatApiEndpoint;
                if (!this.apiMode) {
                    url = this.docApiEndpoint;
                    // Add sessionId to payload for document mode
                    payload.context.sessionId = this.sessionId;
                }

                

                // if (defaultPrompt !== '') {
                //     userText = defaultPrompt;
                // }

                // Make API call
                    const response = await fetch(url, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            "Authorization": "Bearer " + this.getsSecretKey(),
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`API request failed with status ${response.status}`);
                    }

                    const data = await response.json();


                    // const documentData = `
                    //     {
                    //         "text": "File upload successful. Please enter your query.",
                    //         "menu": null,
                    //         "form": null,
                    //         "link": null,
                    //         "type": "COMPLEX",
                    //         "downloadablePath": null,
                    //         "complex": {
                    //             "metaData": {
                    //                 "header": [
                    //                     "fileName",
                    //                     "fileUrl"
                    //                 ],
                    //                 "type": "DOCUMENT_UPLOAD_LIST"
                    //             },
                    //             "data": [
                    //                 {
                    //                     "fileName": "output.pdf",
                    //                     "fileType": null,
                    //                     "fileUrl": "https://buddyai-document.s3.amazonaws.com/rt56-gh89-6bg7-LTTS04-output.pdf",
                    //                     "fileId": null
                    //                 },
                    //                  {
                    //                     "fileName": "output1.pdf",
                    //                     "fileType": null,
                    //                     "fileUrl": "https://buddyai-document.s3.amazonaws.com/rt56-gh89-6bg7-LTTS04-output.pdf",
                    //                     "fileId": null
                    //                 },
                    //                  {
                    //                     "fileName": "output2.pdf",
                    //                     "fileType": null,
                    //                     "fileUrl": "https://buddyai-document.s3.amazonaws.com/rt56-gh89-6bg7-LTTS04-output.pdf",
                    //                     "fileId": null
                    //                 }
                    //             ]
                    //         },
                    //         "uuId": "738f212b-9b02-48ca-b481-7d1e99bdb922",
                    //         "requestId": "rt56-gh89-6bg7",
                    //         "stateType": null
                    //     }
                    // `;

                    // const data = JSON.parse(documentData); // Simulating API response for testing   
                    // console.log('API Response:', data);

                    // Process the response
                    if (data) {
                        const messageId = data.uuId;
                        let botResponseContent = '';

                        // Handle different response types
                        if (data.type === "TEXT" && data.text && this.apiMode == true) {
                            // Text response
                            botResponseContent = this.renderMarkdown(data.text);
                        } else if (data.type === "MENU") {
                            botResponseContent = this.renderHtmlMenu(data.menu);
                        } else if (data.choices && data.choices.length > 0 && data.choices[0].message) {
                            // OpenAI-style response
                            botResponseContent = this.renderMarkdown(data.choices[0].message.content);
                        } else if (data.type === "COMPLEX" && data.complex) {
                            
                            console.log('in complex');

                            // IMAGES
                            if (data.complex.metaData.type === "IMAGE" && data.complex.data && data.complex.data.length > 0) {
                                botResponseContent = '<div class="response-images">';
                                data.complex.data.forEach(image => {
                                    botResponseContent += `
                                        <div class="response-media" style="margin-bottom: 20px;">
                                            <img src="${image.link}" alt="${image.photographer || 'Image'}" 
                                                style="display: block; max-width: 100%; height: auto; border-radius: 8px;">
                                            
                                            <div style="margin-top: 5px; text-align: left;display: flex;align-items:center;gap: 7px"">
                                                <p style="margin: 0;">${image.photographer || ''}</p>
                                                <a href="javascript:void(0)" onclick="window.chatbot.forceDownloadImage('${image.link}', '${image.link.split('/').pop()}')"
                                                title="Download image"
                                                style="
                                                        display: inline-flex; 
                                                        justify-content: center; 
                                                        align-items: center; 
                                                        margin-top: 6px; 
                                                        padding: 3px; 
                                                        border: 1px solid black; 
                                                        border-radius: 6px; 
                                                        cursor: pointer; 
                                                        transition: all 0.3s ease;
                                                        box-shadow: 0 1px 4px rgba(0,0,0,0.1);
                                                ">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="black" style="transform: rotate(180deg);">
                                                        <path d="M5 20h14v-2H5v2zm7-18L5.33 9h4.34v6h4.66V9h4.34L12 2z"/>
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    `;
                                });
                                botResponseContent += '</div>';
                            }


                            // VIDEOS
                            if (data.complex.metaData.type === "VIDEO" && data.complex.data && data.complex.data.length > 0) {
                                botResponseContent = '<div class="response-videos">';
                                data.complex.data.forEach((video, index) => {
                                    botResponseContent += `
                                        <div class="response-media" style="margin-bottom: 20px;">
                                            <video controls style="display: block; max-width: 100%; height: auto; border-radius: 8px;">
                                                <source src="${video.link}" type="video/mp4">
                                                Your browser does not support the video tag.
                                            </video>

                                            <div style="margin-top: 5px; text-align: left;display: flex;align-items:center;gap: 7px">
                                                <p style="margin: 0;">${video.link.split('/').pop() || ''}</p>
                                                <a href="javascript:void(0)" onclick="window.chatbot.forceDownloadImage('${video.link}', '${video.link.split('/').pop()}')"
                                                title="Download video"
                                                style="
                                                        display: inline-flex; 
                                                        justify-content: center; 
                                                        align-items: center; 
                                                        margin-top: 6px; 
                                                        padding: 2px; 
                                                        border: 1px solid black; 
                                                        border-radius: 6px; 
                                                        cursor: pointer;    
                                                        transition: all 0.3s ease;
                                                        box-shadow: 0 1px 4px rgba(0,0,0,0.1);
                                                ">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="black" style="transform: rotate(180deg);">
                                                        <path d="M5 20h14v-2H5v2zm7-18L5.33 9h4.34v6h4.66V9h4.34L12 2z"/>
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    `;
                                });
                                botResponseContent += '</div>';  
                            }


                            // DOCUMENT
                            if (data.complex.metaData.type === "TEXT") { 
                                    const responseText = this.renderMarkdown(data.complex.data.response);
                                    let referenceText = '';

                                    if (data.complex.data.documents && data.complex.data.documents.length > 0) {
                                        referenceText += `<div style="margin-top: 10px; font-size: 13px; color: gray;">Source(s):<br>`;
                                        data.complex.data.documents.forEach((doc, index) => {
                                            const pages = doc.pages.join(', ');
                                            referenceText += `&bull; <strong>${doc.fileName}</strong> (Pages: ${pages})<br>`;
                                        });
                                        referenceText += `</div>`;
                                    }

                                    botResponseContent = responseText + referenceText;
                            }

                            // "DOCUMENT_UPLOAD_LIST"

                            if (data.complex.metaData.type === "DOCUMENT_UPLOAD_LIST") { 
                            console.log('in "DOCUMENT_UPLOAD_LIST"');

                            const responseText = this.renderMarkdown(data.text);
                          let referenceText = `
                                <div style="margin-top: 10px; font-size: 13px; color: gray;">
                                    <strong>Uploaded Documents:</strong><br>
                                    <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
                            `;

                            if (data.complex.data && data.complex.data.length > 0) {
                                data.complex.data.forEach(doc => {
                                    const fileId = this.generateMessageId(); // unique ID
                                    const fileName = doc.fileName;
                                    const fileUrl = doc.fileUrl;

                                    referenceText += `
                                        <label for="${fileId}" style="
                                            display: flex;
                                            align-items: center;
                                            background: var(--input-bg);
                                            color: var(--input-text);
                                            padding: 6px 10px;
                                            border-radius: 18px;
                                            font-size: 13px;
                                            border: 1px solid var(--border-color);
                                            gap: 6px;
                                            cursor: pointer;
                                             max-width: 50%;
                                        ">
                                            <input 
                                                type="checkbox" 
                                                id="${fileId}" 
                                                value="${fileName}" 
                                                style="margin-right: 6px;"
                                            />
                                            <span title="${fileName}" style="max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                                ${fileName}
                                            </span>
                                            <a href="${fileUrl}" target="_blank" style="color: var(--accent-color); margin-left: 6px;">📄</a>
                                        </label>
                                    `;
                                });
                            }

                            referenceText += `</div></div>`;
                            botResponseContent = responseText + referenceText;

                            // Delay DOM binding
                            setTimeout(() => {
                                const checkboxes = document.querySelectorAll('.bot-message input[type="checkbox"]');
                                checkboxes.forEach(checkbox => {
                                    checkbox.addEventListener('change', (e) => {
                                        const name = e.target.value;
                                        if (e.target.checked) {
                                            if (!this.selectedDocumentFiles.includes(name)) {
                                                this.selectedDocumentFiles.push(name);
                                            }
                                        } else {
                                            this.selectedDocumentFiles = this.selectedDocumentFiles.filter(f => f !== name);
                                        }
                                        console.log("Selected file names:", this.selectedDocumentFiles.join(', '));
                                        this.userInput.value = this.selectedDocumentFiles.join(', ');
                                        this.sendButton.disabled = this.userInput.value.trim() === '';                                        
                                    });
                                });
                            }, 100);
                        }                         
                        // "DOCUMENT_UPLOAD_LIST"
                        }

                    
                        // Handle media attachments in response
                        if (data.attachments && data.attachments.length > 0) {
                            data.attachments.forEach(attachment => {
                                if (attachment.type.startsWith('image/')) {
                                    botResponseContent += `
                                        <div class="response-media">
                                            <img src="${attachment.url}" alt="${attachment.name || 'Image'}">
                                        </div>
                                    `;
                                } else if (attachment.type.startsWith('video/')) {
                                    botResponseContent += `
                                        <div class="response-media">
                                            <video controls>
                                                <source src="${attachment.url}" type="${attachment.type}">
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    `;
                                } else if (attachment.type.startsWith('audio/')) {
                                    botResponseContent += `
                                        <div class="response-media">
                                            <audio controls>
                                                <source src="${attachment.url}" type="${attachment.type}">
                                                Your browser does not support the audio element.
                                            </audio>
                                        </div>
                                    `;
                                } else if (attachment.type === 'application/pdf') {
                                    botResponseContent += `
                                        <div class="response-content">
                                            <a href="${attachment.url}" class="response-pdf" download="${attachment.name || 'document.pdf'}">
                                                Download PDF: ${attachment.name || 'document.pdf'}
                                            </a>
                                        </div>
                                    `;
                                }
                            });
                        }

                        // Check for HTML content in response
                        if (data.htmlMenu) {
                            botResponseContent += this.renderHtmlMenu(data.htmlMenu);
                        }

                        // Add feedback buttons
                        botResponseContent += this.renderFeedbackButtons(messageId);

                        botMessage.innerHTML = botResponseContent;
                        botMessage.dataset.messageId = messageId;


                        document.querySelectorAll('.menu-link').forEach(link => {
                            if (!link._clickListenerAdded) { 
                                link.addEventListener('click', (e) => {
                                    const name = e.currentTarget.getAttribute('data-name');
                                    this.userInput.value = name;
                                    this.sendMessage();
                                });
                                link._clickListenerAdded = true;
                            }
                        });

                        // Store the message data for feedback tracking
                        this.messageFeedback[messageId] = {
                            message: data,
                            feedback: null
                        };
                    } else {
                        throw new Error('Invalid response format from API');
                    }

                
                    this.assignEventListenersToFeedbackButtons();
                    // Clear uploaded files after successful send
                    this.uploadedFiles = [];
                    this.fileUpload.value = '';

                    document.getElementById('chatbotFileList').innerHTML = '';

                } catch (error) {
                    console.error('API Error:', error);
                    this.showError('Failed to get response from AI. Please try again.');
                    botMessage.remove();
                }
            }

            generateMessageId() {
                return Date.now().toString(36) + Math.random().toString(36).substr(2);
            }

        renderHtmlMenu(menuItems) {
                if (!menuItems || !menuItems.length) return '';

                let html = '<div class="chatbot-menu-preview"><strong>Menu Options:</strong><ul>';

                menuItems.forEach(item => {
                    html += `
                            <li>
                                <a style="cursor:pointer" class="menu-link" data-name="${item.name}">
                                    ${item.icon ? `<img src="${item.icon}" alt="" width="16">` : ''}
                                    ${item.name}
                                </a>
                            </li>
                        `;
                });

                html += '</ul></div>';
                return html;
            }

            renderFeedbackButtons(messageId) {
                return `
                    <div class="feedback-buttons">
                        <button class="feedback-button positive" data-message-id="${messageId}" aria-label="Positive feedback">
                            <svg width="13" height="13" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.017 31.992c-9.088 0-9.158-0.377-10.284-1.224-0.597-0.449-1.723-0.76-5.838-1.028-0.298-0.020-0.583-0.134-0.773-0.365-0.087-0.107-2.143-3.105-2.143-7.907 0-4.732 1.472-6.89 1.534-6.99 0.182-0.293 0.503-0.47 0.847-0.47 3.378 0 8.062-4.313 11.21-11.841 0.544-1.302 0.657-2.159 2.657-2.159 1.137 0 2.413 0.815 3.042 1.86 1.291 2.135 0.636 6.721 0.029 9.171 2.063-0.017 5.796-0.045 7.572-0.045 2.471 0 4.107 1.473 4.156 3.627 0.017 0.711-0.077 1.619-0.282 2.089 0.544 0.543 1.245 1.36 1.276 2.414 0.038 1.36-0.852 2.395-1.421 2.989 0.131 0.395 0.391 0.92 0.366 1.547-0.063 1.542-1.253 2.535-1.994 3.054 0.061 0.422 0.11 1.218-0.026 1.834-0.535 2.457-4.137 3.443-9.928 3.443zM3.426 27.712c3.584 0.297 5.5 0.698 6.51 1.459 0.782 0.589 0.662 0.822 9.081 0.822 2.568 0 7.59-0.107 7.976-1.87 0.153-0.705-0.59-1.398-0.593-1.403-0.203-0.501 0.023-1.089 0.518-1.305 0.008-0.004 2.005-0.719 2.050-1.835 0.030-0.713-0.46-1.142-0.471-1.16-0.291-0.452-0.185-1.072 0.257-1.38 0.005-0.004 1.299-0.788 1.267-1.857-0.024-0.849-1.143-1.447-1.177-1.466-0.25-0.143-0.432-0.39-0.489-0.674-0.056-0.282 0.007-0.579 0.183-0.808 0 0 0.509-0.808 0.49-1.566-0.037-1.623-1.782-1.674-2.156-1.674-2.523 0-9.001 0.025-9.001 0.025-0.349 0.002-0.652-0.164-0.84-0.443s-0.201-0.627-0.092-0.944c0.977-2.813 1.523-7.228 0.616-8.736-0.267-0.445-0.328-0.889-1.328-0.889-0.139 0-0.468 0.11-0.812 0.929-3.341 7.995-8.332 12.62-12.421 13.037-0.353 0.804-1.016 2.47-1.016 5.493 0 3.085 0.977 5.473 1.447 6.245z"/>
                            </svg>
                        </button>
                        
                        <button class="feedback-button negative" data-message-id="${messageId}" aria-label="Negative feedback">
                        
                            <svg width="13" height="13" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.982 0.007c9.088 0 9.159 0.377 10.284 1.225 0.597 0.449 1.723 0.76 5.838 1.028 0.299 0.019 0.583 0.134 0.773 0.365 0.087 0.107 2.143 3.105 2.143 7.907 0 4.732-1.471 6.89-1.534 6.991-0.183 0.292-0.503 0.469-0.848 0.469-3.378 0-8.062 4.313-11.211 11.841-0.544 1.302-0.657 2.158-2.657 2.158-1.137 0-2.412-0.814-3.043-1.86-1.291-2.135-0.636-6.721-0.028-9.171-2.063 0.017-5.796 0.045-7.572 0.045-2.471 0-4.106-1.474-4.157-3.628-0.016-0.711 0.077-1.62 0.283-2.088-0.543-0.543-1.245-1.361-1.276-2.415-0.038-1.36 0.852-2.395 1.42-2.989-0.13-0.396-0.391-0.92-0.366-1.547 0.063-1.542 1.253-2.536 1.995-3.054-0.061-0.42-0.109-1.217 0.026-1.832 0.535-2.457 4.138-3.445 9.928-3.445zM28.575 4.289c-3.584-0.296-5.5-0.698-6.51-1.459-0.782-0.588-0.661-0.822-9.082-0.822-2.568 0-7.59 0.107-7.976 1.869-0.154 0.705 0.59 1.398 0.593 1.403 0.203 0.502-0.024 1.089-0.518 1.305-0.008 0.004-2.004 0.72-2.050 1.836-0.030 0.713 0.46 1.142 0.471 1.159 0.291 0.452 0.184 1.072-0.257 1.38-0.005 0.004-1.299 0.788-1.267 1.857 0.025 0.848 1.143 1.447 1.177 1.466 0.25 0.143 0.432 0.39 0.489 0.674 0.057 0.282-0.007 0.579-0.182 0.807 0 0-0.509 0.808-0.49 1.566 0.037 1.623 1.782 1.674 2.156 1.674 2.522 0 9.001-0.026 9.001-0.026 0.35-0.001 0.652 0.164 0.839 0.444s0.202 0.627 0.091 0.945c-0.976 2.814-1.522 7.227-0.616 8.735 0.267 0.445 0.328 0.889 1.328 0.889 0.139 0 0.468-0.11 0.812-0.93 3.343-7.994 8.334-12.619 12.423-13.036 0.352-0.804 1.015-2.47 1.015-5.493-0.001-3.085-0.979-5.472-1.449-6.245z"/>
                            </svg>
                        </button>

                        <button class="feedback-button copy" data-message-id="${messageId}" aria-label="Copy response">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 17H6C4.89543 17 4 16.1046 4 15V5C4 3.89543 4.89543 3 6 3H14C15.1046 3 16 3.89543 16 5V7M8 17C8 18.1046 8.89543 19 10 19H18C19.1046 19 20 18.1046 20 17V9C20 7.89543 19.1046 7 18 7H10C8.89543 7 8 7.89543 8 9V17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                `;
            }

            async sendFeedback(messageId, isPositive) {
                try {
                    const feedbackData = this.messageFeedback[messageId];
                    if (!feedbackData) return;

                    // Update local state
                    feedbackData.feedback = isPositive ? 'positive' : 'negative';
                let apiUrl = "";
                    if( isPositive) {
                        apiUrl = this.chatApiEndpoint + "thumbsUp/" + messageId ;
                    }else {
                        apiUrl = this.chatApiEndpoint + "thumbsDown/" + messageId ;
                    }

                    // Send feedback to server
                    const response = await fetch(apiUrl, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': 'Bearer ' + this.getsSecretKey(),
                        }
                    });

                    if (!response.ok) {
                        console.error('Failed to send feedback');
                    }

                    // Update UI to show feedback was received
                    const buttons = document.querySelectorAll(`.feedback-button[data-message-id="${messageId}"]`);
                    buttons.forEach(button => {
                        button.classList.remove('active');
                    });

                    const feedbackButton = document.querySelector(`.feedback-button.${feedbackData.feedback}[data-message-id="${messageId}"]`);
                    if (feedbackButton) {
                        feedbackButton.classList.add('active');
                    }

                } catch (error) {
                    console.error('Feedback Error:', error);
                }
            }

            addMessage(sender, text) {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${sender}-message`;
                messageDiv.setAttribute('role', 'listitem');

                if (sender === 'bot' && text === '') {
                    // Loading indicator
                    messageDiv.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
                } else {
                    // Render content
                    messageDiv.innerHTML = text;
                }

                this.messagesContainer.appendChild(messageDiv);
                this.scrollToBottom();

                // Add feedback button handlers for bot messages
                if (sender === 'bot') {
                    setTimeout(() => {
                        const positiveButtons = messageDiv.querySelectorAll('.feedback-button.positive');
                        const negativeButtons = messageDiv.querySelectorAll('.feedback-button.negative');

                        positiveButtons.forEach(button => {
                            button.addEventListener('click', (e) => {
                                const messageId = button.dataset.messageId;
                                this.sendFeedback(messageId, true);
                            });
                        });

                        negativeButtons.forEach(button => {
                            button.addEventListener('click', (e) => {
                                const messageId = button.dataset.messageId;
                                this.sendFeedback(messageId, false);
                            });
                        });

                    const copyButtons = messageDiv.querySelectorAll('.feedback-button.copy');
                        console.log('copyButtons', positiveButtons);
                        copyButtons.forEach(button => {
                            button.addEventListener('click', () => {
                                const parentMessage = button.closest('.message');
                                const textToCopy = parentMessage?.innerText || '';
                                if (textToCopy) {
                                    navigator.clipboard.writeText(textToCopy).then(() => {
                                        this.showCopyMsg("Copied!");
                                        setTimeout(() => {
                                            this.clearCopyMsg();
                                        }, 2000);
                                    }
                                ).catch(err => {
                                        console.error("Failed to copy text:", err);
                                    });
                                }
                            });
                        });
            
                    }, 100);
                }

                return messageDiv;
            }

            renderMarkdown(text) {
                // Bold: **text**
                let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
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

                return html;
            }

            scrollToBottom() {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }

            resetChat() {
                this.clearChat();
                this.sessionId = this.generateSessionId();
                this.requestId = this.generateRequestId();
                this.addMessage('bot', "Hello! I'm your AI assistant. How can I help you today?");
                this.showCopyMsg("Chat has been reset");
                setTimeout(() => {
                    this.clearCopyMsg();
                }, 2000);
            }

            //v2
            assignEventListenersToFeedbackButtons() {
                const positiveButtons = document.querySelectorAll('.feedback-button.positive');
                const negativeButtons = document.querySelectorAll('.feedback-button.negative');
                const copyButtons = document.querySelectorAll('.feedback-button.copy');

                // Handle Positive Feedback
                positiveButtons.forEach(button => {
                    const newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);
                    newButton.addEventListener('click', () => {
                        const messageId = newButton.dataset.messageId;
                        this.sendFeedback(messageId, true);
                    });
                });

                // Handle Negative Feedback
                negativeButtons.forEach(button => {
                    const newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);
                    newButton.addEventListener('click', () => {
                        const messageId = newButton.dataset.messageId;
                        this.sendFeedback(messageId, false);
                    });
                });

                // Handle Copy Button
                copyButtons.forEach(button => {
                    const newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);
                    newButton.addEventListener('click', () => {
                        const parentMessage = newButton.closest('.message');
                        const textToCopy = parentMessage?.innerText || '';
                        if (textToCopy) {
                            navigator.clipboard.writeText(textToCopy)
                                .then(() => {
                                    this.showCopyMsg("Copied!");
                                    setTimeout(() => {
                                        this.clearCopyMsg();
                                    }, 2000);
                                })
                                .catch(err => {
                                    console.error("Failed to copy text:", err);
                                });
                        }
                    });
                });
            }

            forceDownloadImage(url, filename) {
                fetch(url, { mode: 'cors' })
                    .then(res => res.blob())
                    .then(blob => {
                        const blobUrl = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(blobUrl);
                    })
                    .catch(() => alert('Image download failed. Server may block CORS.'));
            }

        }

        // Initialize the chatbot5
        const chatbot = new Chatbot();
        window.chatbot = chatbot;
    });