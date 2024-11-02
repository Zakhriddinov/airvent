import React from 'react';
import Layouts from '../components/layout';
import { Container } from './style';

import { Routes, Route } from 'react-router-dom';
import { sidebar } from '../utilities/routing/sidebar';
import NotFoundPage from '../pages/not-found';
import Logout from '@/pages/Logout';
import { CrudContextProvider } from '@/context/crud';

const AppRouter = () => {
  return (
    <CrudContextProvider>
      <Container>
        <Routes>
          <Route element={<Layouts />}>
            {sidebar.map((parent) => {
              const ElementParent = parent.element;
              if (parent?.items && parent?.items.length !== 0) {
                return parent.items.map((child) => {
                  const ElementChild = child.element;
                  return <Route key={child.id} path={child.path} element={<ElementChild />} />;
                });
              } else
                return (
                  <>
                    (
                    <Route key={parent.id} path={parent.path} element={<ElementParent />} />
                    )
                    <Route path="*" element={<NotFoundPage />} />
                  </>
                );
            })}
          </Route>
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Container>
    </CrudContextProvider>
  );
};

export default AppRouter;
