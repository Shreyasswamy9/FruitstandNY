import { useState, useEffect, RefObject } from "react";

interface UseScrollTriggerOptions {
  threshold?: number;
  delay?: number;
  containerRef?: RefObject<HTMLElement | HTMLDivElement | null>;
}

export const useScrollTrigger = ({ 
  threshold = 300, 
  delay = 1000,
  containerRef
}: UseScrollTriggerOptions = {}) => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (hasTriggered) return;

    const handleScroll = () => {
      let scrolled = false;
      
      if (containerRef?.current) {
        scrolled = containerRef.current.scrollTop > threshold;
      } else {
        scrolled = window.scrollY > threshold;
      }
      
      if (scrolled && !isTriggered) {
        // Add delay before showing modal
        setTimeout(() => {
          setIsTriggered(true);
          setHasTriggered(true);
        }, delay);
      }
    };

    const scrollElement = containerRef?.current || window;
    
    scrollElement.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [threshold, delay, isTriggered, hasTriggered, containerRef]);

  const resetTrigger = () => {
    setIsTriggered(false);
    setHasTriggered(false);
  };

  return { isTriggered, resetTrigger };
};