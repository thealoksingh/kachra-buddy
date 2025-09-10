import React from "react";
import { ScrollView, View } from "react-native";
import MiniProductCard from "./MiniProductCard";

const MiniProductScrollSection = ({ products }) => {
  console.log("products", products);
 let row1Products = [];
  let row2Products = [];

  if (products.length < 3) {
    // Case 1: Less than 3 → all in row1
    row1Products = products;
    row2Products = [];
  } else if (products.length <= 6) {
    // Case 2: Between 3 and 6 → 3 in row1, rest in row2
    row1Products = products.slice(0, 3);
    row2Products = products.slice(3);
  } else {
    // Case 3: More than 6 → split in half
    const mid = Math.ceil(products.length / 2);
    row1Products = products.slice(0, mid);
    row2Products = products.slice(mid);
  }
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {row1Products.map((product, index) => (
          <MiniProductCard
            key={product?.id}
            itemId={product?.id}
            title={product?.name}
            price={product?.pricePerUnit}
            image={product?.imageUrl}
            isCountable={product?.isCountable}
          />
        ))}
      </ScrollView>

      {row2Products.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {row2Products.map((product, index) => (
            <MiniProductCard
              key={product?.id}
              itemId={product?.id}
              title={product?.name}
              price={product?.pricePerUnit}
              image={product?.imageUrl}
              isCountable={product?.isCountable}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default MiniProductScrollSection;
