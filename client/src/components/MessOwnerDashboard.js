import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../api";

const statCardStyle = { background: "white", padding: "24px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" };
const comingSoonBadge = { backgroundColor: "#fff7ed", color: "#f97316", padding: "4px 10px", borderRadius: "8px", fontSize: "0.7rem", fontWeight: "600" };
const totalBadge = { backgroundColor: "#fff7ed", color: "#f97316", padding: "4px 10px", borderRadius: "8px", fontSize: "0.7rem", fontWeight: "600" };
const activeTabStyle = { padding: "10px 20px", borderRadius: "10px", background: "white", border: "1px solid #fed7aa", fontWeight: "600", color: "#ea580c", cursor: "pointer" };
const inactiveTabStyle = { padding: "10px 20px", borderRadius: "10px", background: "#fef3c7", border: "none", fontWeight: "600", color: "#92400e", cursor: "pointer" };
const formInputStyle = { flex: 1, padding: "12px 20px", borderRadius: "12px", border: "1px solid #fed7aa", backgroundColor: "#fffcf0", fontSize: "1rem", outline: "none" };
const selectStyle = { padding: "12px 15px", borderRadius: "12px", border: "1px solid #fed7aa", backgroundColor: "white", fontWeight: "600", color: "#92400e", cursor: "pointer" };
const addBtnStyle = { padding: "12px 25px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)", color: "white", fontWeight: "700", cursor: "pointer" };
const labelStyle = { display: "block", marginBottom: "8px", fontWeight: "600", color: "#92400e", fontSize: "0.9rem" };

