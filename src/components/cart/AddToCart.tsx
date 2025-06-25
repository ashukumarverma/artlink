"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { addToCart } from "@/actions/cartAction";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { SelectLabel } from "@radix-ui/react-select";

interface AddToCartProps {
  productId: string;
  stock: number;
  price: number;
}

const AddToCart = ({ productId, stock, price }: AddToCartProps) => {
  const { toast } = useToast();
  const user = useCurrentUser();
  const { refreshCart, cartItems } = useCart();
  const [quantity, setQuantity] = useState("1");
  const [isLoading, setIsLoading] = useState(false);

  // Find if the product is already in the cart
  const existingCartItem = cartItems.find(item => item.productId === productId);
  const availableStock = stock - (existingCartItem?.quantity || 0);

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    const selectedQuantity = parseInt(quantity);
    if (selectedQuantity > availableStock) {
      toast({
        title: "Error",
        description: "Not enough stock available",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log("user.id", user.id);
      console.log("productId", productId);
      console.log("selectedQuantity", selectedQuantity);  
      const result = await addToCart(user.id, productId, selectedQuantity);
      console.log("result", result);

      if ("error" in result) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      await refreshCart();

      toast({
        title: "Success",
        description: "Item added to cart successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add item to cart - Error ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quantityOptions = Array.from(
    { length: Math.min(availableStock, 10) },
    (_, i) => (i + 1).toString()
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-2 items-center">
        <Select value={quantity} onValueChange={setQuantity}>
          <SelectTrigger className="w-24 text-black">
            <SelectValue placeholder="Qty" />
          </SelectTrigger>
          <SelectContent>
            {quantityOptions.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {availableStock} pieces available
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-lg font-semibold">
          Total: ₹{(price * parseInt(quantity)).toLocaleString()}
        </span>
      </div>
      <Button
        className="w-full"
        onClick={handleAddToCart}
        disabled={isLoading || availableStock === 0}
      >
        {isLoading ? "Adding..." : availableStock === 0 ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  );
};

export default AddToCart;
