export default function formatDateString(dateString: string) : string {
    const EST = { timeZone: 'America/New_York' }
    const hourLabels = new Map(
        [
            [8, 'Morning (8am EST)'],
            [13, 'Afternoon (1pm EST)'],
            [18, 'Evening (6pm EST)'],
        ],
    )

    const date = new Date(dateString)
    const weekday = new Intl.DateTimeFormat('en-US', { ...EST, weekday: 'short' })
        .format(date)
    const hour = date.getHours()
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    })
    const timeString = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });

    return `${weekday}, ${formattedDate}, ${hourLabels.get(hour) || timeString}`
}
