// src/features/ai/components/LoadingIndicator.tsx
const LoadingIndicator = () => {
  const styles = {
    container: {
      display: 'flex',
      gap: '8px',
      padding: '12px 16px',
      backgroundColor: '#F3F4F6',
      borderRadius: '18px',
      width: 'fit-content',
    },
    dot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#9CA3AF',
      borderRadius: '50%',
      animation: 'bounce 1.4s infinite ease-in-out both',
    },
  };

  const animationStyles = `
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <div style={styles.container}>
        <div style={{ ...styles.dot, animationDelay: '0s' }} />
        <div style={{ ...styles.dot, animationDelay: '0.2s' }} />
        <div style={{ ...styles.dot, animationDelay: '0.4s' }} />
      </div>
    </>
  );
};

export default LoadingIndicator;