# Assistant Frontend

This project is a React + TypeScript application built with Vite. It provides a UI for creating, sharing and chatting with assistants. The interface uses a small Tailwind based design system and [lucide-react](https://github.com/lucide-icons/lucide) icons. See [docs/design-system.md](docs/design-system.md) and [docs/icons.md](docs/icons.md) for details.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to the URL of your backend.
3. Start the dev server:
   ```bash
   npm run dev
   ```
   The app runs on <http://localhost:5173> and all requests under `/api` are proxied to the backend configured in `vite.config.ts`.

### Useful scripts

- `npm run build` – build the production bundle
- `npm run preview` – preview the production build
- `npm run lint` – run ESLint and Stylelint
- `npm test` – execute unit tests

## Managing Assistants

Run the development server and open the app in your browser. The home page lists all existing assistants retrieved from `/api/assistants/`. Use the form on the page to enter a name and submit to create a new assistant.

To chat with an assistant the frontend posts messages to `/api/assistants/<uuid>/chat/`. The backend returns the assistant's reply which is displayed in the chat window.

When creating a new assistant you can select a model from a dropdown menu. The list includes a fixed set of options (`gpt-4`, `gpt-4o`, `o3-mini`) and the chosen model is sent along with the create request.

File uploads are also supported during assistant creation. You may add files individually (up to 20 in total) and they will be uploaded using `multipart/form-data` when the request is sent to `/api/assistants/`.

Existing assistants can be edited in the UI. When updating you may add new files one at a time (again up to 20) or select existing ones to remove. The form submits a `PATCH` request to `/api/assistants/<uuid>/` including any new `files` and a `remove_files` list containing the file IDs to delete.

## Auth flow

```
User -> LoginPage -> POST /api/token/ -> AuthProvider stores access in state and refresh in localStorage
      -> GET /api/users/me/ -> user profile
App components consume AuthContext
api requests -> axios instance -> attaches Authorization header
401 from API -> interceptor POST /api/token/refresh/ -> update context and retry
```

For production the refresh token should be stored in a secure HttpOnly cookie. This prototype keeps it in `localStorage` for simplicity.

## Managing users

Admins can manage user accounts at `/admin/users` when logged in. The screen lists existing users and allows creating new ones, toggling active state and resetting passwords. Generated passwords are shown once in a toast and cannot be retrieved later.

![Users](docs/users.gif)

## Assistant permissions

Assistants you can access will show a colored badge indicating your level:

![Permissions](docs/permissions.png)

* **Owner** – you created the assistant and can fully manage it.
* **Edit** – you may update settings and files.
* **Use** – read-only access for chatting.

## Sharing assistants

Owners can share assistants with individual users or entire departments using the Share button on the chat page. Choose the permission level and press Add.

![Share modal](docs/share-modal.png)
