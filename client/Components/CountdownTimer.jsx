import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';

export default function CountdownTimer({ remainingTime }) {
    const [time, setTime] = useState(remainingTime);

    useEffect(() => {
        if (remainingTime.days >= 0 && remainingTime.hours >= 0 && remainingTime.minutes >= 0 && remainingTime.seconds >= 0) {
            const interval = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime <= 1000) {
                        clearInterval(interval);
                        return 0;
                    }
                    if (prevTime.seconds <= 0) {
                        return {
                            ...prevTime,
                            seconds: prevTime.seconds + 59,
                            minutes: prevTime.minutes - 1

                        }
                    }
                    if (prevTime.minutes <= 0) {
                        return {
                            ...prevTime,
                            minutes: prevTime.minutes + 59,
                            hours: prevTime.hours > 0 && prevTime.hours - 1
                        }
                    }
                    if (prevTime.hours < 1) {
                        return {
                            ...prevTime,
                            hours: prevTime.hours + 23,
                            days: prevTime.days
                        }
                    }
                    return {
                        days: Math.floor(prevTime.days),
                        hours: Math.floor(prevTime.hours),
                        minutes: Math.floor(prevTime.minutes),
                        seconds: Math.floor(prevTime.seconds - 1)

                    };

                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [remainingTime]);

    const days = Math.floor(time.days);
    const hours = Math.floor(time.hours);
    const minutes = Math.floor(time.minutes);
    const seconds = Math.floor(time.seconds);

    return (
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{`${days}:${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</Text>
    );
}
