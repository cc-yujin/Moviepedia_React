import { useRef, useEffect, useState } from 'react';
import placeholderImg from '../assets/preview-placeholder.png';
import resetImg from '../assets/ic-reset.png';
import './FileInput.css';

function FileInput({className = '', name, value, initialPreview, onChange }) {
  const [preview, setPreview] = useState(initialPreview);

  const inputRef = useRef();

  const handleChange = (e) => {
    const nextValue = e.target.files[0];
    onChange(name, nextValue);
  };

  const handleClearClick = () => {
    const inputNode = inputRef.current;
    if (!inputNode) return;

    inputNode.value = '';
    onChange(name, null);
  };

  useEffect(() => {
    if (!value) return;

    const nextPreview = URL.createObjectURL(value); // 파일에 해당하는 주소 생성
    setPreview(nextPreview);

    return () => {
      // 정리함수. 
      // 실행 시점: 새로운 콜백함수 호출 실행 전(앞에서 실행한 콜백의 사이드 이펙트 정리), 
      // 컴포넌트가 화면에서 사라지기 전(맨 마지막으로 실행한 콜백의 사이드 이펙트 정리)
      setPreview(initialPreview); // 초기화
      URL.revokeObjectURL(nextPreview);
    };
  }, [value, initialPreview]);

  return (
    <div className={`FileInput ${className}`}>
      <img
        className={`FileInput-preview ${preview ? 'selected' : ''}`}
        src={preview || placeholderImg}
        alt="이미지 미리보기"
      />
      <input
        className="FileInput-hidden-overlay"
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleChange}
        ref={inputRef}
      />
      {value && (
        <button className="FileInput-clear-button" onClick={handleClearClick}>
          <img src={resetImg} alt="선택해제" />
        </button>
      )}
    </div>
  );
}

export default FileInput;
