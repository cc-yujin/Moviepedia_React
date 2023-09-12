import { useState } from 'react';
import './ReviewForm.css';
import FileInput from './FileInput';
import RatingInput from './RatingInput';
import useAsync from '../hooks/useAsync';
import useTranslate from '../hooks/useTranslate';

const INITIAL_VALUES = {
  title: '',
  rating: 0,
  content: '',
  imgFile: null,
};

function ReviewForm({
  className = '',
  initialValues = INITIAL_VALUES,
  initialPreview,
  onSubmitSuccess,
  onCancel,
  onSubmit,
}) {
  const t = useTranslate();
  const [isSubmitting, submittingError, onSubmitAsync] = useAsync(onSubmit);
  const [values, setValues] = useState(initialValues);

  const handleSubmit = async (e) => {
    e.preventDefault(); // submit은 본래 입력 폼의 값과 함께 GET 리퀘스트 보낸다. -> 기본동작 막기
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('rating', values.rating);
    formData.append('content', values.content);
    formData.append('imgFile', values.imgFile);

    const result = await onSubmitAsync(formData);
    if (!result) return;
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
    <form className={`ReviewForm ${className}`} onSubmit={handleSubmit}>
      <FileInput
        className='ReviewForm-preview'
        name='imgFile'
        value={values.imgFile}
        initialPreview={initialPreview}
        onChange={handleChange}
      />
      <div className='ReviewForm-rows'>
        <div className='ReviewForm-title-rating'>
          <input
            className='ReviewForm-title'
            name='title'
            value={values.title}
            placeholder={t('title placeholder')}
            onChange={handleInputChange}
          />
          <RatingInput
            className='ReviewForm-rating'
            name='rating'
            value={values.rating}
            onChange={handleChange}
          />
        </div>

        <textarea
          className='ReviewForm-content'
          name='content'
          value={values.content}
          placeholder={t('content placeholder')}
          onChange={handleInputChange}
        />
        <div className='ReviewForm-error-buttons'>
          <div className='ReviewForm-error'>
            {submittingError && <div>{submittingError.message}</div>}
          </div>
          <div className='ReviewForm-buttons'>
            {onCancel && (
              <button className='ReviewForm-cancel-button' onClick={onCancel}>
                {t('cancel button')}
              </button>
            )}
            <button
              className='ReviewForm-submit-button'
              disabled={isSubmitting}
              type='submit'
            >
              {t('confirm button')}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default ReviewForm;
