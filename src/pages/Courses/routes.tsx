import { lazy } from 'react';
import { useRoutes } from 'react-router';

const CoursesList = lazy(() => import('./coursesList'));
const CoursesForm = lazy(() => import('./coursesForm'));

export default function Router() {
    const routes = useRoutes([
        { path: '/', element: <CoursesList /> },
        { path: 'courses-form', element: <CoursesForm /> }
    ])
    return routes;
}