import { Row } from 'antd';
import SummaryCard from './components/SummaryCard';
import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import useOnFetch from '@/hooks/useOnFetch';
import { tagColor } from '@/utilities/statusTagColor';
import { useSelector } from 'react-redux';

export default function DashboardModule() {
  const getStatsData = async ({ entity, currency }) => {
    return await request.summary({
      entity,
      options: { currency },
    });
  };

  return (
    <>
      <Row gutter={[32, 32]}>
        <SummaryCard
          title={'YB Hisob-fakturalar'}
          tagColor={'cyan'}
          prefix={'Bu oy'}
          isLoading={false}
          data={100}
        />
        <SummaryCard
          title={'Mijoz Hisob-fakturalar'}
          tagColor={'purple'}
          prefix={'Bu oy'}
          isLoading={false}
          data={100}
        />
        <SummaryCard
          title={'Umumiy oylik (Xodim)'}
          tagColor={'red'}
          prefix={'Bu oy'}
          isLoading={false}
          data={100000}
        />
        <SummaryCard
          title={'Berilgan avans (Xodim)'}
          tagColor={'green'}
          prefix={'Bu oy'}
          isLoading={false}
          data={100}
        />
      </Row>
    </>
  );
}
