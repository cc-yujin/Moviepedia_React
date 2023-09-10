import { useState } from 'react';
import './ReviewForm.css';

function ReviewForm() {
  const [values, setValues] = useState({
    title: '',
    rating: 0,
    content: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // submit은 본래 입력 폼의 값과 함께 GET 리퀘스트 보낸다. -> 기본동작 막기
    console.log(values);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <form className='ReviewForm' onSubmit={handleSubmit}>
      <input name='title' value={values.title} onChange={handleChange} />
      <input name='rating' value={values.rating} onChange={handleChange} />
      <textarea name='content' value={values.content} onChange={handleChange} />
      <button type='submit'>확인</button>
    </form>
  );
}

export default ReviewForm;
