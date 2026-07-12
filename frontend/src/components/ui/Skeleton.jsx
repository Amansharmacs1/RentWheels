import React from 'react';

const Skeleton = ({ type = 'text', count = 1, className = '' }) => {
  const renderSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < count; i++) {
      skeletons.push(
        <div 
          key={i} 
          className={`skeleton skeleton-${type} ${className}`} 
        />
      );
    }
    return skeletons;
  };

  return <>{renderSkeletons()}</>;
};

export default Skeleton;
