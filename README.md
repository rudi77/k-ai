# Invoice Information Extraction Web Application

A modern web application built with Next.js for extracting and managing invoice information using AI. The application features a clean, responsive UI with a dark sidebar, real-time invoice processing, and comprehensive invoice management capabilities.

## Features

- 📄 Upload and process invoices (PDF and PNG formats)
- 📊 Dashboard with key metrics and statistics
- 📋 Invoice history with detailed view
- 🔍 Search functionality for invoices
- ⚙️ Configurable settings for API keys and extraction preferences
- 🎨 Modern UI with dark sidebar and responsive design

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (version 18.17 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd k-ai
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

The application will automatically redirect you to the upload page.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── upload/           # Invoice upload page
│   ├── history/         # Invoice history page
│   ├── settings/        # Settings page
│   └── invoice/         # Invoice detail page
├── components/           # Reusable components
│   └── layout/          # Layout components (Sidebar, Header)
└── styles/              # Global styles
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_URL=your_api_url_here
OPENAI_API_KEY=your_openai_api_key_here
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons
- [React Dropzone](https://react-dropzone.js.org/) - File upload

## Development

### Code Style

The project uses ESLint and TypeScript for code quality. Ensure your code follows the established patterns:

```bash
npm run lint
```

### Making Changes

1. Create a new branch for your feature
2. Make your changes
3. Run linting
4. Create a pull request

## Production Deployment

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team. 