function MessOwnerDashboard() {

  const [activeTab,setActiveTab] = useState("schedule");
  const [orders,setOrders] = useState([]);
  const [myMess,setMyMess] = useState(null);
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);

  const navigate = useNavigate();

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const [selectedScheduleDay,setSelectedScheduleDay] = useState("Monday");
  const [scheduleItem,setScheduleItem] = useState("");

  const [registrationForm,setRegistrationForm] = useState({
    messName:'',
    price:'',
    address:'',
    phone:'',
    isVeg:'true'
  });

  const [plansForm,setPlansForm] = useState({
    trial:'',
    weekly:'',
    monthly:''
  });

  const [profileForm,setProfileForm] = useState({
    messName:'',
    address:'',
    phone:'',
    imageUrl:''
  });

  useEffect(()=>{

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if(!storedUser || storedUser.role !== "owner"){
      navigate("/login");
      return;
    }

    setUser(storedUser);

    fetchMyMess(storedUser.email);
    fetchOrders();

  },[navigate]);

  const fetchOrders = ()=>{

    fetch(`${API}/api/orders`)
    .then(res=>res.json())
    .then(data=>setOrders(data))
    .catch(err=>console.log(err));

  };

  const fetchMyMess = (email)=>{

    fetch(`${API}/api/providers`)
    .then(res=>res.json())
    .then(data=>{

      const found = data.find(p=>p.email===email);

      if(found){

        setMyMess(found);

        if(found.subscriptionPlans){

          setPlansForm({
            trial:found.subscriptionPlans.trial.price,
            weekly:found.subscriptionPlans.weekly.price,
            monthly:found.subscriptionPlans.monthly.price
          });

        }

        setProfileForm({
          messName:found.messName || "",
          address:found.address || "",
          phone:found.phone || "",
          imageUrl:found.imageUrl || ""
        });

      }

      setLoading(false);

    })
    .catch(()=>setLoading(false));

  };

  const handleUpdateProfile = async(e)=>{

    e.preventDefault();

    try{

      const res = await fetch(`${API}/api/providers/${myMess._id}`,{
        method:"PUT",
        headers:{ "Content-Type":"application/json"},
        body:JSON.stringify(profileForm)
      });

      if(res.ok){

        const updated = await res.json();

        setMyMess(updated);

        alert("Profile updated successfully");

      }

    }catch(err){
      console.log(err);
    }

  };

  const handleUpdatePlans = async(e)=>{

    e.preventDefault();

    const updatedPlans = {
      trial:{ price:Number(plansForm.trial), duration:"1 Day"},
      weekly:{ price:Number(plansForm.weekly), duration:"7 Days"},
      monthly:{ price:Number(plansForm.monthly), duration:"30 Days"}
    };

    try{

      const res = await fetch(`${API}/api/providers/${myMess._id}`,{
        method:"PUT",
        headers:{ "Content-Type":"application/json"},
        body:JSON.stringify({ subscriptionPlans:updatedPlans })
      });

      if(res.ok){

        setMyMess({...myMess,subscriptionPlans:updatedPlans});

        alert("Subscription plans updated");

      }

    }catch(err){
      console.log(err);
    }

  };

  const handleStatusUpdate = async(orderId,status)=>{

    try{

      const res = await fetch(`${API}/api/orders/${orderId}`,{
        method:"PUT",
        headers:{ "Content-Type":"application/json"},
        body:JSON.stringify({status})
      });

      if(res.ok){

        fetchOrders();

      }

    }catch(err){
      console.log(err);
    }

  };

  const handleUpdateSchedule = async(e)=>{

    e.preventDefault();

    if(!scheduleItem.trim()) return;

    const currentDayMenu = myMess.weeklySchedule?.[selectedScheduleDay] || [];

    const updatedDayMenu = [...currentDayMenu,scheduleItem];

    const updatedSchedule = {
      ...(myMess.weeklySchedule || {}),
      [selectedScheduleDay]:updatedDayMenu
    };

    try{

      const res = await fetch(`${API}/api/providers/${myMess._id}`,{
        method:"PUT",
        headers:{ "Content-Type":"application/json"},
        body:JSON.stringify({weeklySchedule:updatedSchedule})
      });

      if(res.ok){

        setMyMess({...myMess,weeklySchedule:updatedSchedule});
        setScheduleItem("");

      }

    }catch(err){
      console.log(err);
    }

  };

  const handleCreateMess = async(e)=>{

    e.preventDefault();

    const payload = {

      messName:registrationForm.messName,
      pricePerMeal:Number(registrationForm.price),
      address:registrationForm.address,
      phone:registrationForm.phone,
      isVeg:registrationForm.isVeg==="true",

      weeklySchedule:{
        Monday:[],
        Tuesday:[],
        Wednesday:[],
        Thursday:[],
        Friday:[],
        Saturday:[],
        Sunday:[]
      },

      name:user.name,
      email:user.email,

      location:{
        type:"Point",
        coordinates:[79.0882,21.1458]
      },

      subscriptionPlans:{
        trial:{price:50,duration:"1 Day"},
        weekly:{price:350,duration:"7 Days"},
        monthly:{price:Number(registrationForm.price),duration:"30 Days"}
      }

    };

    try{

      const res = await fetch(`${API}/api/providers`,{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });

      if(res.ok){

        alert("Mess Registered Successfully");
        fetchMyMess(user.email);

      }

    }catch(err){
      console.log(err);
    }

  };

  if(!user || loading){

    return <div className="text-center mt-5">Loading...</div>;

  }

  if(user && !myMess){

    return(

      <div className="container py-5">

      <h2 className="mb-4">Register Your Mess</h2>

      <form onSubmit={handleCreateMess}>

      <input
      className="form-control mb-3"
      placeholder="Mess Name"
      value={registrationForm.messName}
      onChange={(e)=>setRegistrationForm({...registrationForm,messName:e.target.value})}
      />

      <input
      className="form-control mb-3"
      placeholder="Price"
      value={registrationForm.price}
      onChange={(e)=>setRegistrationForm({...registrationForm,price:e.target.value})}
      />

      <input
      className="form-control mb-3"
      placeholder="Address"
      value={registrationForm.address}
      onChange={(e)=>setRegistrationForm({...registrationForm,address:e.target.value})}
      />

      <button className="btn btn-warning">Create Mess</button>

      </form>

      </div>

    );

  }

  return(

  <div className="container py-5">

  <h2 className="mb-4">{myMess?.messName} Dashboard</h2>

  <button
  onClick={()=>{localStorage.removeItem("user");navigate("/login")}}
  className="btn btn-outline-dark mb-4"
  >
  Logout
  </button>

  </div>

  );

}

export default MessOwnerDashboard;
