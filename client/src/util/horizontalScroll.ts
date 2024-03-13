export const handleHorizontalScroll = (
  event: React.WheelEvent<HTMLDivElement>,
  scrollRef: React.RefObject<HTMLDivElement>
) => {
  const container = scrollRef.current;
  if (container) {
    const scrollAmount = event.deltaY * 1.5;
    const scrollLeft = container.scrollLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    let newScrollLeft = scrollLeft + scrollAmount;

    newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));
    smoothScroll(container, scrollLeft, newScrollLeft);
  }
};

const smoothScroll = (
  element: HTMLElement,
  start: number,
  end: number,
  duration = 300
) => {
  const startTime = performance.now();
  const animateScroll = (timestamp: number) => {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeOutQuart(progress);

    element.scrollTo({
      left: start + (end - start) * ease,
      behavior: "auto",
    });

    if (elapsed < duration) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

const easeOutQuart = (t: number) => {
  return 1 - --t * t * t * t;
};
