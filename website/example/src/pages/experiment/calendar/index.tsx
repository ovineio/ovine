import React from 'react'

import TuiCalendar from './tui_cleandar'

import 'tui-calendar/dist/tui-calendar.css'

const myTheme = {
  // Theme object to extends default dark theme.
}

const CalendarApp = () => (
  <TuiCalendar
    height="900px"
    calendars={[
      {
        id: '0',
        name: 'Private',
        bgColor: '#9e5fff',
        borderColor: '#9e5fff',
      },
      {
        id: '1',
        name: 'Company',
        bgColor: '#00a9ff',
        borderColor: '#00a9ff',
      },
    ]}
    disableDblClick
    disableClick={false}
    isReadOnly={false}
    month={{
      startDayOfWeek: 0,
    }}
    scheduleView
    taskView
    theme={myTheme}
    timezones={[
      {
        timezoneOffset: 540,
        displayLabel: 'GMT+09:00',
        tooltip: 'Seoul',
      },
      {
        timezoneOffset: -420,
        displayLabel: 'GMT-08:00',
        tooltip: 'Los Angeles',
      },
    ]}
    useDetailPopup
    useCreationPopup
    // view={selectedView} // You can also set the `defaultView` option.
    week={{
      showTimezoneCollapseButton: true,
      timezonesCollapsed: true,
    }}
  />
)

export default () => {
  return (
    <div>
      <CalendarApp />
    </div>
  )
}
