import { useEffect, useState } from "react";

export default function useOnMobile(mq) {
    const [isBreakpoint, setIsBreakpoint] = useState(window.matchMedia(mq).matches);

    useEffect(() => {
        const mediaQuery = window.matchMedia(mq);
        const updateState = (e) => {
            setIsBreakpoint(e.matches);
        }
        mediaQuery.addEventListener('change', updateState);
        return () => mediaQuery.removeEventListener('change', updateState);
    });

    return isBreakpoint;
}