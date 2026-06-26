import { MessageCircle, Shield } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="site-header">
      <NavLink to="/" className="brand" aria-label="アカツキ トップ">
        <span className="brand-mark">
          <Shield size={18} />
        </span>
        <span>アカツキ</span>
      </NavLink>
      <nav className="site-nav" aria-label="メインナビゲーション">
        <NavLink to="/chat">
          <MessageCircle size={16} />
          集会所
        </NavLink>
        <NavLink to="/rules">ルール</NavLink>
        <NavLink to="/admin">管理</NavLink>
      </nav>
    </header>
  );
}
