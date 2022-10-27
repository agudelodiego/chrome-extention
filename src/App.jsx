import React,{useState} from 'react';

const App = () => {

  const [rol,setRol] = useState('react js');
  const [contry,setContry] = useState('102199904');
  const [limit,setLimit] = useState(4);
  const handleEvent = async(event)=>{
    event.preventDefault();
    chrome.runtime.sendMessage({
      "message":"search vacancies",
      "role":rol,
      "contry":contry,
      "limit":limit
    });
  }
  
  return (
    <form id="userInput" onSubmit={handleEvent}>
      <div className="mb-3">
        <label for="exampleInputEmail1" className="form-label fs-5">Rol</label>
        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={rol} onChange={e=>setRol(e.target.value)} />
      </div>
      <div className="mb-3">
        <label for="exampleInputEmail1" className="form-label fs-5">Select the limit</label>
        <input type="number" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={limit} onChange={e=>setLimit(e.target.value)}/>
      </div>
      <div className="mb-3">
        <label className="form-label fs-5">Select a contry</label>
        <select className="form-select" aria-label="Default select example" onChange={e=>setContry(e.target.value)} >
          <option value="102199904" selected>Canada</option>
          <option value="107163507">Colombia</option>
          <option value="100446943">Argentina</option>
          <option value="91000006">Alemania</option>
        </select>
      </div>
      <div className="w-100 d-flex justify-content-center">
        <button type="submit" className="btn btn-primary">Submit</button>
      </div>
    </form>
  );
};
export default App;