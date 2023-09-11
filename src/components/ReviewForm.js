import { useState } from 'react';
import './ReviewForm.css';
import FileInput from './FileInput';

function ReviewForm() {
  const [values, setValues] = useState({
    title: '',
    rating: 0,
    content: '',
    imgFile: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // submit은 본래 입력 폼의 값과 함께 GET 리퀘스트 보낸다. -> 기본동작 막기
    console.log(values);
  };

  const handleChange = (name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  return (
    <form className='ReviewForm' onSubmit={handleSubmit}>
      <FileInput
        name='imgFile'
        value={values.imgFile}
        onChange={handleChange}
      />
      <input name='title' value={values.title} onChange={handleInputChange} />
      <input name='rating' value={values.rating} onChange={handleInputChange} />
      <textarea
        name='content'
        value={values.content}
        onChange={handleInputChange}
      />
      <button type='submit'>확인</button>
    </form>
  );
}

export default ReviewForm;
