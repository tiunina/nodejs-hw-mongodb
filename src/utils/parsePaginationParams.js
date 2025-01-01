const parseNumber = (number, defaultValue) => {
  if (typeof number !== 'string') return defaultValue;
  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) return defaultValue;
  return parsedNumber;
};
export const parsePaginationParams = ({ page, perPage }) => {
  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};

// const parseNumber = (number, defaultValue) => {
//   if (typeof number === 'number' && !Number.isNaN(number)) {
//     return number;
//   }
//   if (typeof number === 'string') {
//     const parsedNumber = parseInt(number, 10);
//     if (!Number.isNaN(parsedNumber)) {
//       return parsedNumber;
//     }
//   }
//   return defaultValue;
// };

// export const parsePaginationParams = ({ page, perPage }) => {
//   const parsedPage = parseNumber(page, 1);
//   const parsedPerPage = parseNumber(perPage, 10);

//   return {
//     page: parsedPage,
//     perPage: parsedPerPage,
//   };
// };
