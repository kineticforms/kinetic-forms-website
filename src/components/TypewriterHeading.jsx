import { useState, useEffect } from "react";

const TAGLINES = [
  "Dream Bigger.",
  "Move Faster.",
  "Let's Build.",
  "Tomorrow Together.",
];

export default function TypewriterHeading() {
  const [text, setText] = useState(TAGLINES[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(2500);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Start deleting after initial pause
    const initial = setTimeout(() => setIsDeleting(true), 2500);
    return () => clearTimeout(initial);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timer = setTimeout(() => {
      const i = loopNum % TAGLINES.length;
      const fullText = TAGLINES[i];

      if (isDeleting) {
        setText(fullText.substring(0, text.length - 1));
        setTypingSpeed(40);
      } else {
        setText(fullText.substring(0, text.length + 1));
        setTypingSpeed(100 - Math.random() * 40);
      }

      if (!isDeleting && text === fullText) {
        setTypingSpeed(2500);
        setIsDeleting(true);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      }
    }, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, mounted]);

  const spaceIndex = text.indexOf(" ");
  const displayText =
    spaceIndex !== -1 ? (
      <>
        {text.substring(0, spaceIndex)}
        <br />
        {text.substring(spaceIndex + 1)}
      </>
    ) : (
      text
    );

  return (
    <h1 className="text-5xl sm:text-7xl md:text-9xl font-medium tracking-tighter leading-[0.9] min-h-[120px] sm:min-h-[160px] md:min-h-[220px]">
      {displayText}
      <span className="inline-block font-light animate-pulse text-zinc-300 dark:text-zinc-600 -ml-1 md:-ml-2">
        |
      </span>
    </h1>
  );
}
