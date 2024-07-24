import { useState, useEffect } from "react";
import { BiCalendar } from "react-icons/bi";
import Search from "./components/Search";
import AddAppointment from "./components/AddAppointment";
import AppointmentInfo from "./components/AppointmentInfo";
import appointmentData from "./data.json";

function App() {
  const [appointmentList, setAppointmentList] = useState(
    JSON.parse(localStorage.getItem("appointments")) || appointmentData
  );
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("petName");
  const [orderBy, setOrderBy] = useState("asc");

  const filteredAppointments = appointmentList
    .filter((appointment) => {
      return (
        appointment.petName.toLowerCase().includes(query.toLowerCase()) ||
        appointment.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        appointment.aptNotes.toLowerCase().includes(query.toLowerCase())
      );
    })
    .sort((a, b) => {
      let order = orderBy === "asc" ? 1 : -1;
      return a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
        ? -1 * order
        : 1 * order;
    });

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointmentList));
  }, [appointmentList]);

  function deleteAppointment(id) {
    setAppointmentList(
      appointmentList.filter((appointment) => appointment.id !== id)
    );
  }

  function queryChange(value) {
    setQuery(value);
  }

  function sortByChange(mySort) {
    setSortBy(mySort);
  }

  function orderByChange(myOrder) {
    setOrderBy(myOrder);
  }

  function sendAppointment(myAppointment) {
    setAppointmentList((prev) => [...prev, myAppointment]);
  }

  function getLastId() {
    const id = appointmentList.reduce((max, appointment) => {
      const id = Number(appointment.id);
      if (id > max) {
        max = id;
      }
      return max;
    }, 0);
    return id;
  }

  return (
    <div className="container mx-auto mt-3 font-thin">
      <h1 className="text-3xl flex items-center gap-1 mb-5">
        <BiCalendar className=" text-red-500" />
        Pet Appointments
      </h1>
      <AddAppointment sendAppointment={sendAppointment} lastId={getLastId} />
      <Search
        query={query}
        queryChange={queryChange}
        sortBy={sortBy}
        sortByChange={sortByChange}
        orderBy={orderBy}
        orderByChange={orderByChange}
      />
      <ul className="divide-y divide-gray-200">
        {filteredAppointments.map((appointment) => (
          <AppointmentInfo
            appointment={appointment}
            key={appointment.id}
            deleteAppointment={deleteAppointment}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
