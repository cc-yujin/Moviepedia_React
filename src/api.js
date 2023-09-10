// fetch 호출하고 받아온 리스폰스 body 리턴하는 함수
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
  if(!response.ok){
    throw new Error('리뷰를 불러오는데 실패했습니다.')
  }
  const body = await response.json();
  return body;
}
