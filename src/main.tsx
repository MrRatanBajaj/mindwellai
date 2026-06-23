import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@fontsource/caveat/400.css'
import '@fontsource/caveat/700.css'
import '@fontsource/fraunces/400.css'
import '@fontsource/fraunces/600.css'
import '@fontsource/fraunces/700.css'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/600.css'
import '@fontsource/nunito/700.css'

createRoot(document.getElementById("root")!).render(<App />);
