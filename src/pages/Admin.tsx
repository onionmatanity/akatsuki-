export default function Admin() {
  return (
    <section className="admin-page panel">
      <p className="eyebrow">Admin</p>
      <h1>管理ページ</h1>
      <p>
        今回は仮ページです。今後、通報確認、メッセージ削除、NGワード管理、
        BAN機能などをここへ追加できる構成にします。
      </p>
      <div className="admin-placeholders">
        <div>
          <strong>通報確認</strong>
          <span>準備中</span>
        </div>
        <div>
          <strong>メッセージ削除</strong>
          <span>準備中</span>
        </div>
        <div>
          <strong>NGワード管理</strong>
          <span>準備中</span>
        </div>
      </div>
    </section>
  );
}
