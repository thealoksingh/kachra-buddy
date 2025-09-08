import React from "react";
import { ScrollView, View } from "react-native";
import MiniProductCard from "./MiniProductCard";

const MiniProductScrollSection = ({ products }) => {
  console.log("products", products);
  const row1Products = products.slice(0, 3);
  const row2Products = products.length > 3 ? products.slice(3) : [];

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
