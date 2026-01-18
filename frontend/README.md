# 🎨 DocMind AI Frontend

> Modern, responsive chat interface built with **Next.js 14** + **Tailwind CSS** + **Framer Motion**.

## 🎯 Technical Capabilities

The frontend delivers a production-grade user experience with:

- **Next.js 14 App Router**: Server/client component architecture with optimized TypeScript patterns
- **Real-Time Interaction**: Streaming responses, optimistic updates, and intelligent loading states
- **Motion Design**: Framer Motion-powered micro-interactions and smooth transitions
- **Clean Architecture**: Service layer abstraction for maintainable API integration
- **Responsive Layout**: Mobile-first design system built with Tailwind CSS

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main chat interface page
├── components/
│   ├── ChatInterface.tsx  # Main chat component
│   └── NeuralInspector.tsx # Vector DB debugging sidebar
├── services/
│   └── api.ts             # Centralized API client
└── public/                # Static assets
```

---

## 🎨 Key Features

### 1. **Chat Interface**
- Real-time message streaming
- Markdown rendering for AI responses
- File upload with drag-and-drop
- Loading states and error handling

### 2. **Neural Inspector** (Debugging Tool)
- Live vector database statistics
- Document chunk visualization
- Collection management
- Real-time updates

### 3. **Animations**
- Framer Motion for smooth transitions
- Vanta.js background effects
- Micro-interactions on hover/click

---

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🔧 Tech Stack

| Technology        | Purpose                         |
| :---------------- | :------------------------------ |
| **Next.js 14**    | React framework with App Router |
| **TypeScript**    | Type-safe development           |
| **Tailwind CSS**  | Utility-first styling           |
| **Framer Motion** | Declarative animations          |
| **Axios**         | HTTP client for API calls       |
| **Lucide Icons**  | Modern icon library             |

---

*Part of the DocMind AI Enterprise Intelligence Platform.*
