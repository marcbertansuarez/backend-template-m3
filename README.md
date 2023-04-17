# Project's name REST API

## Description

This is a the backend repository for the React application `ValoVision`.

---

## Instructions

When cloning the project, change the <code>sample.env</code> file name for <code>.env</code>. The project will run on **PORT 8000**.

Then, run:

```bash
npm install
```

## Scripts

- To start the project run:

```bash
npm run start
```

- To start the project in development mode, run:

```bash
npm run dev
```

- To seed the database, run:

```bash
npm run seed
```

---

## Models

### User

Users in the database have the following properties:

```js
  email: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  image: {
    type: String,
    default: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/1200px-Valorant_logo_-_pink_color_version.svg.png"
  }

  ### LineUp

LineUps in the database have the following properties:

  title: {
    type: String,
    required: [true, "Title is required"]
  },
  agent: {
    type: String,
    enum: ['Astra', 'Breach', 'Brimstone', 'Chamber', 'Cypher', 'Fade', 'Guekko', 'Harbor', 'Jett', 'KAY/O', 'Killjoy', 'Neon', 'Omen', 'Phoenix', 'Raze', 'Reyna', 'Sage', 'Skye', 'Sova', 'Viper', 'Yoru'],
    required: [true, "Agent is required"]
  },
  map: {
    type: String,
    enum: ['Bind', 'Haven', 'Split', 'Ascent', 'Icebox', 'Breeze', 'Fracture', 'Pearl', 'Lotus'],
    required: [true, "Map is required"]
  },
  description: {
    type: String,
    required: [true, "A description is required"]
  },
  video: {
    type: String,
    required: [true, "A video is required"]
   },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewsCount: {
    type: Number,
    default: 0
  }

  ### Review

  Reviews in the database have the following properties:

  content: {
  type: String,
  required: [true, "Content is required"]
  },
  lineupId: {
    type: Schema.Types.ObjectId,
    ref: 'LineUp'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }

  ### Like

  Likes in the database have the following properties:

  lineupId: {
    type: Schema.Types.ObjectId,
    ref: 'LineUp'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
```

---

## API endpoints and usage

## Endpoints

| Action                       | Method | Endpoint            | Req.body                              | Private/Public |
| ---------------------------- | ------ | ------------------- | ------------------------------------- | -------------- |
| Register user                | POST   | /api/v1/auth/signup | username, password, email, image      | Public         |
| Login user                   | POST   | /api/v1/auth/login  | usernameOrEmail, password             | Public         |
| Get logged in user           | GET    | /api/v1/auth/me     |                                       | Private        |
| Get all line-ups             | GET    | /lineup             |                                       | Private        |
| Get all line-ups             | GET    | /lineup/lineup      |                                       | Public         |
| Search lineups for agents    | GET    | /lineup/search      |                                       | Public         |
| Filter lineups by popularity | GET    | /lineup/popularity  |                                       | Public         |
| Get ranking                  | GET    | /lineup/ranking     |                                       | Public         |
| Get one line-up              | GET    | /lineup/:lineupId   |                                       | Private        |
| Create one line-up           | POST   | /lineup             | title, agent, map, description, video | Private        |
| Edit one line-up             | PUT    | /lineup/:lineupId   | title, agent, map, description, video | Private        |
| Delete one line-up           | DELETE | /lineup/:lineupId   |                                       | Private        |
| Profile user                 | GET    | /profile            | Private                               |
| Edit user profile            | PUT    | /profile/edit       | username, image                       | Private        |
| Get liked line-ups           | GET    | /profile/liked      |                                       | Private        |
| Get user by ID               | GET    | /profile/:userId    |                                       | Private        |
| Create review for a lineup   | POST   | /review/:lineupId   | content                               | Private        |
| Edit review for a lineup     | PUT    | /review/:reviewId   | content                               | Private        |
| Delete review for a lineup   | DELETE | /review/:reviewId   |                                       | Private        |
| Like and dislike one line-up | POST   | /like/:lineupId     |                                       | Private        |
| Index page for the API       | GET    | /                   |                                       | Public         |

---

## Useful links

- [Presentation slides](https://slides.com/marcbs/valovision)
- [Frontend repository](https://github.com/marcbertansuarez/frontend-template-m3)
- [Frontend deploy](https://valovision.netlify.app/)
- [Deployed REST API](https://valovision.fly.dev/)
