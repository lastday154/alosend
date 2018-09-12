"use strict";

const BUYING_RATE_SGD = 17000;
const SELLING_RATE_SGD = 17200;
const SELLING_RATE_INR = 340;
const BASIC_FEE = 500000;

module.exports.fulfillment = async (event, context) => {
  const { queryResult } = JSON.parse(event.body);
  let { action, amount, currency, from, to } = queryResult.parameters;
  let total;
  let fee;
  let fulfillmentText = "";
  let rate;
  currency = currency.toLowerCase();
  from = from.toLowerCase();
  to = to.toLowerCase();
  action = action.toLowerCase();
  if (action === "ban" && currency === "sgd") {
    rate = BUYING_RATE_SGD;
    if (amount >= 5000) {
      rate = BUYING_RATE_SGD + 50;
    }
    fulfillmentText = `Ty gia: ${rate} `;
    total = Math.floor(amount * rate);
    if (amount) {
      fulfillmentText += `|   Tong tien: ${amount.toLocaleString()} * ${rate} = ${total.toLocaleString()} VND`;
    }
  } else if (action === "mua" && currency === "sgd") {
    rate = SELLING_RATE_SGD;
    fulfillmentText = `Ty gia: ${rate} `;
    total = Math.floor(amount * rate);
    if (amount) {
      fulfillmentText += `|   Tong tien: ${amount.toLocaleString()} * ${rate} = ${total.toLocaleString()} VND`;
    }
  } else if (from === "singapore" && to === "vietnam" && currency === "vnd") {
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
