import { useState, useEffect } from 'react'
import { SelectField } from 'evergreen-ui'

export default function ScheduleSelectField({ handleScheduleChange }) {
    const [optionTags, setOptionTags] = useState([])
    const [schedule, setSchedule] = useState('now')

    const handleSelectChange = (e) => {
        setSchedule(e.target.value)
        handleScheduleChange(e)
    }

    // Generate dates and times for scheduled send based on user's time
    useEffect(() => {
        const EST = { timeZone: 'America/New_York' }
        const times = ['Morning (8am EST)', 'Afternoon (1pm EST)', 'Evening (6pm EST)']
        const timeLabels = [
            { hour: 8, label: times[0] },
            { hour: 13, label: times[1] },
            { hour: 18, label: times[2] },
        ]

        // get dates for 0, 1, 2, 3 days in the future
        const dates = Array.from({ length: 4 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const weekday = new Intl.DateTimeFormat('en-US', { ...EST, weekday: 'short' })
                .format(date)
            const formattedDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            })
            return { date, label: `${weekday}, ${formattedDate}` };
        })

        // Map over the dates and add the times to each date
        const options = dates.flatMap(({ date, label }) => (
            timeLabels.map(({ hour, label: timeLabel }) => ({
                date: new Date(date.setHours(hour, 0, 0, 0)),
                label: `${label} ${timeLabel}`,
            }))
        // Only include options with dates > the current time
        ).filter((option) => {
            const estNow = new Date(new Date()
                .toLocaleString('en-US', { timeZone: 'America/New_York' }))
            return option.date > estNow
        }))

        // Map over the options and create a JSX tag for each one
        setOptionTags([
            <option key="now" value="now">
                Now
            </option>,
            ...options.map(({ date, label }) => (
                <option key={date.toISOString()} value={date.toISOString()}>
                    {label}
                </option>
            )),
        ])
    }, [])

    return (
        <SelectField
            label="NEW FEATURE: Scheduled Time"
            required
            description="Send emails now or schedule them up to four days
             in advance! Emails will be sent out in batches at 8am,
              1pm, and 6pm EST. You may only schedule one email per time slot."
            value={schedule}
            onChange={handleSelectChange}
        >
            {optionTags}
        </SelectField>
    )
}
