# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Managing Assistants

Run `npm run dev` and open the app in your browser. The home page lists all existing assistants retrieved from `/api/assistants/`. Use the form on the page to enter a name and submit to create a new assistant.

To chat with an assistant the frontend now posts messages to `/api/assistants/<uuid>/chat/`. The backend returns the assistant's reply which is displayed in the chat window.


When creating a new assistant you can select a model from a dropdown menu. The list now includes a fixed set of options (`gpt-4`, `gpt-4o`, `o3-mini`) and the chosen model is sent along with the create request.

File uploads are also supported during assistant creation. Select one or more files in the form and they will be uploaded using `multipart/form-data` when the request is sent to `/api/assistants/`.

Existing assistants can be edited in the UI. When updating you may upload additional files or select existing ones to remove. The form submits a `PATCH` request to `/api/assistants/<uuid>/` including any new `files` and a `remove_files` list containing the file IDs to delete.


