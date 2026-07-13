// Dark glowing title band shown at the top of dedicated pages
// (About / Services / Resume / Projects / Blogs / Contact).
export default function PageBand({ title }) {
  return (
    <div className="page-band">
      <h1>{title}</h1>
    </div>
  );
}
