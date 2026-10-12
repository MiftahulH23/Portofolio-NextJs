import { render } from "@testing-library/react";
import { LanguageProvider } from "@/context/LanguageContext";

export function renderWithLanguage(el: React.ReactElement) {
  return render(<LanguageProvider>{el}</LanguageProvider>);
}
