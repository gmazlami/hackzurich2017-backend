'use strict';

const INSURANCE_FORMULA_SLOPE = -12.5
const INSURANCE_FORMULA_OFFSET = 17.5

module.exports.computeInsurancePrice = (price, sentiment) => {
  const priceInFrancs = price / 100;
  const a = INSURANCE_FORMULA_SLOPE * sentiment;
  const b = a + INSURANCE_FORMULA_OFFSET;
  return (b / 100) * priceInFrancs;
};
