import AuthRouter from './AuthRouter';
import PageLoading from '../shared/components/pageLoader';
import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';

const ErpApp = lazy(() => import('./AppRouter'));

export const Routing = () => {
  const { isLoggedIn } = useSelector(selectAuth);
  const DefaultApp = () => (
    <Suspense fallback={<PageLoading />}>
      <ErpApp />
    </Suspense>
  );

  if (!isLoggedIn) return <AuthRouter />;
  else return <DefaultApp />;
};
