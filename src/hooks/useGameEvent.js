import { useEffect, useState } from 'react';
import EventBus from '../game/EventBus';

export function useGameEvent(eventName, initialValue = null) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        const handler = (data) => setValue(data);
        EventBus.on(eventName, handler);
        return () => EventBus.off(eventName, handler);
    }, [eventName]);

    return value;
}
