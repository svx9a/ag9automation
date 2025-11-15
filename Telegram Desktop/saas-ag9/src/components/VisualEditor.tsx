// src/components/VisualEditor.tsx
import React, { useState, useRef } from 'react';

interface Block {
  id: string;
  type: 'text' | 'image' | 'button' | 'header';
  content: string;
  x: number;
  y: number;
}

export const VisualEditor: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'New text block' : 
               type === 'header' ? 'New header' : 
               type === 'button' ? 'Click me' : 'Image',
      x: 100,
      y: 100
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDragging(blockId);
    e.dataTransfer.setData('text/plain', blockId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragging || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setBlocks(blocks.map(block => 
      block.id === dragging ? { ...block, x, y } : block
    ));
    setDragging(null);
  };

  const updateBlockContent = (blockId: string, content: string) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, content } : block
    ));
  };

  return (
    <div className="visual-editor" style={{ display: 'flex', height: '100vh' }}>
      {/* Toolbar */}
      <div className="toolbar" style={{ width: '200px', padding: '20px', background: '#f5f5f5' }}>
        <h3>📦 Blocks</h3>
        <button onClick={() => addBlock('header')} style={toolbarButtonStyle}>📄 Header</button>
        <button onClick={() => addBlock('text')} style={toolbarButtonStyle}>📝 Text</button>
        <button onClick={() => addBlock('button')} style={toolbarButtonStyle}>🔘 Button</button>
        <button onClick={() => addBlock('image')} style={toolbarButtonStyle}>🖼️ Image</button>
        
        <div style={{ marginTop: '20px' }}>
          <h4>Live Preview:</h4>
          <div style={{ border: '1px solid #ccc', padding: '10px', background: 'white' }}>
            {blocks.map(block => (
              <div key={block.id} style={{ margin: '5px 0', padding: '5px', background: '#e9e9e9' }}>
                {block.type}: {block.content}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="canvas" 
        style={{ flex: 1, position: 'relative', background: 'white', border: '1px solid #ddd' }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {blocks.map(block => (
          <DraggableBlock 
            key={block.id}
            block={block}
            onDragStart={handleDragStart}
            onContentChange={updateBlockContent}
          />
        ))}
        
        {blocks.length === 0 && (
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            color: '#999',
            textAlign: 'center'
          }}>
            🎨 Drag blocks from the toolbar to start building
          </div>
        )}
      </div>
    </div>
  );
};

const toolbarButtonStyle = {
  display: 'block',
  width: '100%',
  padding: '10px',
  margin: '5px 0',
  border: '1px solid #ddd',
  background: 'white',
  cursor: 'pointer'
};

const DraggableBlock: React.FC<{
  block: Block;
  onDragStart: (e: React.DragEvent, blockId: string) => void;
  onContentChange: (blockId: string, content: string) => void;
}> = ({ block, onDragStart, onContentChange }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, block.id)}
      style={{
        position: 'absolute',
        left: block.x,
        top: block.y,
        padding: '10px',
        border: '2px dashed #007acc',
        background: 'white',
        cursor: 'move',
        minWidth: '100px',
        minHeight: '50px'
      }}
    >
      {block.type === 'header' && (
        <input
          type="text"
          value={block.content}
          onChange={(e) => onContentChange(block.id, e.target.value)}
          style={{ fontSize: '24px', fontWeight: 'bold', border: 'none', width: '100%' }}
          placeholder="Header text..."
        />
      )}
      
      {block.type === 'text' && (
        <textarea
          value={block.content}
          onChange={(e) => onContentChange(block.id, e.target.value)}
          style={{ border: 'none', width: '100%', minHeight: '80px' }}
          placeholder="Enter text..."
        />
      )}
      
      {block.type === 'button' && (
        <button style={{ padding: '10px 20px', background: '#007acc', color: 'white', border: 'none' }}>
          {block.content}
        </button>
      )}
      
      {block.type === 'image' && (
        <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed #ccc' }}>
          🖼️ {block.content}
          <div style={{ fontSize: '12px', color: '#666' }}>Image placeholder</div>
        </div>
      )}
      
      <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
        {block.type} • Drag to move
      </div>
    </div>
  );
};
