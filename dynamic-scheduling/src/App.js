import React, { useState } from 'react';
import Login from './components/Login.jsx';
import Modal from './assets/Modal.jsx';
import Button from './assets/Button.jsx';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('User') ? JSON.parse(localStorage.getItem('User')) : null;

  console.log(token);
  console.log(modalVisible);
  console.log(user);

  const handlePush = () => {
    if (user !== null) {
      if (user.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate(`/dashboard/${user._id}`);
      }
    } else {
      setModalVisible(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("User");
    navigate('/');
  }

  return (
    <div className='relative'>
      <div className='flex max-w-[1200px] mx-auto justify-between mt-20 mb-24'>
        <div className='flex flex-col items-start w-[45rem] gap-7'>
          <div className='flex flex-col gap-6'>
            <h1 className='w-[32rem] rounded-lg duration-150 text-white text-6xl font-extrabold leading-[4rem] hover:ring-1 hover:ring-[#00BD9B]'>
              Manage personal finance <span>3x</span> better
            </h1>
            <p className='w-[35rem] text-md hover:ring-1 hover:ring-[#00BD9B] rounded-lg duration-200 delay-200 leading-[1.5rem] font-normal text-gray-400'>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate dignissimos reiciendis autem id sunt...
            </p>
          </div>
          <div className='flex justify-start items-center gap-5'>
            <Button
              url={handlePush}
              text={user !== null ? "Dashboard" : "Get Started"}
              bgColor={"#00BD9B"}
              textColor={"black"}
            />
            <Button text={"Learn more"} bgColor={"transparent"} textColor={"#00BD9B"} />
          </div>
        </div>

        <div>
          {/* <img src="./Images/landing-img.png" alt="img" className=' w-[32rem] ' /> */}
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <Login />
        </Modal>
        {user !== null && <button onClick={logout}>Logout</button>}
      </div>
    </div>
  );
}

export default App;
