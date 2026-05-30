import Button from "../../ui/Button";

export function EmptyCart() {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center text-primary text-2xl gap-2">
      <p>!Opps looks like you havent added anything yet</p>
      <Button variant="primary" to="/products" size="md" className="rounded-sm">
        Continue Shopping
      </Button>
    </div>
  );
}
