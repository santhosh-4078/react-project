import  { lazy } from 'react';
import { useRoutes } from 'react-router';

const InstructorsList = lazy(() => import('./InstructorsList'));
const InstructorsForm = lazy(() => import('./InstructorsForm'));

export default function Router() {
    const routes = useRoutes([
        { path: '/', element: <InstructorsList /> },
        { path: 'instructors-form', element: <InstructorsForm /> }
    ])
    return routes;
}