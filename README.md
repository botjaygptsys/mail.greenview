# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js

1.  **Install dependencies:**
    `npm install`

2.  **Set up environment variables:**
    Create a file named `.env.local` in the root of your project and add the following variable.

    ```
    # Get your key from Google AI Studio (https://aistudio.google.com/)
    VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```
    *Note on API Keys:*
    - The application's environment setup (`vite.config.ts`) uses the `VITE_` prefix by convention.
    - It will also recognize `GEMINI_API_KEY` if you prefer that.

3.  **Run the app:**
    `npm run dev`
