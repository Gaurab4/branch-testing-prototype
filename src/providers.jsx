import { Provider } from "react-redux";
import { store } from "@/store/index.js";
import { AppThemeProvider } from "@/theme/theme-provider.jsx";

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <AppThemeProvider>{children}</AppThemeProvider>
    </Provider>
  );
}
