# Chatbot API Documentation

This document outlines the API endpoints, request structures, and response formats used by the Chatbot widget (`chat-widget.js`). This analysis is based on the client-side implementation.

## Overview

The chatbot interacts with a backend service to process user messages, handle file uploads, and manage session context. It supports two primary modes:
1.  **API Mode**: Standard chat interactions.
2.  **Document Mode**: Chatting with context from specific documents.

## Base Configuration

*   **Base URL (UAT):** `https://uat.api.chat.buddyai.in/v2/api/`
*   **Service/Session ID (`sId`):** Retrieved from `localStorage.getItem('sid')`. This is likely a path parameter identifying the specific chat service instance.

## Authentication

All API requests require the following header:

*   **Authorization**: `Bearer <bai-sk>`
    *   The token is retrieved from `localStorage.getItem('bai-sk')`.

## Endpoints

### 1. Send Message

**Endpoint URL:**
*   **API Mode:** `POST .../v2/api/{sId}/chat/`
*   **Document Mode:** `POST .../v2/api/document/{sId}/chat/`

**Request Format:** `FormData`

The request body is `FormData` containing a JSON `payload` and optional `files`.

#### Field: `payload` (JSON String)

| Field | Type | Description |
| :--- | :--- | :--- |
| `messages` | Array | List of message objects. |
| `messages[].role` | String | "user" or "system". |
| `messages[].content` | String | The text content of the message. Defaults to "file upload" if empty but files are present. |
| `tools` | Array | Empty array `[]`. |
| `provider` | String | AI Provider selected (e.g., "OPENAI", "DEEPSEEK"). |
| `context` | Object | Session and user context. |
| `context.userId` | String | From `localStorage.getItem('userId')`. |
| `context.requestId` | String | Generated client-side UUID. |
| `context.sessionId` | String | Generated client-side UUID. |
| `context.jwtToken` | String | From `localStorage.getItem('jwt')`. |
| `properties` | Object | (Optional) Additional properties, primarily for Document Mode. |

**Specifics for Document Mode (`!apiMode`):**
*   `properties`:
    ```json
    {
      "documentId": "<from localStorage>",
      "type": "MULTI_FILE",
      "clientId": "2000003"
    }
    ```
*   `context.sessionId`: Explicitly set to `this.sessionId`.

#### Field: `files` (Binary)

*   **API Mode:** Appends a dummy file (`dummy.txt`) with content "Hello, this is dummy file content".
*   **Document Mode:** Appends actual user-uploaded files (Images, PDF, etc.).

---

### 2. Message Feedback

**Endpoint URL:**
*   **Positive:** `PUT .../v2/api/{sId}/chat/thumbsUp/{messageId}`
*   **Negative:** `PUT .../v2/api/{sId}/chat/thumbsDown/{messageId}`

**Request Headers:**
*   `Content-Type`: `application/json`
*   `Accept`: `application/json`
*   `Authorization`: `Bearer <bai-sk>`

**Request Body:** (Empty or not explicitly used in code analysis, standard PUT)

---

## Response Structure

The API is expected to return a JSON object. The client handles several response types defined by the `type` field or existence of specific keys.

### Common Fields

| Field | Type | Description |
| :--- | :--- | :--- |
| `uuId` | String | Unique identifier for the response message (used for feedback). |
| `type` | String | Determines the rendering logic (e.g., "TEXT", "MENU", "COMPLEX"). |

### Response Types

#### 1. Text Response
*   **Condition:** `type === "TEXT"` AND `apiMode === true`
*   **Content Field:** `text` (Markdown string).

#### 2. OpenAI Style (Fallback)
*   **Condition:** `choices` array exists.
*   **Content Field:** `choices[0].message.content`.

#### 3. Menu Response
*   **Condition:** `type === "MENU"`
*   **Content Field:** `menu` (Array of objects).
*   **Rendering:** Lists clickable options.

#### 4. HTML Menu
*   **Condition:** `htmlMenu` field exists.
*   **Content Field:** `htmlMenu`. (Rendered via `renderHtmlMenu`).

#### 5. Complex Response
*   **Condition:** `type === "COMPLEX"`
*   **Content Field:** `complex` object.

**Complex Sub-types (`complex.metaData.type`):**

*   **IMAGE**:
    *   `complex.data`: Array of objects with `link` and `photographer`.
*   **VIDEO**:
    *   `complex.data`: Array of objects with `link`.
*   **TEXT (with Citations)**:
    *   `complex.data.response`: Main text.
    *   `complex.data.documents`: Array of verification sources (`fileName`, `pages`).

### Attachments
The response may include an `attachments` array, which allows rendering mixed media alongside the text.

| Attachment Type | Rendering |
| :--- | :--- |
| `image/*` | `<img>` tag. |
| `video/*` | `<video>` tag with controls. |
| `audio/*` | `<audio>` tag with controls. |
| `application/pdf` | Download link. |
