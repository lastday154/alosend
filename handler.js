"use strict";

const BUYING_RATE_SGD = 17000;
const SELLING_RATE_SGD = 17200;
const SELLING_RATE_INR = 340;
const BASIC_FEE = 500000;

module.exports.fulfillment = async (event, context) => {
  const { queryResult } = JSON.parse(event.body);
  let { amount, currency, from, to } = queryResult.parameters;
  let total;
  let fee;
  let fulfillmentText = "";
  currency = currency.toLowerCase();
  from = from.toLowerCase();
  to = to.toLowerCase();

  if (from === "singapore" && to === "vietnam" && currency === "vnd") {
    total = Math.ceil(amount / BUYING_RATE_SGD);
    fulfillmentText = `${amount.toLocaleString()} / ${BUYING_RATE_SGD} = ${total.toLocaleString()} SGD`;
  } else if (from === "singapore" && to === "vietnam" && currency === "sgd") {
    total = Math.floor(amount * BUYING_RATE_SGD);
    fulfillmentText = `${amount.toLocaleString()} * ${BUYING_RATE_SGD} = ${total.toLocaleString()} VND`;
  } else if (from === "vietnam" && to === "singapore" && currency === "vnd") {
    total = Math.floor(amount / SELLING_RATE_SGD);
    fulfillmentText = `${amount.toLocaleString()} / ${SELLING_RATE_SGD} = ${total.toLocaleString()} SGD`;
  } else if (from === "vietnam" && to === "singapore" && currency === "sgd") {
    total = Math.ceil(amount * SELLING_RATE_SGD);
    fulfillmentText = `${amount.toLocaleString()} * ${SELLING_RATE_SGD} = ${total.toLocaleString()} VND`;
  } else if (from === "vietnam" && to === "india" && currency === "inr") {
    total = amount * SELLING_RATE_INR;
    if (total > 50000000) {
      fee = total * 0.01;
    } else {
      fee = BASIC_FEE;
    }
    total += fee;
    fulfillmentText = `${amount.toLocaleString()} * ${SELLING_RATE_INR} + ${fee.toLocaleString()} = ${total.toLocaleString()} VND`;
  } else if (from === "vietnam" && to === "india" && currency === "vnd") {
    if (amount > 50000000) {
      fee = amount * 0.01;
    } else {
      fee = BASIC_FEE;
    }
    total = Math.floor((amount - fee) / SELLING_RATE_INR);
    fulfillmentText = `(${amount.toLocaleString()} - ${fee.toLocaleString()}) / ${SELLING_RATE_INR} = ${total.toLocaleString()} INR`;
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      fulfillmentText
    })
  };
};
