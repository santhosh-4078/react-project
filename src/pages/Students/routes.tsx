import { lazy } from 'react';
import { useRoutes } from 'react-router';

const StudentsList = lazy(() => import('./studentsList'));
const StudentsForm = lazy(() => import('./studentsForm'));

export default function Router() {
    const routes = useRoutes([
        { path: '/', element: <StudentsList /> },
        { path: 'students-form', element: <StudentsForm /> }
    ])
    return routes;
}