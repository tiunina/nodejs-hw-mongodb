export const calcPaginationData = ({ total, page, perPage }) => {
  const totalPages = Math.ceil(total / perPage);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  // console.log({
  //   total,
  //   page,
  //   perPage,
  //   totalPages,
  //   hasNextPage,
  //   hasPreviousPage,
  // });
  return {
    page,
    perPage,
    totalItems: total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};
