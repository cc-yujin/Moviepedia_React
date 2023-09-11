import { useCallback, useState } from 'react';

function useAsync(asyncFunction) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  // wrappedFunction : 네트워크 리퀘스트 보낼 때 사용하는 함수
  // asyncFunction : API 함수
  const wrappedFunction = useCallback(async (...args) => {
    try {
      setError(null);
      setPending(true);
      return await asyncFunction(...args);
    } catch (error) {
      setError(error);
      return;
    } finally {
      setPending(false);
    }
  }, [asyncFunction]);

  return [pending, error, wrappedFunction];
}

export default useAsync;

// 커스텀 Hook
// 함수명을 use~ 로 지을 것.
