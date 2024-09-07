import { useEffect, useRef, useState } from "react";

interface ScrollingTextProps {
    text: string;
    speed?: number; // pixels per second
}
const TextScrolling = ({ text, speed = 40 }: ScrollingTextProps) => {
    const [position, setPosition] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const containerRef = useRef<HTMLDivElement>(null); // 컨테이너
    const contentRef = useRef<HTMLDivElement>(null); // 컨텐츠

    useEffect(() => {// 윈도우 창 크기 변경시
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        if (!containerRef.current || !contentRef.current) return;
        if (containerRef.current.offsetWidth > contentRef.current.offsetWidth) { // 컨테이너 너비가 컨텐츠 너비보다 크면
            //여기에 애니메이션 위치 초기화 시키는 코드 추가 
            setPosition(0);
            return console.log(' No need to scroll');
        }
        const animate = () => {
            setPosition((prevPosition) => {
                const newPosition = prevPosition - 1; // -1px 왼쪽으로 이동
                return newPosition <= -contentRef.current!.offsetWidth ? 0 : newPosition; // 이동한 거리가 컨텐츠 너비보다 크면 0으로 초기화
            });
        };
        const intervalId = setInterval(animate, 1000 / speed);
        return () => clearInterval(intervalId);
    }, [text, speed, windowWidth]); // 텍스트, 속도, 창 너비가 변경될 때마다 다시 실행

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-hidden w-full rounded inline-block"
        // style={{ width: `${contentWidth}px` }}
        >
            <div
                ref={contentRef}
                className="whitespace-nowrap inline-block py-2 "
                style={{ transform: `translateX(${position}px)` }}
            >

                <span>{text}</span>
                {/* {contentWidth === 372 && <span className="pl-4">{text}</span>} */}
            </div>
        </div>
    );
};

export default TextScrolling
