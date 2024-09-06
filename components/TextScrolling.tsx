import { useEffect, useRef, useState } from "react";

interface ScrollingTextProps {
    text: string;
    speed?: number; // pixels per second
}
const TextScrolling = ({ text, speed = 40 }: ScrollingTextProps) => {
    const [position, setPosition] = useState(0);
    const [contentWidth, setContentWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null); // 컨테이너
    const contentRef = useRef<HTMLDivElement>(null); // 컨텐츠

    useEffect(() => {
        if (!containerRef.current || !contentRef.current) return;

        const containerWidth = Math.min(contentRef.current.offsetWidth, 372); // 컨테이너 너비
        setContentWidth(containerWidth);
        const totalScrollWidth = contentRef.current.offsetWidth - containerWidth;

        if (totalScrollWidth <= 0) return; // No need to scroll

        const animate = () => {
            setPosition((prevPosition) => {
                const newPosition = prevPosition - 1;
                return newPosition <= -contentRef.current!.offsetWidth ? 0 : newPosition;
            });
        };

        const intervalId = setInterval(animate, 1000 / speed);

        return () => clearInterval(intervalId);
    }, [text, speed]);

    return (
        <div
            ref={containerRef}
            className="overflow-hidden w-full rounded inline-block"
        // style={{ width: `${contentWidth}px` }}
        >
            <div
                ref={contentRef}
                className="whitespace-nowrap inline-block py-2 "
                style={{ transform: `translateX(${position}px)` }}
            >

                <span>{text}</span> {/* 짧은 텍스트 */}
                {/* {contentWidth === 372 && <span className="pl-4">{text}</span>} */}
            </div>
        </div>
    );
};

export default TextScrolling
