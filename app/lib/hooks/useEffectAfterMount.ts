import { DependencyList, useEffect, useRef } from "react";

export default function useEffectAfterMount(
    effect: () => void,
    deps: DependencyList
) {
    const hasMounted = useRef(false);

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }
        effect();
    }, deps);
}