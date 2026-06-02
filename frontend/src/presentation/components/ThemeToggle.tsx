import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../application/context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-glass)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        fontFamily: 'var(--font-display)',
        fontSize: '0.85rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        transition: 'var(--transition-normal)',
        outline: 'none',
      }}
      className="theme-toggle-btn"
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
        {theme === 'light' ? (
          <>
            <Sun size={16} style={{ color: '#f59e0b' }} />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon size={16} style={{ color: '#a855f7' }} />
            <span>Dark Mode</span>
          </>
        )}
      </span>
      <span 
        style={{
          display: 'block',
          width: '24px',
          height: '14px',
          borderRadius: '7px',
          background: theme === 'light' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
          position: 'relative',
          transition: 'background var(--transition-normal)'
        }}
      >
        <span 
          style={{
            display: 'block',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#ffffff',
            position: 'absolute',
            top: '2px',
            left: theme === 'light' ? '12px' : '2px',
            transition: 'left var(--transition-normal)'
          }}
        />
      </span>
    </button>
  );
};
