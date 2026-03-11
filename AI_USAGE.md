# AI Usage Summary - Allen Biju

## Tools Used

- **Claude (AI software planning agent)**
- **Cursor (AI coding agent)**
  
## How AI Helped

- **Planning & feature design**  
  - Claude helped brainstorm and prioritize features such as the sleep tracker, water tracker, correlation analysis, stats dashboard, mood heatmap, theme system, reminder banner, and mood quote/greeting components.
  - Claude also helped me to create prompts that would make sure Cursor would not do anything outside of the breadth of each feature.
    
- **Implementation**  
  - Generated React components for:
    - `SleepTracker`, `SleepGraph`, `WaterTracker`, `WaterGraph`
    - `MoodHeatmap`, `CorrelationChart`, `StatsCard`
    - `ColorThemePicker` with preset color themes and CSS variables
    - Reminder system (`ReminderBanner`, `ReminderSettings`)
    - Dashboard enhancements (`MoodQuote`, `DashboardGreeting`, `StreakBadge`)
  - Helped wire these into `App.jsx` with tab navigation and shared context in `HealthDataContext.jsx`.

- **Debugging**
  - Guided small refactors for better UX, like adding more informative empty states and ensuring charts don’t break when there is no data.
  - Verified that the app builds successfully with `npm run build`.

## Limitations and Issues Encountered

- **Styling inconsistencies** - Some Cursor AI-generated code initially mixed light and dark mode styles, which made the UI look inconsistent. I reviewed the JSX and CSS and removed/standardized dark-mode classes so the design is coherent. 

- **Overly generic code suggestions** - The AI sometimes suggested extra abstractions or more complex patterns than necessary. I simplified several components to keep them straightforward.

- **Date handling subtleties** - For streaks and mood trends, the AI’s first attempts didn’t always match the exact definition I wanted. I double-checked date logic and adjusted the filter.

- **Need for human review**  
  - Even though the AI generated most of the code and many components, I still had to:
    - Check that props, state, and context were wired correctly.
    - Ensure UI copy and labels made sense in the context of the app.
    - Run the app, test flows, and fix small regressions introduced by new features.
