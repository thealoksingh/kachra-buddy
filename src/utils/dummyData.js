export const products = [
  { id:1,
    title: 'Recycled Shoes',
    material:"plastic",
    price: 500,
    image:
      'https://media.istockphoto.com/id/2189452303/photo/hydraulic-material-handler-sorting-scrap-tires.webp?a=1&b=1&s=612x612&w=0&k=20&c=IbWe6aeT7CZEYa8sOZ014POuv1ZX79WR_WerCo4Rlu8=',
    type: 'countable',
  },
  {id:2,
    title: 'Plastic Bottle',
    material:"plastic",
    price: 200,
    image:
      'https://media.istockphoto.com/id/2189452303/photo/hydraulic-material-handler-sorting-scrap-tires.webp?a=1&b=1&s=612x612&w=0&k=20&c=IbWe6aeT7CZEYa8sOZ014POuv1ZX79WR_WerCo4Rlu8=',
    type: 'nonCountable',
  },
  {id:3,
    title: 'Tyre',
    material:"rubber",
    price: 800,
    image:
      'https://media.istockphoto.com/id/2189452303/photo/hydraulic-material-handler-sorting-scrap-tires.webp?a=1&b=1&s=612x612&w=0&k=20&c=IbWe6aeT7CZEYa8sOZ014POuv1ZX79WR_WerCo4Rlu8=',
    type: 'countable',
  },
  {id:4,
    title: 'Bamboo Sunglasses',
    material:"glass",
    price: 1200,
    image:
      'https://media.istockphoto.com/id/2189452303/photo/hydraulic-material-handler-sorting-scrap-tires.webp?a=1&b=1&s=612x612&w=0&k=20&c=IbWe6aeT7CZEYa8sOZ014POuv1ZX79WR_WerCo4Rlu8=',
    type: 'countable',
  },
  {id:5,
    title: 'utensils',
    material:"aluminium",
    price: 350,
    image:
      'https://media.istockphoto.com/id/2189452303/photo/hydraulic-material-handler-sorting-scrap-tires.webp?a=1&b=1&s=612x612&w=0&k=20&c=IbWe6aeT7CZEYa8sOZ014POuv1ZX79WR_WerCo4Rlu8=',
    type: 'countable',
  },
   {id:6,
    title: 'Metal Drum',
    material:"metal",
    price: 350,
    image:
      'https://media.istockphoto.com/id/2189452303/photo/hydraulic-material-handler-sorting-scrap-tires.webp?a=1&b=1&s=612x612&w=0&k=20&c=IbWe6aeT7CZEYa8sOZ014POuv1ZX79WR_WerCo4Rlu8=',
    type: 'countable',
  },
];




export const addsData = [
  {
    url: 'https://st3.depositphotos.com/1561359/13520/v/1600/depositphotos_135200286-stock-illustration-black-running-shoes-ad.jpg',
  },
  {
    url: 'https://webneel.com/daily/sites/default/files/images/daily/02-2016/16-nike-shoe-print-ads-design.jpg',
  },
  {
    url: 'https://plus.unsplash.com/premium_photo-1669644856868-6613f6683346?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];



export const bookings = [
  {
    id: '1',
    address: 'F101 wing F Gurukul apr vadgao bk pune 411041',
    status: 'pending',
    pickupStatus: 'Pending',
    driverStatus: 'Allocated',
    pickupDateTime: '20 Aug 2025, 10:30 AM',
    items: 5,
    expectedPrice: '₹1,250',
    images: [
      'https://images.unsplash.com/photo-1562077981-4d7eafd44932?q=80&w=1170&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562077981-4d7eafd44932?q=80&w=1170&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562077981-4d7eafd44932?q=80&w=1170&auto=format&fit=crop',
    ],
  },
  {
    id: '2',
    address: 'A-204 Green Homes, Baner Pune',
    status: 'completed',
    pickupStatus: 'Completed',
    driverStatus: 'Ramesh',
    pickupDateTime: '10 Aug 2025, 02:15 PM',
    items: 3,
    expectedPrice: '₹800',
    images: [
      'https://images.unsplash.com/photo-1562077981-4d7eafd44932?q=80&w=1170&auto=format&fit=crop',
    ],
  },
  {
    id: '3',
    address: 'C-501, Skyline Towers, Hinjewadi Pune',
    status: 'cancelled',
    pickupStatus: 'Cancelled',
    driverStatus: 'N/A',
    pickupDateTime: '05 Aug 2025, 11:00 AM',
    items: 7,
    expectedPrice: '₹2,000',
    images: [
      'https://images.unsplash.com/photo-1562077981-4d7eafd44932?q=80&w=1170&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562077981-4d7eafd44932?q=80&w=1170&auto=format&fit=crop',
    ],
  },
];
