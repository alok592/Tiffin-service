const mongoose = require('mongoose');
const Provider = require('./models/Provider');

// --- ✅ AAPKA SAHI LINK ---
const DB_LINK = "mongodb+srv://admin:arpita913089@cluster0.munveq4.mongodb.net/?appName=Cluster0";

// Connection Logic
mongoose.connect(DB_LINK)
  .then(() => {
    console.log("✅ Database Connected! Ab data daal raha hoon...");
    seedDB(); // <--- Ab ye Connection ke BAAD hi chalega
  })
  .catch(err => console.log("❌ Connection Error:", err));

const seedDB = async () => {
  try {
    // Purana data saaf karein
    await Provider.deleteMany({});
    console.log("🧹 Purana data saaf kiya...");
    
    const nagpurProviders = [
      {
        name: "Raju Bhau",
        email: "raju@saoji.com",
        phone: "919876543210",
        messName: "Saoji Asli Taste",
        address: "Plot 45, Pratap Nagar, Nagpur",
        pricePerMeal: 150,
        location: { type: "Point", coordinates: [79.0600, 21.1100] },
        isVeg: false,
        todaysMenu: ["Saoji Chicken", "Bhakri", "Thecha", "Rice"],
        rating: 4.9,
        reviews: 320,
        openingTime: "11:00",
        closingTime: "23:00",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600"
      },
      {
        name: "Anjali Tai",
        email: "anjali@varhadi.com",
        phone: "919876543210",
        messName: "Varhadi Thaat",
        address: "Gokulpeth, Dharampeth, Nagpur",
        pricePerMeal: 90,
        location: { type: "Point", coordinates: [79.0700, 21.1350] },
        isVeg: true,
        todaysMenu: ["Puran Poli", "Katachi Amti", "Rice", "Batata Bhaji"],
        rating: 4.7,
        reviews: 150,
        openingTime: "08:00",
        closingTime: "22:00",
        imageUrl: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600"
      },
      {
        name: "Student Mess",
        email: "student@apnaadda.com",
        phone: "919876543210",
        messName: "Apna Adda Mess",
        address: "Nandanvan, Near Engineering College, Nagpur",
        pricePerMeal: 60,
        location: { type: "Point", coordinates: [79.1200, 21.1300] },
        isVeg: true,
        todaysMenu: ["Dal Fry", "Jeera Rice", "Soyabean Bhaji", "Chapati"],
        rating: 4.0,
        reviews: 80,
        openingTime: "08:00",
        closingTime: "21:30",
        imageUrl: "https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg?auto=compress&cs=tinysrgb&w=600"
      },
      {
        name: "Shyam Sir",
        email: "shyam@itpark.com",
        phone: "919876543210",
        messName: "IT Park Tiffins",
        address: "Manish Nagar, Nagpur",
        pricePerMeal: 80,
        location: { type: "Point", coordinates: [79.0800, 21.0800] },
        isVeg: true,
        todaysMenu: ["Paneer Masala", "Roti", "Salad", "Gulab Jamun"],
        rating: 4.5,
        reviews: 200,
        openingTime: "09:00",
        closingTime: "22:30",
        imageUrl: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600"
      },
      {
        name: "Sitabuldi Special",
        email: "burdi@bhojnalay.com",
        phone: "919876543210",
        messName: "Burdi Bhojnalay",
        address: "Sitabuldi Main Market, Nagpur",
        pricePerMeal: 100,
        location: { type: "Point", coordinates: [79.0882, 21.1458] },
        isVeg: true,
        todaysMenu: ["Zunka Bhakar", "Kadhi", "Rice"],
        rating: 4.3,
        reviews: 110,
        openingTime: "10:00",
        closingTime: "23:00",
        imageUrl: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600"
      }
    ];

    await Provider.insertMany(nagpurProviders);
    console.log("🎉 Data Successfully Added! (Ab website par dikhega)");
  } catch (err) {
    console.log("❌ Error while seeding:", err.message);
  }
  
  // Connection band karein
  setTimeout(() => {
    mongoose.connection.close();
    console.log("👋 Connection Closed.");
  }, 2000);
};