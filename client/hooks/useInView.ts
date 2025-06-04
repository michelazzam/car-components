import {
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  RefCallback,
} from "react";

interface Options {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export const useInView = (
  targetRef: MutableRefObject<Element | null>,
  options: Options = {}
): { isIntersecting: boolean; setRef: RefCallback<Element> } => {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const setRef: RefCallback<Element> = (ref) => {
    targetRef.current = ref;
  };

  useEffect(() => {
    if (!targetRef.current) {
      // If the ref is not attached to an element, do nothing
      return;
    }

    const callback = (entries: IntersectionObserverEntry[]) => {
      setIsIntersecting(entries[0].isIntersecting);
    };

    observer.current?.disconnect(); // Disconnect existing observer, if any

    observer.current = new IntersectionObserver(callback, options);
    observer.current.observe(targetRef.current);

    return () => {
      observer.current?.disconnect(); // Cleanup the observer on component unmount
    };
  }, [targetRef, options.root, options.rootMargin, options.threshold]);

  return { isIntersecting, setRef };
};
