import ReviewList from './ReviewList';
import { useEffect, useState } from 'react';
import { getReviews } from '../api';
import ReviewForm from './ReviewForm';

const LIMIT = 6; // 6개씩 추가로 보여줌

function App() {
  const [order, setOrder] = useState('createdAt');
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(null);

  const sortedItems = [...items].sort((a, b) => b[order] - a[order]);

  const handleNewestClick = () => setOrder('createdAt');

  const handleBestClick = () => setOrder('rating');

  const handleDelete = (id) => {
    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
  };

  // 2. 로드 함수 실행.
  const handleLoad = async (options) => {
    let result;
    try {
      setIsLoading(true); // 로딩중
      setLoadingError(null); // 일단 에러 null
      result = await getReviews(options); // 받아옴
    } catch (error) {
      setLoadingError(error); // error를 setLoadingError
      return;
    } finally {
      setIsLoading(false); // 로딩 끝났으면 false로 set
    }
    const { paging, reviews } = result;
    if (options.offset === 0) {
      setItems(reviews);
    } else {
      setItems((prevItems) => [...prevItems, ...reviews]);
    }
    setOffset(options.offset + reviews.length);
    setHasNext(paging.hasNext);
  };

  // 3. 더보기 누를 때
  const handleLoadMore = () => {
    handleLoad({ order, offset, limit: LIMIT });
  };

  // 1. 맨처음 렌더링 될 때 실행
  useEffect(() => {
    handleLoad({ order, offset: 0, limit: LIMIT });
  }, [order]); // 처음 마운트 될 때, order 스테이트 값이 바뀔 때마다 콜백함수 실행

  return (
    <div>
      <div>
        <button onClick={handleNewestClick}>최신순</button>
        <button onClick={handleBestClick}>베스트순</button>
      </div>
      <ReviewForm />
      <ReviewList items={sortedItems} onDelete={handleDelete} />
      {hasNext && (
        <button disabled={isLoading} onClick={handleLoadMore}>
          더 보기
        </button>
      )}
      {loadingError?.message && <span>{loadingError.message}</span>}
    </div>
  );
}

export default App;
