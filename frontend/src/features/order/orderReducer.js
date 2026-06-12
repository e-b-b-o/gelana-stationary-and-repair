export const initialState = {
  orders: [],
};

export default function orderReducer(state, action) {
  switch (action.type) {
    case "order/init":
      return {
        ...state,
        orders: action.payload,
      };
    case "order/addOrder":
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };
    case "order/updateStatus":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id
            ? { ...order, status: action.payload.status }
            : order,
        ),
      };
    case "order/clear":
      return {
        ...state,
        orders: [],
      };
    default:
      return state;
  }
}
