const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const orderService = {
  async createOrder() {
    await delay(500);

    const orders = JSON.parse(localStorage.getItem("orders_db") || "[]");

    const newOrder = {
      id: "ORD-ABC123",

      userId: currentUser.id,

      items,

      totalPrice: 2500,

      status: "processing",

      contact,

      delivery,

      payment,

      createdAt: new Date().toISOString(),
    };
  },
};
