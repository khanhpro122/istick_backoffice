import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import browserRouters from './routers/router';
import queryClient from './apis/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';

const routers = createBrowserRouter(browserRouters, { basename: '/bo' });

export default function App() {
  if (window.location.pathname === '/') {
    console.log(window.location.pathname);
    window.location.href = '/bo';
  }
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={'loading...'}>
        <RouterProvider router={routers} />;
      </Suspense>
    </QueryClientProvider>
  );
}
