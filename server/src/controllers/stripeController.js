import Stripe from "stripe";
const stripe = Stripe(process.env.VITE_STRIPE_SECRET_KEY);

const YOUR_DOMAIN = process.env.FRONT_URL;

export const createSession = async (req, res) => {
  try {
    const { lineItems } = req.body;
    if (!lineItems) {
      return res.status(400).json({ error: "Line items are required" });
    }

    const formattedLineItems = lineItems.map((item) => ({
      price: item.price,
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["FR"],
      },
      shipping_options: [
        {
          shipping_rate: "shr_1PfMM4RvflFVG7kR6kksvnD1",
        },
      ],
      consent_collection: {
        terms_of_service: "required",
      },
      custom_text: {
        terms_of_service_acceptance: {
          message: `I agree to the [Terms of Service](${YOUR_DOMAIN}/cgu)`,
        },
      },
      invoice_creation: {
        enabled: true,
      },
      phone_number_collection: {
        enabled: true,
      },
      custom_fields: [
        {
          key: "note",
          label: {
            type: "custom",
            custom: "Notes de commande",
          },
          type: "text",
          optional: true,
        },
      ],
      line_items: formattedLineItems,
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
      automatic_tax: { enabled: false },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  const user = req.user;
  
  if(user.role !== "ROLE_ADMIN" || user.role !== "ROLE_STORE_KEEPER") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const {nom, description, prix } = req.body;
  if(!nom || !prix) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let product = "";
  if (description) {
    product = await stripe.products.create({
      name: nom,
      description: description || "",
      default_price_data: {
        unit_amount: prix * 100 || 0,
        currency: "eur",
      },
    });
  } else {
    product = await stripe.products.create({
      name: nom,
      default_price_data: {
        unit_amount: prix * 100 || 0,
        currency: "eur",
      },
    });
  }

  res.json({ priceId: product.default_price });
};

export const updatePrice = async (req, res) => {
  const user = req.user;
  
  if(user.role !== "ROLE_ADMIN" || user.role !== "ROLE_STORE_KEEPER") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const { nom, prix, description, priceId } = req.body;
  if(!nom || !prix || !priceId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const products = await stripe.products.search({
      query: `active:'true' AND name:'${nom}'`,
    });

    const productId = products.data[0].id;

    const newPrice = await stripe.prices.create({
      unit_amount: prix * 100,
      currency: "eur",
      product: `${productId}`,
    });

    await stripe.products.update(productId, {
      default_price: `${newPrice.id}`,
      description: description || "",
      name: nom,
    });
    await stripe.prices.update(priceId, {
      active: false,
    });

    const newPriceId = newPrice.id;

    res.status(200).send({ productId, newPriceId });
  } catch (error) {
    console.error("Error updating price:", error);
    res.status(500).send({ error: error.message });
  }
};

export const fulfillCheckout = async (sessionId) => {
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });
  console.log("checkoutSession", checkoutSession.line_items.data);
};

export const getBalanceTransactions = async (req, res) => {
  const user = req.user;
  
  if(user.role !== "ROLE_ADMIN" || user.role !== "ROLE_STORE_KEEPER") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const { limit = 10, starting_after, ending_before } = req.query;
    const params = {
      limit: parseInt(limit),
      ...(starting_after && { starting_after }),
      ...(ending_before && { ending_before }),
    };

    const transactions = await stripe.charges.list(params);
    console.log(transactions);

    res.json({
      data: transactions.data,
      has_more: transactions.has_more,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const issueRefund = async (req, res) => {
  const user = req.user;
  
  if(user.role !== "ROLE_ADMIN" || user.role !== "ROLE_STORE_KEEPER") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const { transactionId } = req.body;
  if (!transactionId) {
    return res.status(400).json({ error: "Transaction ID is required" });
  }
  
  try {
    const refund = await stripe.refunds.create({ charge: transactionId });
    res.json(refund);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPaymentLink = async (req, res) => {
  const user = req.user;
  
  if(user.role !== "ROLE_ADMIN") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const { lineItems } = req.body;
  if (!lineItems) {
    return res.status(400).json({ error: "Line items are required" });
  }

  try {
    const paymentLink = await stripe.paymentLinks.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["FR"],
      },
      shipping_options: [
        {
          shipping_rate: "shr_1PfMM4RvflFVG7kR6kksvnD1",
        },
      ],
      consent_collection: {
        terms_of_service: "required",
      },
      custom_text: {
        terms_of_service_acceptance: {
          message: `I agree to the [Terms of Service](${YOUR_DOMAIN}/cgu)`,
        },
      },

      invoice_creation: {
        enabled: true,
      },
      phone_number_collection: {
        enabled: true,
      },
      custom_fields: [
        {
          key: "note",
          label: {
            type: "custom",
            custom: "Notes de commande",
          },
          type: "text",
          optional: true,
        },
      ],
      line_items: lineItems,
      after_completion: {
        type: "redirect",
        redirect: {
          url:
            process.env.FRONT_URL + "/success?session_id={CHECKOUT_SESSION_ID}",
        },
      },
      automatic_tax: { enabled: false },
    });
    res.json({ url: paymentLink.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSession = async (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" }); 
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSessionLineItems = async (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    res.json(lineItems.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInvoice = async (req, res) => {
  const { invoiceId } = req.params;
  if (!invoiceId) {
    return res.status(400).json({ error: "Invoice ID is required" });
  }

  try {
    const invoice = await stripe.invoices.retrieve(invoiceId);
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
