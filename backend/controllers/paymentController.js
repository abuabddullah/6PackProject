const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",
    metadata: {
      company: "Ecommerce",
    },
    // payment_method_types: ['card']
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripePublishableApiKey = catchAsyncErrorsMiddleware(
  async (req, res, next) => {
    res
      .status(200)
      .json({
        stripePublishableApiKey: process.env.STRIPE_PUBLISHABLE_API_KEY,
      });
  }
);
