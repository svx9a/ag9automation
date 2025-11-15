// src/components/editor/RealTimePreview.tsx
import React from 'react';

export const RealTimePreview: React.FC<{ html: string }> = ({ html }) => {
  return (
    <div className="preview-panel">
      <h3>🌐 Live Preview</h3>
      <div 
        className="preview-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};
