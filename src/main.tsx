// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import "swiper/swiper-bundle.css";
// import "flatpickr/dist/flatpickr.css";
// import App from "./App.tsx";
// import { AppWrapper } from "./components/common/PageMeta.tsx";
// import { ThemeProvider } from "./context/ThemeContext.tsx";

// // ✅ Import React Query setup
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// // ✅ Create query client instance
// const queryClient = new QueryClient();

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <ThemeProvider>
//         <AppWrapper>
//           <App />
//         </AppWrapper>
//       </ThemeProvider>
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   </StrictMode>
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// 🌐 Global styles and 3rd party styles
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";

// 🧱 App layout and context providers
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";

// ✅ React Query setup
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// ✅ Reuse shared queryClient from centralized config
// This allows caching, custom defaultOptions, persistence etc.
import { queryClient } from "./services/queryClient.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 🔄 Makes React Query available across your app */}
    <QueryClientProvider client={queryClient}>
      {/* 🎨 Theme context for dark/light mode, etc. */}
      <ThemeProvider>
        {/* 🔗 Wraps routes, meta info, etc. */}
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>

      {/* 🧪 Devtools for inspecting queries at runtime */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);