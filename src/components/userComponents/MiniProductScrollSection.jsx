import React from "react";
import { ScrollView, View } from "react-native";
import MiniProductCard from "./MiniProductCard"; 

const MiniProductScrollSection = ({ products }) => {
  const row1Products = products.slice(0, 3);
  const row2Products = products.length > 3 ? products.slice(3) : [];

  return (
    <View>
       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {row1Products.map((product, index) => (
          <MiniProductCard
            key={index}
            title={product.title}
            price={product.price}
            image={product.image}
            type={product.type}
          />
        ))}
      </ScrollView>

       {row2Products.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {row2Products.map((product, index) => (
            <MiniProductCard
              key={index + 3}
              title={product.title}
              price={product.price}
              image={product.image}
              type={product.type}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default MiniProductScrollSection;
