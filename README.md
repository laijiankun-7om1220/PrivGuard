# PrivGuard: An LLM-Based Framework for  Automated Compliance Detection in Privacy Policies

## System Architecture

The system adopts a frontend-backend separation architecture:

- **Frontend**: React 18 + TypeScript, providing an interactive user interface
- **Backend Services**: Bmob cloud database, handling user authentication and data storage
- **AI Service Layer**: Integrates multiple large language model APIs through standardized interfaces
- **Document Processing Layer**: Supports automatic parsing of multiple document formats including Word, PDF, and TXT

## Technology Stack

### Frontend Technologies
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **UI Component Library**: Ant Design 6.1.3
- **Routing**: React Router v6
- **State Management**: React Context API

### Backend and Storage
- **Cloud Database**: Bmob cloud database
- **User Authentication**: User management system based on Bmob

### AI Model Integration
- **DeepSeek**: DeepSeek Chat (non-thinking mode), DeepSeek Reasoner (thinking mode)
- **Qwen (通义千问)**: Qwen Plus
- **Doubao (豆包)**: Doubao Seed

### Document Processing
- **Word Parsing**: mammoth.js
- **PDF Parsing**: pdfjs-dist
- **Text Processing**: Custom preprocessing pipeline

## Quick Start

### Requirements

- Node.js 18+
- npm or yarn
- At least one AI service API Key

### Installation Steps

1. **Clone the Repository**

    ```bash
    git clone <repository-url>
    cd reactVersion
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Configure Environment Variables**

    Create a `.env` file and configure the following:

    ```env
    # AI Service API Configuration (at least one required)
    VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
    VITE_QWEN_API_KEY=your_qwen_api_key_here
    VITE_DOUBAO__API_KEY=your_doubao_api_key_here

    # Bmob Cloud Database Configuration
    VITE_BMOB_APPLICATION_ID=your_bmob_application_id_here
    VITE_BMOB_REST_API_KEY=your_bmob_rest_api_key_here

    # AI Detection Prompt Template (Required)
    # Prompt template is sensitive information and must be configured via environment variable
    # Use \n for line breaks in the prompt template, {{TEXT_CONTENT}} as the text placeholder (required)
    VITE_AI_DETECT_PROMPT_TEMPLATE=Your prompt template (include \n line breaks and {{TEXT_CONTENT}} placeholder)
    ```

    **Get API Keys**:
    - DeepSeek: https://platform.deepseek.com/api_keys
    - Qwen: https://dashscope.aliyun.com/
    - Doubao: https://www.volcengine.com/product/doubao
    - Bmob: https://www.bmob.cn/

    **Note**: 
    - At least one AI service API Key is required to use the detection feature
    - **Must configure** `VITE_AI_DETECT_PROMPT_TEMPLATE` environment variable. The prompt template is sensitive information and no default value is provided.

4. **Start Development Server**

    ```bash
    npm run dev
    ```

    The application will start at [http://localhost:5173](http://localhost:5173)



### History Management

- View all detection records (software name, AI model used, detection time)
- View detection details (14 detection results)
- Export detection results as JSON format
- Delete detection records

### User Management

- User registration/login
- Personal information management (username, phone, email, password modification)

## Project Structure


```
reactVersion/
├── src/
│   ├── components/          # Shared components
│   │   ├── Auth/           # Authentication components (Login/Register)
│   │   ├── Layout/         # Layout components (Header, AppLayout)
│   │   └── common/         # Common components (LoadingOverlay)
│   ├── pages/              # Page components
│   │   ├── Home/           # Home page
│   │   ├── Detect/         # Detection page
│   │   ├── PersonalCenter/ # Personal center
│   │   └── Help/           # Help page
│   ├── services/           # Service layer
│   │   ├── auth.service.ts      # Authentication service
│   │   ├── detect.service.ts    # Detection record service
│   │   ├── detectAI.service.ts  # AI detection service
│   │   ├── user.service.ts      # User service
│   │   └── bmob.ts              # Bmob initialization
│   ├── contexts/           # React Context
│   │   └── AuthContext.tsx # Global authentication state
│   ├── routes/             # Route configuration
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   │   ├── constants.ts    # Constants (including 14 detection dimensions)
│   │   ├── detectPrompt.ts # AI Prompt template
│   │   ├── fileParser.ts   # File parsing utilities
│   │   ├── textPreprocessor.ts # Text preprocessing utilities
│   │   └── validators.ts   # Form validation
│   └── config/             # Configuration files
│       └── theme.ts        # Ant Design theme configuration
├── public/                 # Static assets
├── package.json
└── README.md
```



## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Important Notes

1. **API Key Security**: The `.env` file contains sensitive API Keys. Do not commit to version control. For production environments, consider using environment variable management tools or backend proxies.

2. **Token Limits**: Be aware of token limits for different AI services. The system includes built-in text preprocessing to reduce token consumption.

3. **Network Requirements**: Must be able to access the selected AI service APIs and Bmob services.

4. **Bmob SDK**: Needs to load Bmob SDK in `index.html` (`/Js/Bmob-2.5.2.min.js`)

5. **PDF Worker**: PDF parsing requires worker file, configured in `public/pdf.worker.min.mjs`

6. **Database Fields**: Bmob table has field count limits. Detection options are optimized to JSON format storage.

## Evaluation and Experiments

(If applicable, add experimental evaluation results, dataset information, performance metrics, etc.)

## Citation

If you use this system in your research, please cite:

```bibtex
@software{privacy_guard_online,
  title = {Privacy Guard Online: An AI-Powered Privacy Policy Compliance Detection System},
  author = {[Author Names]},
  year = {2026},
  url = {[Project URL]}
}
```


## Acknowledgments

Thanks to the following open-source projects and services:

- React community
- Ant Design team
- AI service providers including DeepSeek, Qwen, and Doubao
- Bmob cloud database

## Related Publications

v1.0.0 

## License

MIT License

---

**Note**: This project is for academic research purposes. When using AI services, please comply with relevant service terms of use and data protection regulations.
