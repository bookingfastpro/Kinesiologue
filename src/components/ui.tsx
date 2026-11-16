import { useEffect, useRef, type ImgHTMLAttributes } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input:not([type="hidden"]), select, iframe, [tabindex]:not([tabindex="-1"])';

/**
 * Comportement accessible d'une fenêtre modale :
 * - bloque le défilement de la page,
 * - ferme avec la touche Échap,
 * - place le focus dans la fenêtre et le garde à l'intérieur (Tab / Maj+Tab),
 * - rend le focus à l'élément d'origine à la fermeture.
 */
export const useDialog = (isOpen: boolean, onClose: () => void) => {
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFirst = window.setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const target = el.querySelector<HTMLElement>("[data-autofocus]") || el.querySelector<HTMLElement>(FOCUSABLE);
      (target || el).focus();
    }, 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;
      const items = (Array.from(ref.current.querySelectorAll(FOCUSABLE)) as HTMLElement[]).filter(
        (n: HTMLElement) => n.offsetParent !== null || n === document.activeElement,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(focusFirst);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  return ref;
};

interface PictureProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  /** Chemin de l'image sans extension, ex: "/images/cabinet-kinesiologie-porto-vecchio" */
  base: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
}

/** Image WebP responsive (480 px + taille originale), chargée en différé par défaut. */
export const Picture = ({ base, alt, width, height, sizes, priority, ...rest }: PictureProps) => (
  <img
    src={`${base}.webp`}
    srcSet={`${base}-480.webp 480w, ${base}.webp ${width}w`}
    sizes={sizes || "(min-width: 1024px) 40vw, 100vw"}
    alt={alt}
    width={width}
    height={height}
    loading={priority ? "eager" : "lazy"}
    decoding={priority ? "sync" : "async"}
    {...(priority ? { fetchPriority: "high" as const } : {})}
    {...rest}
  />
);

/** Dimensions d'origine des images (évite les décalages de mise en page / CLS). */
export const IMAGES = {
  cabinet: { base: "/images/cabinet-kinesiologie-porto-vecchio", width: 764, height: 1020 },
  testMusculaire: { base: "/images/test-musculaire-kinesiologie", width: 736, height: 1030 },
  nature: { base: "/images/kinesiologie-bien-etre-corse", width: 736, height: 1104 },
  adulte: { base: "/images/seance-kinesiologie-adulte", width: 736, height: 1103 },
  enfant: { base: "/images/seance-kinesiologie-enfant", width: 735, height: 981 },
} as const;
