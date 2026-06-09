"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  classname?: string;
  texts: string[];
  delay?: number;
  pause?: number;
  infinite?: boolean;
}

export default function Typewriter({
  classname = "",
  texts,
  delay = 50,
  pause = 2000,
  infinite = true,
}: TypewriterProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!texts || texts.length === 0) return;

    const fullText = texts[currentTextIndex];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, delay / 2);
    } else {
      timer = setTimeout(() => {
        setCurrentText((prev) => fullText.slice(0, prev.length + 1));
      }, delay);
    }

    if (!isDeleting && currentText === fullText) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (infinite) {
          setIsDeleting(true);
        } else if (currentTextIndex < texts.length - 1) {
          setCurrentTextIndex((prev) => prev + 1);
        }
      }, pause);
    } else if (isDeleting && currentText === "") {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }, delay);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentTextIndex, texts, delay, pause, infinite]);

  return (
    <span className={classname}>
      {currentText}
      <span className="typewriter-cursor">|</span>
    </span>
  );
}
