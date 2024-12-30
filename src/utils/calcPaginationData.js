export const calcPaginationData = ({ total, page, perPage }) => {
  const totalPage = Math.ceil(total / perPage);
  const hasNexPage = page < totalPage;
  const hasPrevPage = page > 1;

  return {
    totalPage,
    hasNexPage,
    hasPrevPage,
  };
};
