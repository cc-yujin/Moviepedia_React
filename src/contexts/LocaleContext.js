// State와 Context Provider를 함께 사용할 파일
import { createContext, useState, useContext } from 'react';

const LocaleContext = createContext();

export function LocaleProvider({ defaultValue = 'ko', children }) {
  const [locale, setLocale] = useState(defaultValue);

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

// locale 값 전달
export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('반드시 LocaleProvider 안에서 사용해야 합니다.');
  }

  return context.locale;
}

// setLocale 값을 가져올 때
export function useSetLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('반드시 LocaleProvider 안에서 사용해야 합니다.');
  }

  return context.setLocale;
}
