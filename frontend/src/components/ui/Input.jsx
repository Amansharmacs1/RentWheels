import React from 'react';

const Input = ({ label, type = 'text', ...props }) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input type={type} className="form-input" {...props} />
    </div>
  );
};

export default Input;
