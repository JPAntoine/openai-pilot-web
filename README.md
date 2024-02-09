
# nwn-chat-interface

## Introduction
The `nwn-chat-interface` is a chat interface designed to integrate seamlessly with the Generative back end via a BFF layer. Built on the modern Vite React framework and leveraging the power of TypeScript, this project aims to deliver an accurate, robust, and efficient content generation experience.

## Features
- Real-time chatting capabilities with NWN AI Chat application.
- Tailored with TypeScript for type safety and scalability.
- Utilizes Redux Toolkit for state management, ensuring predictable state updates.
- Styled with TailWind CSS for a customizable and adaptive UI.

## Getting Started

### Prerequisites
- Node.js (version 12.x or later)
- Yarn package manager
- BFF layer which can be found in nwn-chat-bff

### Installation
1. Clone the repository via your preferred method.
2. Navigate to the project directory:

cd nwn-chat-interface

### Install dependencies using Yarn:

yarn install

## Usage

To start the development server and run the app in the development mode, execute:

yarn dev

Open http://localhost:5173 to view it in the browser.

### Testing

To run the test suite and evaluate the code quality:

yarn test

To view the coverage report, open coverage/index.html in your web browser after running the tests.

### Updating for new Clients

src/features/activeUserWrapper/activeUserWrapper.tsx - grabs user accounts matching a users email domain.  this needs to be update to focus on specific domains

index.css - contains sizing for comany logo since logos often need adjustment

/public/ - contains images for use in the app
- bot-avatar - used for both avatar and app icon
- company-logo - used in top left of main window only

tailwind.config.js - contains high level color scheme
- background - standard farthest most background 
- primary - used for menu highlights
- secondary - used mainly for background of left chat menu and message bar
- other colors impact but may need a bit of fiddling to get right. 