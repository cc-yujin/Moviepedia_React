import ReviewList from './ReviewList';
import { useEffect, useState } from 'react';
import { createReview, getReviews, updateReview } from '../api';
import ReviewForm from './ReviewForm';

const LIMIT = 6; // 6개씩 보여줌

function App() {
  const [order, setOrder] = useState('createdAt'); //정렬
  const [items, setItems] = useState([]); 

  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(null);

  const sortedItems = [...items].sort((a, b) => b[order] - a[order]); //정렬함수

  const handleNewestClick = () => setOrder('createdAt'); 
  const handleBestClick = () => setOrder('rating');

  // 리스트 로딩 (첫렌더링, 더보기)
  const handleLoad = async (options) => {
    let result;
    try {
      setIsLoading(true); // 로딩중
      setLoadingError(null); // 일단 에러 없는 상태
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

  // 더보기
  const handleLoadMore = () => {
    handleLoad({ order, offset, limit: LIMIT });
  };

  // 글 생성
  const handleCreateSuccess = (review) => {
    setItems((prevItems) => [review, ...prevItems]);
  };

  // 글 수정
  const handleUpdateSuccess = (review) => {
    setItems((prevItems) => {
      const splitIdx = prevItems.findIndex((item) => item.id === review.id);
      return [
        ...prevItems.slice(0, splitIdx),
        review,
        ...prevItems.slice(splitIdx + 1),
      ];
    });
  };

  // 글 삭제
  const handleDelete = (id) => {
    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
  };

  // 맨처음 렌더링 될 때, order 스테이트 변경될 때마다
  useEffect(() => {
    handleLoad({ order, offset: 0, limit: LIMIT });
  }, [order]); 

  return (
    <div>
      <div>
        <button onClick={handleNewestClick}>최신순</button>
        <button onClick={handleBestClick}>베스트순</button>
      </div>
      <ReviewForm
        onSubmit={createReview}
        onSubmitSuccess={handleCreateSuccess}
      />
      <ReviewList
        items={sortedItems}
        onDelete={handleDelete}
        onUpdate={updateReview}
        onUpdateSuccess={handleUpdateSuccess}
      />
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
