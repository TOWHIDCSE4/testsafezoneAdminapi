import { getPaymentTitle, SubscriptionPlanModel } from '@/models/Subscription';
import {
  createAuthorizedHandler,
  error,
  getUserIdFromEvent,
  init,
  success,
} from '@/modules/core';
import axios, { AxiosError } from 'axios';
import { sign } from 'jsonwebtoken';
import dayjs from 'dayjs';
import { createHmac } from 'crypto';
import { generateOrderId, OrderModel, ORDER_STATUS } from '@/models/Order';
import mongoose from 'mongoose';

function ksort<T = Record<string, any>>(obj: T) {
  var keys = Object.keys(obj).sort(),
    sortedObj = {} as typeof obj;

  for (var i in keys) {
    sortedObj[keys[i]] = obj[keys[i]];
  }

  return sortedObj;
}

function createSignatureData(requestObj: Record<string, any>) {
  let signData = '';

  for (let [key, value] of Object.entries(requestObj)) {
    if (typeof value === 'object') value = JSON.stringify(value);
    if (key !== 'signature') signData += `&${key}=${value}`;
  }

  signData = signData.substring(1);
  return signData;
}

export const handler = createAuthorizedHandler(async (e) => {
  await init();

  const { subscriptionPlanId, client } = JSON.parse(e.body || '{}');

  if (!subscriptionPlanId)
    return error('Subscription Plan ID is not provided.');

  if (!client || !['web', 'android'].includes(client))
    return error('Client is not specified. Valid values are: web, android');

  const plan = await SubscriptionPlanModel.findById(subscriptionPlanId);

  if (!plan) return error('Plan not found.');

  const expiredTime = dayjs().unix() + 60 * 30;

  const appotaToken = sign(
    {
      iss: process.env.APPOTA_PARTNER_CODE,
      jti: process.env.APPOTA_API_KEY + '-' + expiredTime, // (ex time: 1614225624)
      api_key: process.env.APPOTA_API_KEY,
      exp: expiredTime,
    },
    process.env.APPOTA_SECRET_KEY,
    {
      header: {
        typ: 'JWT',
        alg: 'HS256',
        cty: 'appotapay-api;v=1',
      },
    }
  );

  const notifyBaseUrl = process.env.IS_OFFLINE
    ? 'https://f796-27-76-207-161.ngrok.io'
    : process.env.AWS_GATEWAY_API_URL;

  const redirectBaseUrl = process.env.IS_OFFLINE
    ? 'http://localhost:9000'
    : process.env.SAFE_ZONE_PORTAL_URL;

  const orderName = getPaymentTitle(plan);
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const orderId = generateOrderId('web', plan);

    const order = await OrderModel.create(
      [
        {
          _id: orderId,
          userId: getUserIdFromEvent(e),
          subscriptionPlanId: subscriptionPlanId,
          orderAmount: plan.yearlyPrice,
          orderName: orderName,
          orderStatus: ORDER_STATUS.InProgress,
          externalMetadata: {},
          externalOrderId: '',
          externalStatusCode: undefined,
        },
      ]
      // TODO: Support TRANSACTION.
      // {
      //   session,
      // }
    );

    let orderDetails = {
      orderId: orderId,
      orderInfo: orderName,
      amount: plan.yearlyPrice,
      bankCode: '',
      paymentMethod: 'ATM',
      notifyUrl: notifyBaseUrl + '/v1/ipn',
      redirectUrl: redirectBaseUrl + '/payment-process',
      extraData: `userId=${getUserIdFromEvent(e)}`,
      clientIp: e.requestContext.identity.sourceIp,
      action: 'PAY_WITH_RETURN_TOKEN',
    };

    orderDetails = ksort(orderDetails);

    console.log(orderDetails);

    const signature = createHmac('sha256', process.env.APPOTA_SECRET_KEY)
      .update(createSignatureData(orderDetails))
      .digest('hex');

    const result = await axios.post(
      `${process.env.APPOTA_ENDPOINT}/v1.1/orders/payment/bank`,
      { ...orderDetails, signature },
      {
        headers: {
          'X-APPOTAPAY-AUTH': `Bearer ${appotaToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(result.data);

    await session.commitTransaction();
    return success({ ...result.data, order });
  } catch (e) {
    const err = e as AxiosError;
    await session.abortTransaction();
    return error(err.response.data);
  } finally {
    await session.endSession();
  }
});
