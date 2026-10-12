/**
 * 通用时间表组件
 * @description 提供完整的时间表功能，包括日历视图、编辑、删除等操作
 */

import Timetable from './index.vue';
import TimetableHeader from './components/TimetableHeader.vue';
import MonthlyCalendar from './components/MonthlyCalendar.vue';
import WeeklyCalendar from './components/WeeklyCalendar.vue';
import DayItem from './components/DayItem.vue';
import DateItem from './components/DateItem.vue';
import EditorModal from './components/EditorModal/index.vue';

export { Timetable, TimetableHeader, MonthlyCalendar, WeeklyCalendar, DayItem, DateItem, EditorModal };

export * from './types';
export * from './hooks/useTimetableState';

export default Timetable;
