/**
 * data.js — Menu items & categories
 * Add / edit items here to update the menu.
 */

const MENU = [
  { id: 1,  name: "Masala Maggi",      desc: "Classic street-style Maggi with veggies & spices",          price: 50,  emoji: "🍜", cat: "Snacks",  veg: true  },
  { id: 2,  name: "Veg Burger",        desc: "Crispy patty with lettuce, cheese & special sauce",          price: 80,  emoji: "🍔", cat: "Burgers", veg: true  },
  { id: 3,  name: "Chicken Burger",    desc: "Spicy fried chicken with coleslaw & jalapeños",              price: 110, emoji: "🍔", cat: "Burgers", veg: false },
  { id: 4,  name: "Cheese Pizza",      desc: "Hand-tossed with mozzarella & fresh basil",                 price: 120, emoji: "🍕", cat: "Pizza",   veg: true  },
  { id: 5,  name: "Samosa (2pc)",      desc: "Crispy pastry filled with spiced potatoes & peas",          price: 30,  emoji: "🥟", cat: "Snacks",  veg: true  },
  { id: 6,  name: "Cold Coffee",       desc: "Blended espresso with milk & vanilla ice cream",            price: 70,  emoji: "☕", cat: "Drinks",  veg: true  },
  { id: 7,  name: "Aloo Tikki",        desc: "Golden potato patty served with green chutney",             price: 40,  emoji: "🥔", cat: "Snacks",  veg: true  },
  { id: 8,  name: "Pav Bhaji",         desc: "Buttery bhaji with soft pav — Mumbai street style",        price: 90,  emoji: "🥘", cat: "Meals",   veg: true  },
  { id: 9,  name: "Paneer Wrap",       desc: "Tandoori paneer with onions & mint chutney in a wrap",     price: 100, emoji: "🌯", cat: "Meals",   veg: true  },
  { id: 10, name: "Egg Roll",          desc: "Kolkata-style egg wrap with onions & spiced veggies",      price: 70,  emoji: "🥚", cat: "Meals",   veg: false },
  { id: 11, name: "Mango Shake",       desc: "Fresh alphonso mango blended with chilled milk",           price: 80,  emoji: "🥭", cat: "Drinks",  veg: true  },
  { id: 12, name: "Chicken Sandwich",  desc: "Grilled chicken with mayo, onion & sliced tomato",        price: 95,  emoji: "🥪", cat: "Burgers", veg: false },
];

const CATEGORIES = ["All", "Snacks", "Burgers", "Pizza", "Meals", "Drinks"];

const DELIVERY_FEE = 20;
const CANTEEN_NAME = "Campus Bites";
const CANTEEN_UPI  = "campusbites@ybl";
const CANTEEN_OPEN = "8:00 AM – 9:00 PM";
