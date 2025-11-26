import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// 💡 ডাইনামিক বেস পাথ লজিক
// এটি অটোমেটিক ডিটেক্ট করবে তুমি লোকালহোস্টে আছ নাকি গিটহাবে
const repoPath = '/studydashboardfinal';
const isGitHub = window.location.pathname.startsWith(repoPath);
const basename = isGitHub ? repoPath : '/';

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* BrowserRouter যুক্ত করা হলো যাতে পাথ ঠিক থাকে */}
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

---

### **🚀 শেষ ধাপ: প্যাকেজ ইন্সটল ও ডিপ্লয়**

তোমার কোডে যেহেতু আমরা `BrowserRouter` ব্যবহার করেছি, তাই নিশ্চিত হতে হবে যে `react-router-dom` ইন্সটল করা আছে।

১. টার্মিনালে এই কমান্ডটি দাও:
```bash
npm install react-router-dom
```

২. এরপর কোড গিটহাবে পুশ করো:
```bash
git add .
git commit -m "fix: updated base path and router for github pages"
git push
