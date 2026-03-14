import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from "../api";

function MessDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [mess, setMess] = useState(null);
  const [loading, setLoading] = useState(true);

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  const currentDayIndex = new Date().getDay();
  const todayName = days[currentDayIndex === 0 ? 6 : currentDayIndex - 1];

  const [selectedDay,setSelectedDay] = useState(todayName);

  const weeklyVegMenu = {
    Monday:["Aloo Matar Rassa","Yellow Dal Fry","Jeera Rice","4 Chapati","Salad"],
    Tuesday:["Besan Zunka","Thecha","Dal Tadka","Rice","Bhakri + Chapati"],
    Wednesday:["Chana Masala","Dal Fry","Rice","4 Chapati","Papad"],
    Thursday:["Bhindi Masala","Varan Bhaat","4 Chapati","Pickle"],
    Friday:["Baingan Bharta","Moong Dal","Rice","4 Chapati","Salad"],
    Saturday:["Mix Veg Korma","Dal Tadka","Jeera Rice","4 Chapati"],
    Sunday:["Paneer Butter Masala","Dal Makhani","Jeera Rice","Naan","Gulab Jamun"]
  };

  const weeklyNonVegMenu = {
    Monday:["Egg Curry","Dal Fry","Rice","Chapati"],
    Tuesday:["Chicken Masala","Rice","Bhakri"],
    Wednesday:["Anda Bhurji","Dal","Rice","Chapati"],
    Thursday:["Chicken Curry","Rice","Chapati"],
    Friday:["Egg Masala","Rice","Chapati"],
    Saturday:["Chicken Liver Fry","Dal","Rice"],
    Sunday:["Chicken Biryani","Raita","Boiled Egg"]
  };

  useEffect(()=>{

    fetch(`${API}/api/providers`)
    .then(res=>res.json())
    .then(data=>{
      const found = data.find(p=>p._id === id);
      setMess(found);
      setLoading(false);
    })
    .catch(()=>setLoading(false));

  },[id]);

  const handleOrder = async(planType="Daily")=>{

    const user = JSON.parse(localStorage.getItem("user"));

    if(!user){
      alert("Please login first");
      navigate("/login");
      return;
    }

    let orderPrice = mess.pricePerMeal;
    let duration = "1 Day";

    if(planType==="Trial"){
      orderPrice = mess.subscriptionPlans?.trial?.price || 100;
      duration = "1 Day";
    }

    if(planType==="Weekly"){
      orderPrice = mess.subscriptionPlans?.weekly?.price || 700;
      duration = "7 Days";
    }

    if(planType==="Monthly"){
      orderPrice = mess.subscriptionPlans?.monthly?.price || 2500;
      duration = "30 Days";
    }

    const payload = {

      customerName:user.name,
      mobile:user.email,
      messName:mess.messName,
      messId:mess._id,
      items:planType,
      price:orderPrice,
      status:"Pending",
      date:new Date(),
      planType,
      duration

    };

    try{

      const res = await fetch(`${API}/api/orders`,{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });

      if(res.ok){
        alert("Order placed successfully");
        navigate("/student-dashboard");
      }

    }catch(err){

      console.log(err);

    }

  };

  if(loading){
    return <div className="text-center mt-5">Loading...</div>
  }

  if(!mess){
    return <div className="text-center mt-5">Mess not found</div>
  }

  const ownerMenu = mess?.weeklySchedule?.[selectedDay];

  const displayMenu =
  ownerMenu && ownerMenu.length>0
  ? ownerMenu
  : mess?.isVeg
  ? weeklyVegMenu[selectedDay]
  : weeklyNonVegMenu[selectedDay];

  return(

  <div className="container py-5">

  <button onClick={()=>navigate(-1)} className="btn btn-light mb-4">
  ← Back
  </button>

  <div className="row">

  <div className="col-lg-5">

  <div className="card shadow-sm border-0">

  {mess.imageUrl ? (

  <img
  src={mess.imageUrl}
  alt={mess.messName}
  style={{height:"300px",objectFit:"cover"}}
  className="card-img-top"
  />

  ) : (

  <div style={{
  height:"300px",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  background:"#f1f5f9"
  }}>
  No Image
  </div>

  )}

  <div className="card-body">

  <h3>{mess.messName}</h3>

  <p className="text-muted">{mess.address}</p>

  <h4 className="text-warning">
  ₹{mess.subscriptionPlans?.monthly?.price || mess.pricePerMeal}
  </h4>

  </div>

  </div>

  </div>

  <div className="col-lg-7">

  <div className="card shadow-sm border-0 p-4">

  <h4 className="mb-3">Weekly Menu</h4>

  <div className="d-flex flex-wrap gap-2 mb-4">

  {days.map(day=>(
  <button
  key={day}
  onClick={()=>setSelectedDay(day)}
  className={`btn btn-sm ${selectedDay===day?"btn-warning":"btn-outline-dark"}`}
  >
  {day}
  </button>
  ))}

  </div>

  <ul>

  {displayMenu.map((item,index)=>(
  <li key={index}>{item}</li>
  ))}

  </ul>

  <hr/>

  <div className="d-flex gap-3 flex-wrap">

  <button
  onClick={()=>handleOrder("Trial")}
  className="btn btn-outline-dark"
  >
  Trial Plan
  </button>

  <button
  onClick={()=>handleOrder("Weekly")}
  className="btn btn-warning"
  >
  Weekly Plan
  </button>

  <button
  onClick={()=>handleOrder("Monthly")}
  className="btn btn-dark"
  >
  Monthly Plan
  </button>

  </div>

  </div>

  </div>

  </div>

  </div>

  );

}

export default MessDetails;
