import ReviewList from './ReviewList';
import { useCallback, useEffect, useState } from 'react';
import { createReview, deleteReview, getReviews, updateReview } from '../api';
import ReviewForm from './ReviewForm';
import useAsync from '../hooks/useAsync';
import LocaleSelect from './LocaleSelect';
import { LocaleProvider } from '../contexts/LocaleContext';

const LIMIT = 6; // 6개씩 보여줌

function App() {
  const [order, setOrder] = useState('createdAt'); //정렬
  const [items, setItems] = useState([]);

  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, loadingError, getReviewsAsync] = useAsync(getReviews);

  const sortedItems = [...items].sort((a, b) => b[order] - a[order]); //정렬함수

  const handleNewestClick = () => setOrder('createdAt');
  const handleBestClick = () => setOrder('rating');

  // 리스트 로딩 (첫렌더링, 더보기)
  const handleLoad = useCallback(
    async (options) => {
      let result = await getReviewsAsync(options);
      if (!result) return; // 에러가 난 경우 undefined 이기 때문에, 뒷부분 실행 하지 않기 위해.

      const { paging, reviews } = result;
      if (options.offset === 0) {
        setItems(reviews);
      } else {
        setItems((prevItems) => [...prevItems, ...reviews]);
      }
      setOffset(options.offset + reviews.length);
      setHasNext(paging.hasNext);
    },
    [getReviewsAsync]
  );

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
  const handleDelete = async (id) => {
    const result = await deleteReview(id);
    if (!result) return;
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // 맨처음 렌더링 될 때, order 스테이트 변경될 때마다
  useEffect(() => {
    handleLoad({ order, offset: 0, limit: LIMIT });
  }, [order, handleLoad]);

  return (
    <LocaleProvider defaultValue={'ko'}>
      <div>
        <LocaleSelect />
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
          onUpdate={updateReview} // api
          onUpdateSuccess={handleUpdateSuccess} // 글 수정 함수
        />
        {hasNext && (
          <button disabled={isLoading} onClick={handleLoadMore}>
            더 보기
          </button>
        )}
        {loadingError?.message && <span>{loadingError.message}</span>}
      </div>
    </LocaleProvider>
  );
}

export default App;
