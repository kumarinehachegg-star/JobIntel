import React from 'react';

interface Props {
  title: string;
  description?: string;
  url?: string;
  jsonLd?: object;
}

const Seo: React.FC<Props> = ({ title, description, url, jsonLd }) => {
  React.useEffect(() => {
    document.title = title;
    if (description) {
      let d = document.querySelector('meta[name="description"]');
      if (!d) {
        d = document.createElement('meta');
        d.setAttribute('name', 'description');
        document.head.appendChild(d);
      }
      d.setAttribute('content', description);
    }

    // JSON-LD
    if (jsonLd) {
      const id = 'job-json-ld';
      let s = document.getElementById(id) as HTMLScriptElement | null;
      if (!s) {
        s = document.createElement('script');
        s.type = 'application/ld+json';
        s.id = id;
        document.head.appendChild(s);
      }
      s.text = JSON.stringify(jsonLd);
    }

    return () => {
      // remove JSON-LD on unmount
      const s = document.getElementById('job-json-ld');
      if (s) s.remove();
    };
  }, [title, description, jsonLd]);

  return (
    <>
      {url && <link rel="canonical" href={url} />}
    </>
  );
};

export default Seo;
