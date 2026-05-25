import { useEffect } from "react";

type SEOOptions = {
  title: string;
  description: string;
  path: string; // e.g. "/about"
  ogType?: "website" | "article";
};

const BASE_URL = "https://www.wellmindai.in";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSEO({ title, description, path, ogType = "website" }: SEOOptions) {
  useEffect(() => {
    const url = `${BASE_URL}${path}`;
    const desc = description.length > 160 ? description.slice(0, 157) + "..." : description;

    document.title = title;
    setMeta("name", "description", desc);
    setCanonical(url);

    setMeta("property", "og:title", title);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:url", url);

    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", desc);
  }, [title, description, path, ogType]);
}
