import type { Screen } from '../types';

interface BottomNavProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
  alertCount: number;
  onAddPress: () => void;
}

const TEAL = '#00CCCC';
const MUTED = '#4A5168';

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? TEAL : 'none'} stroke={active ? TEAL : MUTED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function GarageIcon({ active }: { active: boolean }) {
  const c = active ? TEAL : MUTED;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="8" width="20" height="12" rx="2" />
      <path d="M2 8l3-5h14l3 5" />
      <circle cx="7.5" cy="16" r="1.5" fill={c} stroke="none" />
      <circle cx="16.5" cy="16" r="1.5" fill={c} stroke="none" />
      <path d="M5 13h14" />
    </svg>
  );
}

function HistoryIcon({ active }: { active: boolean }) {
  const c = active ? TEAL : MUTED;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}

function BellIcon({ active, count }: { active: boolean; count: number }) {
  const c = active ? TEAL : MUTED;
  return (
    <div style={{ position: 'relative' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {count > 0 && (
        <div style={{
          position: 'absolute', top: -4, right: -4,
          width: 16, height: 16, borderRadius: '50%',
          background: '#EF4444', color: '#fff', fontSize: 9, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid #0D0F13',
        }}>
          {count > 9 ? '9+' : count}
        </div>
      )}
    </div>
  );
}

export default function BottomNav({ activeScreen, onNavigate, alertCount, onAddPress }: BottomNavProps) {
  const item = (label: string, icon: React.ReactNode, screen: Screen) => (
    <button
      onClick={() => onNavigate(screen)}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 4, background: 'none', border: 'none',
        cursor: 'pointer', padding: '8px 0 4px',
      }}
    >
      {icon}
      <span style={{
        fontSize: 10, fontWeight: activeScreen === screen ? 600 : 400,
        color: activeScreen === screen ? TEAL : MUTED,
        letterSpacing: '0.02em',
      }}>
        {label}
      </span>
    </button>
  );

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 390,
      zIndex: 100,
      boxSizing: 'content-box',
      paddingBottom: 'env(safe-area-inset-bottom)',
      height: 76,
      background: '#0D0F13',
      borderTop: '1px solid #1D2028',
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    }}>
      {item('Início', <HomeIcon active={activeScreen === 'dashboard'} />, 'dashboard')}
      {item('Garagem', <GarageIcon active={activeScreen === 'garage'} />, 'garage')}

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button
          onClick={onAddPress}
          style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(145deg, #00DEDE, #009A9A)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,204,204,0.45)',
            transform: 'translateY(-12px)',
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={e => (e.currentTarget.style.transform = 'translateY(-8px)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'translateY(-12px)')}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {item('Histórico', <HistoryIcon active={activeScreen === 'history'} />, 'history')}
      {item('Alertas', <BellIcon active={activeScreen === 'alerts'} count={alertCount} />, 'alerts')}
    </div>
  );
}
