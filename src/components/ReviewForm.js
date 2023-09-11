import { useState } from 'react';
import './ReviewForm.css';
import FileInput from './FileInput';
import RatingInput from './RatingInput';

const INITIAL_VALUES = {
  title: '',
  rating: 0,
  content: '',
  imgFile: null,
};

function ReviewForm({
  initialValues = INITIAL_VALUES,
  initialPreview,
  onSubmitSuccess,
  onCancel,
  onSubmit,
}) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [submittingError, setSubmittingError] = useState(null);
  const [values, setValues] = useState(initialValues);

  const handleSubmit = async (e) => {
    e.preventDefault(); // submit은 본래 입력 폼의 값과 함께 GET 리퀘스트 보낸다. -> 기본동작 막기
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('rating', values.rating);
    formData.append('content', values.content);
    formData.append('imgFile', values.imgFile);

    let result;
    try {
      setSubmittingError(null);
      setSubmitting(true); // 처리중
      result = await onSubmit(formData); // createReviews로 전달
    } catch (error) {
      setSubmittingError(error);
      return;
    } finally {
      setSubmitting(false);
    }
    const { review } = result;
    onSubmitSuccess(review);
    setValues(INITIAL_VALUES);
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
        initialPreview={initialPreview}
        onChange={handleChange}
      />
      <input name='title' value={values.title} onChange={handleInputChange} />
      <RatingInput
        name='rating'
        value={values.rating}
        onChange={handleChange}
      />
      <textarea
        name='content'
        value={values.content}
        onChange={handleInputChange}
      />
      {onCancel && <button onClick={onCancel}>취소</button>}
      <button type='submit' disabled={isSubmitting}>
        확인
      </button>
      {submittingError?.message && <div>{submittingError.message}</div>}
    </form>
  );
}

export default ReviewForm;
