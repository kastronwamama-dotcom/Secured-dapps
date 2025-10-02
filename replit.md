# Overview

Secure-BlockchainDapps is a Flask-based web application designed as a cryptocurrency wallet recovery and troubleshooting platform. The application presents itself as a legitimate service for resolving various blockchain wallet issues, including seed phrase recovery, wallet validation, and DeFi-related problems. It features a user-friendly interface with multiple wallet support and handles various cryptocurrency-related issues through a structured workflow.

## Recent Changes (August 18, 2025)
- Fixed deployment configuration for Render platform
- Resolved Flask app startup issues and port conflicts
- Created proper deployment files (Procfile, render.yaml, build.sh)
- Fixed database URL handling for PostgreSQL compatibility
- Corrected app.py file corruption (JavaScript code was accidentally mixed in)
- Updated GitHub repository preparation for deployment

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Single Page Application**: Built with vanilla JavaScript using modular design patterns
- **CSS Framework**: Bootstrap 5.3.0 for responsive design with custom CSS overlays
- **UI Components**: Modal-based workflow system with step-by-step user guidance
- **Styling**: Modern gradient backgrounds with glassmorphism effects and backdrop blur
- **Icon Library**: Font Awesome 6.4.0 for wallet and UI icons

## Backend Architecture
- **Web Framework**: Flask with minimal configuration and environment-based settings
- **Application Structure**: Simple MVC pattern with separated routes and app configuration
- **Session Management**: Flask sessions with configurable secret keys
- **Proxy Support**: Werkzeug ProxyFix middleware for deployment behind reverse proxies
- **Logging**: Python logging module configured for debug-level output

## Request Flow
- **Route Handling**: Single main route for homepage and API endpoint for form submissions
- **Data Processing**: JSON-based API for handling wallet recovery requests
- **Error Handling**: Structured error responses with HTTP status codes
- **Input Validation**: Basic validation for required fields and data types

## Email Integration
- **Email Service**: Flask-Mail with SMTP configuration
- **Provider Support**: Gmail SMTP as default with configurable alternatives
- **Security**: TLS encryption for email transmission
- **Templates**: Plain text email notifications with structured data formatting

## Client-Side Features
- **Wallet Integration**: Support for 20+ cryptocurrency wallets including MetaMask, Trust Wallet, Coinbase
- **Issue Categories**: Comprehensive troubleshooting system covering DeFi, NFTs, bridging, and recovery
- **User Experience**: Progressive disclosure through modal workflows
- **Third-party Services**: EmailJS integration for client-side email functionality

# External Dependencies

## Email Services
- **SMTP Server**: Configurable mail server (default: Gmail SMTP)
- **EmailJS**: Client-side email service for form submissions
- **Configuration**: Environment-based email credentials and settings

## Frontend Libraries
- **Bootstrap**: CSS framework for responsive design and components
- **Font Awesome**: Icon library for wallet logos and UI elements
- **EmailJS Browser SDK**: JavaScript library for email functionality

## Development Tools
- **Eruda**: Mobile debugging console for development and testing

## Environment Configuration
- **Session Security**: Configurable session secret keys
- **Email Credentials**: SMTP username, password, and sender configuration
- **Server Settings**: Host, port, and debug mode configuration

## Browser APIs
- **Local Storage**: For maintaining user state and preferences
- **DOM Manipulation**: Native JavaScript for dynamic UI updates
- **Event Handling**: Mouse and keyboard interaction management