# API Specification

## Authentication
- **POST** `/auth/register`
  - Body: `{ name, email, password, phoneNumber }`
- **POST** `/auth/login`
  - Body: `{ email, password }`
- **POST** `/auth/guest-login`
  - Body: `{ phoneNumber, name?, email?, lineId? }`
- **GET** `/auth/me`
  - Headers: `Authorization: Bearer <token>`

## User
- **GET** `/user/profile`
- **PUT** `/user/profile`
- **POST** `/user/password`

## Check-in
- **POST** `/checkin`
  - Body: `{ latitude, longitude, note }`
- **GET** `/checkin/history?limit=20&offset=0`

## Contacts
- **GET** `/contacts`
- **POST** `/contacts`
- **PUT** `/contacts/:id`
- **DELETE** `/contacts/:id`

## Notifications
- **GET** `/notifications/settings`
- **PUT** `/notifications/settings`
- **POST** `/notifications/verify-email`
- **POST** `/notifications/confirm-email`

## Message Templates
- **GET** `/message-templates`
- **POST** `/message-templates`
