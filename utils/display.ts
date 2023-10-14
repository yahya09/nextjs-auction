
export function formatTime(seconds: number) {
    if (isNaN(seconds) || seconds < 0) {
        return 'Invalid input';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = [];
    if (hours > 0) {
        formattedTime.push(`${hours}h`);
    }
    if (minutes >= 0) {
        formattedTime.push(`${minutes}m`);
    }
    if (remainingSeconds >= 0) {
        formattedTime.push(`${remainingSeconds}s`);
    }

    return formattedTime.join(' ');
}