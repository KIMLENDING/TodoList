import { AlarmCheck, CalendarFold, House, ListTodo, PencilLine, Plus } from 'lucide-react';
export const sidebarLinks = [
    {
        imgURL: "/icons/house.svg",
        route: "/dashboard",
        label: "홈",
        component: House
    },
    {
        imgURL: "/icons/alarm-clock.svg",
        route: "/dashboard/routine",
        label: "루틴",
        component: AlarmCheck,
    },
    {
        imgURL: "/icons/list-todo.svg",
        route: "/dashboard/todos",
        label: "TODO 목록",
        component: ListTodo,
    },
    {
        imgURL: "/icons/pencil-line.svg",
        route: "/dashboard/createTodo",
        label: "TODO 생성",
        component: PencilLine,
    },
    {
        imgURL: "/icons/calendar-fold.svg",
        route: "/dashboard/calendar",
        label: "캘린더",
        component: CalendarFold,
    },
];