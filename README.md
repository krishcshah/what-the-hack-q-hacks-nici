# Nici - Your AI Grocery Assistant

Nici is an agentic grocery ordering application designed to provide a frictionless, "zero-second" checkout experience. By leveraging advanced AI, Nici understands your dietary preferences, family size, and schedule to automatically prepare and adjust your grocery cart.

## Features

* **Smart Onboarding:** Nici learns about your household (adults, kids, pets) and dietary preferences (Vegan, Vegetarian, Omnivore) to tailor your shopping experience.
* **Calendar Integration:** Connect your calendar so Nici can detect when you're away on trips and automatically pause your grocery deliveries.
* **Voice-Activated Adjustments:** Use the built-in voice agent to talk to Nici. Ask her to make your cart cheaper, swap items for vegan alternatives, or add specific items like hamburgers.
* **One-Tap AI Presets:** Quickly adjust your cart with presets like:
  * 💸 **Money Saver:** Swaps items for the cheapest generic versions.
  * 🌿 **Eco-Friendly:** Prioritizes sustainable and eco-friendly options.
  * 👨‍🍳 **Chef's Choice:** Upgrades items to premium, high-quality ingredients.
  * 📦 **Min Order Filler:** Automatically adds essential items to meet delivery minimums.
* **Camera Scanner (Duplicate Removal):** Scan your fridge or pantry using your device's camera. Nici will identify items you already have and remove them from your cart to prevent over-ordering.
* **Impact Tracking:** After confirming your order, see your real-world impact, including time saved and CO₂ emissions reduced.

## Tech Stack

* **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion (for fluid animations and transitions), Lucide React (for iconography).
* **Backend:** Express.js (serving API routes and static files).
* **AI Integration:** OpenAI API (GPT-4o-mini for intelligent cart adjustments and conversational responses, TTS-1 for voice synthesis).

## Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* npm or yarn
* An OpenAI API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nici-grocery-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Project Structure

* `/src/components`: Contains all React components (HomeView, CartView, Onboarding, VoiceAgent, etc.).
* `/api`: Contains the Express serverless functions for handling AI chat and TTS requests.
* `/public`: Static assets including images and logos.
* `server.ts`: The main Express server setup that serves both the API and the Vite frontend.

## Contributors 

* Krish Shah
* Benedict Seuß
* Anshul Srivastava
* Ekansh Agarwal
* Yash Raj

## License

This project is licensed under the MIT License.
