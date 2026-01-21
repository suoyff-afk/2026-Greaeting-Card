# 2026 Chinese New Year Greeting Card 🐍✨

A premium, interactive 3D greeting card web application designed for the Year of the Snake/Horse 2026. This project features a beautiful flip animation, customizable content, and a festive atmosphere with particles and confetti.

## 🌟 Features

*   **Interactive 3D Flip**: Realistic postcard flip animation upon clicking "Open".
*   **Customizable Content**:
    *   **To/From Names**: Personalize sender and recipient names.
    *   **Message**: Write your own heartfelt New Year wishes (supports typing effect).
    *   **Photo Upload**: Upload your own photo to replace the default design.
    *   **Image Positioning**: Adjust your uploaded photo's focus (Top/Center/Bottom) for the perfect fit.
*   **Aesthetic Design**:
    *   **Retro Film Date Stamp**: A "Quartz Date Back" style timestamp (e.g., `' 26 01 22`) in nostalgic orange.
    *   **Premium Visuals**: Glassmorphism effects, golden typography (Google Fonts), and traditional texturing.
    *   **Atmosphere**: Background particle system and celebratory confetti bursts.
*   **Audio**: Background music support with play/pause control.
*   **Sharing**: Generates a unique link containing all your customizations (names, message, photo, layout) to share with friends via WeChat or other platforms.

## 📂 Project Structure

*   **`index.html`**: The main structure of the card, containing the front cover and the inside postcard layout.
*   **`style.css`**: All visual styling, including the 3D flip logic, responsive adjustments, and premium theme colors (`--primary-red`, `--gold`).
*   **`script.js`**: Handles interaction logic, including:
    *   URL parameter parsing (for reading shared cards).
    *   Link generation (for creating new cards).
    *   Image uploading (ImgBB API).
    *   Typewriter effects and confetti triggers.
*   **Assets**:
    *   `default_cover.jpg`: The default front cover image.
    *   `corner_decor.svg`: Vector vintage corner photo holders.
    *   `horse_decoration.png`: Transparent decorative elements.
    *   `postcard_bg.png`: Paper texture background.
    *   `bgm.mp3`: Background music file.
    *   `confetti.browser.min.js`: Local library for confetti effects.

## 🚀 How to Use

1.  **Open**: Simply open `index.html` in a web browser.
2.  **View**: Click the cover to flip the card and read the default greeting.
3.  **Create Your Own**:
    *   Click the **"我也要送祝福" (Create or Share)** button below the card.
    *   Fill in the **From** and **To** names.
    *   (Optional) Write a custom message.
    *   (Optional) Paste an image URL or upload a photo from your device.
    *   (Optional) Adjust the **Image Focus** (Top/Center/Bottom) if using a vertical photo.
4.  **Share**: Click **"预览并分享" (Preview & Share)**. The page will reload with your custom content. You can then copy the URL or forward it to friends.

## 🛠️ Customization Notes

*   **Music**: Replace `bgm.mp3` with your preferred audio file to change the background music.
*   **Images**: Ensure `default_cover.jpg` is present for the initial state. The card automatically handles cropping for uploaded images while keeping the default image intact (contain mode).

## 📝 License

Created by Suoyff for the 2026 New Year celebrations. Feel free to modify and share!

---
*Happy New Year 2026!* 🧧
