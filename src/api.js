// fetch 호출하고 받아온 리스폰스 body 리턴하는 함수
export async function getReviews({
  order = 'createdAt',
  offset = 0,
  limit = 6,
}) {
  const query = `order=${order}&offset=${offset}&limit=${limit}`;
  const response = await fetch(
    `https://learn.codeit.kr/9817/film-reviews?${query}`
  );
  const body = await response.json();
  return body;
}
