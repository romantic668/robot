import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';



function App() {

  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [filteredData, setFilteredData] = useState(users);

  const handleSearch = (event) => {
    let name = searchName;
    let tag = searchTag;
    if (event.target.name === "name") {
      name = event.target.value.toLowerCase();
      setSearchName(name);
    } else {
      tag = event.target.value.toLowerCase();
      setSearchTag(tag);
    }
    let result = [];
    if (tag === "") {
      result = users.filter((user) => {
        return (user.firstName + " " + user.lastName).toLowerCase().search(name) !== -1;
      });
    } else {
      result = users.filter((user) => {
        let filter = false;
        if (user.tags.length !== 0) {
          user.tags.forEach(data => {
            if (data.toLowerCase().search(tag) !== -1) {
              filter = true;
            }

          });
        }

        return filter && (user.firstName + " " + user.lastName).toLowerCase().search(name) !== -1;
      });
    }

    setFilteredData(result);

  }



  const handleTag = (event, id) => {
    if (event.key === 'Enter') {
      let value = event.target.value;
      let result = [];
      result = users.map((data) => {
        if (data.id === id) {
          data.tags.push(value);
        }
        return data;
      });
      setFilteredData(result);
      event.currentTarget.value = "";
    }


  }

  const handleToggle = (id) => {

    let result = [];
    result = filteredData.map((data) => {
      if (data.id === id) {
        data.show = !data.show;
      }

      return data;
    });
    setFilteredData(result);

  }


  useEffect(() => {
    axios.get(`https://api.hatchways.io/assessment/students`)
      .then(res => {
        const persons = res.data.students;
        persons.map(person => {
          person.show = false;
          person.tags = [];
          return person;
        })
        setUsers(persons);
        setFilteredData(persons);
      })
  }, [])

  return (
    <div className="App">
      <input type="text" placeholder="Search by name" name="name" className="input-control input-group input-group-lg" onChange={(e) => handleSearch(e)} />
      <input type="text" placeholder="Search by tag" name="tag" className="input-control input-group input-group-lg" onChange={(e) => handleSearch(e)} />
      {filteredData.map(person =>
        <div className="container border-bottom" align="left" key={person.id}>
          <div className="row" >
            <img src={person.pic} alt={person.firstName} style={{ height: "10em" }} className="mt-4 border rounded-circle" />

            <div className="col-4 mt-2 ml-5 mb-4">
              <h1 className="font-weight-bold">{person.firstName.toUpperCase() + " " + person.lastName.toUpperCase()}</h1>
              <p className=" ml-3 mb-0">Email: {person.email}</p>
              <p className=" ml-3 mb-0">Comapny: {person.company}</p>
              <p className="ml-3 mb-0">Skill: {person.skill}</p>
              <p className="ml-3">Average: {person.grades.reduce((acc, curr) => parseInt(acc) + parseInt(curr)) / person.grades.length + "%"}</p>
              {person.show && <div className="ml-3">{person.grades.map((grade, index) => <p className=" mb-0" key={index}>Test {index}: &emsp;  {grade}%</p>)}</div>}
              <div className="ml-3  mt-3"> {person.tags.map((tag, index) => <span key={index} style={{ fontSize: "1.5em" }} className="mb-3 mr-2 badge badge-secondary">{tag}</span>)}</div>

              <input type="text" placeholder="Add a tag" onKeyPress={(e) => handleTag(e, person.id)} />
            </div>
            <div className=" mt-5 ml-auto">

              {person.show ? <span onClick={() => handleToggle(person.id)} align="right" style={{ fontSize: "2em" }} className=" btn-opacity glyphicon glyphicon-minus"></span> : <span onClick={() => handleToggle(person.id)} align="right" style={{ fontSize: "2em" }} className=" btn-opacity glyphicon glyphicon-plus"></span>
              }
            </div>

          </div>
        </div>
      )
      }
    </div >
  );
}



export default App;
