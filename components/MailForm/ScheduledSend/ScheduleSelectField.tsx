import { useState, useEffect } from 'react'
import { SelectField } from 'evergreen-ui'
import formatDateString from '@/components/MailForm/ScheduledSend/formatDateString'

export default function ScheduleSelectField({
    label = '', description = '', required = false, includeNow = false,
    handleScheduleChange, schedule, ...selectOptions
}) {
    const [optionTags, setOptionTags] = useState([])

    const hours = [8, 13, 18] // 8am, 1pm, 6pm
    const daysToGenerate = 4

    // Generate dates and times for scheduled send based on user's time
    useEffect(() => {
        const dates = []
        const todayEST = new Date(new Date()
            .toLocaleString('en-US', { timeZone: 'America/New_York' }))
        for (let day = 0; day < daysToGenerate; day += 1) {
            hours.forEach((hour) => {
                const newDate = new Date(todayEST)
                newDate.setDate(todayEST.getDate() + day)
                newDate.setHours(hour, 0, 0, 0)
                dates.push({
                    date: newDate,
                    dateLabel: formatDateString(newDate.toISOString()),
                })
            })
        }

        // Only include options with dates > the current time
        const options = dates.filter((option) => {
            const estNow = new Date(new Date()
                .toLocaleString('en-US', { timeZone: 'America/New_York' }))
            return option.date > estNow
        })

        // Prepend the scheduled time to the front of options
        if (!includeNow) {
            const originalScheduleObj = {
                date: new Date(new Date(schedule)
                    .toLocaleString('en-US', { timeZone: 'America/New_York' })),
                dateLabel: formatDateString(schedule),
            }
            const optionLabels = options.map((option) => option.dateLabel)
            const index = optionLabels.indexOf(originalScheduleObj.dateLabel);
            if (index !== -1) {
                // Time already exists, move it to the front of the array
                options.splice(0, 0, options.splice(index, 1)[0])
            } else {
                // Time doesn't exist, add it to the front of the array
                options.unshift(originalScheduleObj)
            }
        }

        // Map over the options and create a JSX tag for each one
        setOptionTags(
            includeNow
                ? [
                    <option key="now" value="now">
                        Now
                    </option>,
                    ...options.map(({ date, dateLabel }) => (
                        <option key={date.toISOString()} value={date.toISOString()}>
                            {dateLabel}
                        </option>
                    )),
                ] : [
                    ...options.map(({ date, dateLabel }) => (
                        <option key={date.toISOString()} value={date.toISOString()}>
                            {dateLabel}
                        </option>
                    )),
                ],
        )
    }, [schedule])

    return (
        <SelectField
            label={label}
            required={required}
            description={description}
            value={schedule}
            onChange={handleScheduleChange}
            {...selectOptions}
        >
            {optionTags}
        </SelectField>
    )
}
