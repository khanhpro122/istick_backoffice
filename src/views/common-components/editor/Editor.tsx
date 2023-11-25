// Libraries
import React,{ useMemo }  from 'react';
import ReactQuill from 'react-quill';
import EditorToolbar, { modules, formats } from './EditorToolbar';
import 'react-quill/dist/quill.snow.css';
import './styles.css';
// Utils
import { generateKey } from '@/utils';

export const Editor = ({ value, onChange, placeholder}: any) => {
  const handleChange = (value: any) => {
    onChange(value);
  };
  const memoToolbarId = useMemo(() => {
    return generateKey(8)
  }, [])

  return (
    <div className='text-editor'>
      <EditorToolbar toolbarId={`toolbar${memoToolbarId}`} />
      <ReactQuill
        theme='snow'
        value={value}
        onChange={handleChange}
        placeholder={placeholder || 'Write something awesome...'}
        modules={modules(`toolbar${memoToolbarId}`)}
        formats={formats}
      />
    </div>
  );
};

export default Editor;
