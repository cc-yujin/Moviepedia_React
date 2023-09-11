const BASE_URL = 'https://learn.codeit.kr/9817'

// 1. 리뷰리스트 가져오기
export async function getReviews({
  order = 'createdAt',
  offset = 0,
  limit = 6,
}) {
  // throw new Error('버그가 아니라 기능입니다.');
  const query = `order=${order}&offset=${offset}&limit=${limit}`;
  const response = await fetch(
    `https://learn.codeit.kr/9817/film-reviews?${query}`
  );
  if (!response.ok) {
    throw new Error('리뷰를 불러오는데 실패했습니다.');
  }
  const body = await response.json();
  return body;
}

// 2. 글 작성하기
export async function createReview(formData) {
  const response = await fetch(
    `${BASE_URL}/film-reviews?`,
    {
      method: 'POST',
      body: formData,
    }
  );
  if (!response.ok) {
    throw new Error('리뷰를 생성하는데 실패했습니다.');
  }
  const body = await response.json();
  return body;
}

// 3. 글 수정하기
export async function updateReview(id, formData) {
  const response = await fetch(
    `${BASE_URL}/film-reviews/${id}`,
    {
      method: 'PUT',
      body: formData,
    }
  );
  if (!response.ok) {
    throw new Error('리뷰를 수정하는데 실패했습니다.');
  }
  const body = await response.json();
  return body;
}
