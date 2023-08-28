'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import statusApi from '@/modules/status/data/statusApi';
import surveyApi from '@/modules/survey/surveyApi';
import { SurveyDetailType } from '@/modules/survey/surveyTypes';
import { Edit2, Eye, Trash } from 'iconsax-react';
import moment from 'moment';
import { useEffect, useState } from 'react';

const SurveyTableListing = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [onDelete, setOnDelete] = useState<any>(undefined);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    dispatch(
      surveyApi.endpoints.getPaginatedSurveysList.initiate(pageIndex + 1)
    );
  }, [dispatch, pageIndex]);

  const surveyListPaginatedData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getPaginatedSurveysList`]
        ?.data as PaginatedResponseType<SurveyDetailType>
  );

  return (
    <>
      <AlertDialog
        isOpen={modalIsOpen}
        deleteContent={onDelete?.title}
        onClickNo={() => {
          closeModal();
        }}
        onClickYes={async () => {
          if (onDelete) {
            await Promise.resolve(
              dispatch(
                statusApi.endpoints.deleteStatus.initiate({
                  ...onDelete,
                })
              )
            );
          }
          closeModal();
          setOnDelete(undefined);
        }}
      />
      <TableCard
        footer={
          surveyListPaginatedData &&
          surveyListPaginatedData.results.length > 0 ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 0}
              canNextPage={
                pageIndex < surveyListPaginatedData.pagination.total_page - 1
              }
              pageCount={surveyListPaginatedData.pagination.total_page}
              pageIndex={surveyListPaginatedData.pagination.current_page - 1}
            />
          ) : (
            <></>
          )
        }
      >
        <thead>
          <tr className={tableStyles.table_thead_tr}>
            <th className={tableStyles.table_th + ` w-28`}>REF. ID</th>
            <th className={tableStyles.table_th + ` w-28`}>TYPE</th>
            <th className={tableStyles.table_th}>TITLE</th>
            <th className={tableStyles.table_th + ` w-28`}>START DATE</th>
            <th className={tableStyles.table_th + ` w-28`}>END DATE</th>
            <th className={tableStyles.table_th + ` w-36`}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {surveyListPaginatedData?.results?.map((survey, index) => {
            return (
              <tr key={index} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td + ` w-28`}>
                  {survey.ref_id}
                </td>
                <td className={tableStyles.table_td + ` w-28 capitalize`}>
                  {survey.kind}
                </td>
                <td className={tableStyles.table_td}>{survey.title}</td>
                <td className={tableStyles.table_td + ` w-28`}>
                  {moment(survey.start_date).format('ll')}
                </td>
                <td className={tableStyles.table_td + ` w-28`}>
                  {moment(survey.end_date).format('ll')}
                </td>
                <td className={tableStyles.table_td + ` flex gap-2 w-36`}>
                  <Button
                    className="h-8 w-8"
                    type="link"
                    kind="secondary"
                    href={`admin/surveys/each/${survey.ref_id}`}
                    prefix={<Eye size={18} variant="Bold" />}
                  />
                  <Button
                    className="h-8 w-8"
                    type="link"
                    href={`admin/surveys/mutate/${survey.ref_id}`}
                    prefix={<Edit2 size={18} variant="Bold" />}
                  />
                  <Button
                    className="h-8 w-8"
                    prefix={<Trash size={18} variant="Bold" />}
                    kind="danger"
                    type="button"
                    onClick={() => {
                      setOnDelete(survey);
                      openModal();
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </TableCard>
    </>
  );
};

export default SurveyTableListing;
