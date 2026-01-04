# Standard API Chat Documentation

This document references the **API Mode** chat interactions (`apiMode === true`).

## Endpoint Information

*   **Base URL:** `https://uat.api.chat.buddyai.in/v2/api/`
*   **Method:** `POST`
*   **Path:** `{sId}/chat/`
    *   `sId` (Service ID) is retrieved from `localStorage.getItem('sid')`.

## Authentication

*   **Header:** `Authorization: Bearer <bai-sk>`
    *   Token from `localStorage.getItem('bai-sk')`.

## Request Structure

**Content-Type:** `multipart/form-data`

The request consists of a `payload` JSON string and a `files` attachment.

### 1. `payload` (JSON)

```json
{
  "messages": [
    {
      "role": "user",
      "content": "User message string" 
    }
  ],
  "tools": [],
  "provider": "OPENAI", // or "DEEPSEEK" selected by user
  "context": {
    "userId": "<userId from localStorage>",
    "requestId": "<generated UUID>",
    "sessionId": "<generated UUID>",
    "jwtToken": "<jwt from localStorage>"
  },
  "properties": {} // Empty in API Mode
}
```

*   **Note**: If the user message is empty (initially), it sends "file upload" as content, though usually API mode sends text.
*   **Note on System Prompt**: If a default prompt (`df`) is entered in the UI, it is added as a message with `role: "system"`.

### 2. `files` (Form Data Field)

In **API Mode**, the client **always** appends a dummy file to the request, even if no file is uploaded by the user.

*   **Key:** `files`
*   **Filename:** `dummy.txt`
*   **Content:** "Hello, this is dummy file content"
*   **MIME Type:** `text/plain`

## Comprehensive Response Handling

The client expects a JSON response. The processing logic checks for various fields to determine how to render the message.

The base response object usually contains:
*   `uuId`: A unique message ID (used for feedback).
*   `type`: (Optional) Discriminator for the response type.
*   `text` / `menu` / `complex`: Data fields corresponding to the type.

### 1. Standard Text Response
**Condition:** `data.type === "TEXT"`
*   **Field:** `data.text`
*   **Rendering:** The string is parsed as Markdown (Bold, Italic, Links, Code blocks) and rendered as HTML.

### 2. Menu Response (Suggestions)
**Condition:** `data.type === "MENU"`
*   **Field:** `data.menu` (Array of objects)
*   **Structure:**
    ```json
    [
      {
        "name": "Option Label",
        "icon": "http://example.com/icon.png" // Optional
      }
    ]
    ```
*   **Rendering:** Renders as a list of clickable links. Clicking an option sends a new user message with the content `name`.

### 3. OpenAI Style Response (Fallback)
**Condition:** `data.choices` array exists.
*   **Field:** `data.choices[0].message.content`
*   **Rendering:** Parsed as Markdown.

### 4. Complex Rich Responses
**Condition:** `data.type === "COMPLEX"` & `data.complex` exists.

This type is used for structured data rendering. It depends on `data.complex.metaData.type`:

*   **Type: "IMAGE"**
    *   **Data:** `data.complex.data` (Array of objects)
    *   **Fields:** `link` (URL), `photographer` (Credit).
    *   **Rendering:** Displays a gallery of images with download buttons.

*   **Type: "VIDEO"**
    *   **Data:** `data.complex.data` (Array of objects)
    *   **Fields:** `link` (URL).
    *   **Rendering:** Displays video players (`<video>`) with download buttons.

*   **Type: "TEXT" (with Citations)**
    *   **Data:** `data.complex.data`
    *   **Fields:**
        *   `response`: Main text content (Markdown).
        *   `documents`: Array of verification sources.
            *   `documents[].fileName`: Name of the source file.
            *   `documents[].pages`: Array of page numbers.
    *   **Rendering:** Displays the text followed by a "Source(s)" section listing files and pages.

### 5. Attachments (Mixed Media)
**Condition:** `data.attachments` array exists.
Independently of the main text, the API can return attachments.

*   **Structure:**
    ```json
    {
      "type": "image/png", // or video/..., audio/..., application/pdf
      "url": "http://...",
      "name": "filename.ext"
    }
    ```
*   **Rendering:**
    *   **Image (`image/*`)**: Renders `<img>`.
    *   **Video (`video/*`)**: Renders `<video controls>`.
    *   **Audio (`audio/*`)**: Renders `<audio controls>`.
    *   **PDF (`application/pdf`)**: Renders a download link/button.

### 6. HTML Menu
**Condition:** `data.htmlMenu` exists.
*   **Field:** `htmlMenu`
*   **Rendering:** Similar to `MENU` type, renders a list of clickable suggestion links.

## Feedback System

Every bot message is rendered with positive/negative feedback buttons and a copy button.

*   **Positive:** `PUT .../v2/api/{sId}/chat/thumbsUp/{messageId}`
*   **Negative:** `PUT .../v2/api/{sId}/chat/thumbsDown/{messageId}`
