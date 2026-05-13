export default function Header({ eyebrow, title, description, actions }) {
  return (
    <section className="page__hero">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1 className="page__title">{title}</h1>
      {description && <p className="page__subtitle">{description}</p>}
      {actions && <div className="actions-row" style={{ marginTop: '22px' }}>{actions}</div>}
    </section>
  );
}