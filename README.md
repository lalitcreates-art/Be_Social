# Be Social

Be Social is a production-style social networking starter built with React, Express, MongoDB, JWT authentication, image uploads, and real-time messaging.

## Stack

- React + Vite
- React Router
- Express + MongoDB + Mongoose
- JWT authentication
- Multer image uploads
- Socket.IO messaging
- PWA manifest for Android-friendly installability

## Project structure

- `client/` React frontend
- `server/` Express API and Socket.IO server

## Getting started

1. Install dependencies:
   `npm install`
2. Copy `server/.env.example` to `server/.env`
3. Set `MONGODB_URI`, `JWT_SECRET`, and client/server URLs
4. Run in development:
   `npm run dev`

## Free deployment plan

Use these free services:

- Frontend: Render Static Site
- Backend: Render Web Service
- Database: MongoDB Atlas M0 Free Cluster

### Deploy order

1. Create a MongoDB Atlas free cluster and database user
2. Deploy the backend service on Render
3. Deploy the frontend static site on Render
4. Update the frontend and backend environment variables with the final public URLs

### Render setup

This repo includes [render.yaml](C:\Users\Lalit Mohan Verma\Desktop\VS Code\Social_Network\render.yaml) so Render can create both services from one repository.

Backend environment variables:

- `CLIENT_URL=https://your-frontend-domain.onrender.com`
- `MONGODB_URI=your-atlas-connection-string`
- `JWT_SECRET=your-long-random-secret`
- `UPLOAD_DIR=uploads`

Frontend environment variables:

- `VITE_API_URL=https://your-backend-domain.onrender.com/api`
- `VITE_SOCKET_URL=https://your-backend-domain.onrender.com`
- `VITE_ASSET_URL=https://your-backend-domain.onrender.com`

### Notes

- Free Render web services can sleep when idle, so the first API request may be slow.
- Uploaded images are stored on the backend filesystem. On free hosting, this storage is not durable. For production, move uploads to Cloudinary, S3, or similar object storage.

## Android app build

This project is prepared for Android packaging with Capacitor.

### Commands

- `npm install`
- `npm run android:sync`
- `npm run android:open`

### Requirements to generate an APK

- Java JDK installed
- Android Studio installed
- Android SDK configured

### APK generation flow

1. Run `npm run android:sync`
2. Run `npm run android:open`
3. In Android Studio, wait for Gradle sync
4. Use `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`

The Android wrapper uses the deployed backend URLs already configured in your frontend environment.

## Features

- Be Social branding across the app
- Mobile-first layout suitable for Android devices
- Register, login, persisted auth, and protected routes
- Create posts with optional image uploads
- Like and comment on posts
- Direct messaging and conversations
- MongoDB-backed data model
- Installable PWA metadata
