import React from 'react';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  return (
    <div className="pagination">
      <button 
        className="page-btn" 
        disabled={page === 1} 
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      
      {[...Array(pages)].map((_, index) => (
        <button
          key={index + 1}
          className={`page-btn ${page === index + 1 ? 'active' : ''}`}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      <button 
        className="page-btn" 
        disabled={page === pages} 
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
