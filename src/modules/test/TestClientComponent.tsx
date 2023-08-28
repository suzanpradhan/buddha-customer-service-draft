'use client';

import { AppDispatch, RootState } from '@/core/redux/store';
import { setData } from '@/modules/test/testSlice';
import { useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { getTestDataAPI } from './testApi';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function TestClientComponent() {
  const dispatch = useAppDispatch();
  // const data = useAppSelector((state: RootState) => state.test.data);

  useEffect(() => {
    dispatch(getTestDataAPI.endpoints.get.initiate());
  }, [dispatch]);

  // const queryData = useAppSelector(
  //   (state: RootState) =>
  //     state.getTestDataAPI.queries[`get(${undefined})`]?.data as string[]
  // );

  return (
    <div>
      {/* <p>client: {data}</p> */}
      {/* <p>queryClient: {queryData ? queryData[0] : ''}</p> */}
      <input
        type="text"
        className="border"
        onChange={(e) => dispatch(setData(e.target.value))}
      />
    </div>
  );
}
