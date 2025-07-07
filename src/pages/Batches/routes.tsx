import { lazy } from 'react';
import { useRoutes } from 'react-router';

const BatchesList = lazy(() => import('./batchesList'));
const BatchesForm = lazy(() => import('./batchesForm'));

export default function Router() {
    const routes = useRoutes([
        { path: '/', element: <BatchesList /> },
        { path: 'batches-form', element: <BatchesForm /> }
    ])
    return routes;
}