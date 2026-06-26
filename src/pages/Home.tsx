import { ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="home-hero">
      <div className="hero-copy">
        <p className="eyebrow">匿名集会所 MVP</p>
        <h1>アカツキ</h1>
        <p>
          夜明け前のような静けさで集まり、気軽に話せる公式HPの土台です。
          まずは匿名チャットの集会所から公開します。
        </p>
        <div className="hero-actions">
          <Link to="/chat" className="primary-button">
            集会所に入る
            <ArrowRight size={18} />
          </Link>
          <Link to="/rules" className="ghost-button">
            <Shield size={18} />
            ルールを見る
          </Link>
        </div>
      </div>
      <div className="signal-board" aria-hidden="true">
        <div className="signal-ring" />
        <div className="signal-core">A</div>
        <div className="signal-lines">
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}
