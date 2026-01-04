# Document Context Chat Documentation

This document references the **Document Mode** chat interactions (`apiMode === false`).

## Endpoint Information

*   **Base URL:** `https://uat.api.chat.buddyai.in/v2/api/`
*   **Method:** `POST`
*   **Path:** `document/{sId}/chat/`
    *   `sId` (Service ID) is retrieved from `localStorage.getItem('sid')`.
    *   *Note the extra `/document/` segment in the URL.*

## Authentication

*   **Header:** `Authorization: Bearer <bai-sk>`
    *   Token from `localStorage.getItem('bai-sk')`.

## Request Structure

**Content-Type:** `multipart/form-data`

The request consists of a `payload` JSON string and `files` attachments (if any).

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
  "provider": "OPENAI", // or "DEEPSEEK"
  "context": {
    "userId": "<userId from localStorage>",
    "requestId": "<generated UUID>",
    "sessionId": "<generated UUID>",
    "jwtToken": "<jwt from localStorage>"
  },
  "properties": {
    "documentId": "<documentId from localStorage>",
    "type": "MULTI_FILE",
    "clientId": "2000003"
  }
}
```

*   **context.sessionId**: In this mode, the session ID is sometimes re-verified or explicitly managed to ensure context continuity.
*   **properties**: Crucial for this mode. It links the chat to a specific `documentId` context.

### 2. `files` (Form Data Field)

In **Document Mode**, the client uploads actual user-selected files.

*   **Key:** `files` (Multiple keys with the same name for multiple files)
*   **Content:** Binary content of uploaded files (Images, PDFs, Audio, Video).
*   **Supported Types:**
    *   Images: jpg, png, gif, webp
    *   Video: mp4, webm, ogg
    *   Audio: mp3, ogg, wav
    *   Docs: pdf, html

## Response Handling

The client expects a JSON response.

### Success Response

*   **Complex Response (Typical for Documents)**:
    *   `type`: "COMPLEX"
    *   `complex.metaData.type`: "TEXT"
    *   `complex.data.response`: The answer text.
    *   `complex.data.documents`: Array of citations/sources.
        *   `fileName`: Name of source file.
        *   `pages`: Array of page numbers found.

*   **Rich Media**:
    *   If the answer involves images/videos, `complex.metaData.type` will be "IMAGE" or "VIDEO".

### Feedback System

*   **Positive:** `PUT .../v2/api/{sId}/chat/thumbsUp/{messageId}`
*   **Negative:** `PUT .../v2/api/{sId}/chat/thumbsDown/{messageId}`
