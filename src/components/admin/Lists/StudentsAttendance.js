import React, { useState, useEffect, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
const apiUrl = process.env.API_URL;

function StudentsAttendance({ edit, sideBarShow }) {
  const [data, setData] = useState({
    students: [],
    attendance: [],
  });
  const [searchType, setSearchType] = useState("0");
  const [search, setSearch] = useState("");
  const [search2, setSearch2] = useState("");
  const [searchedDoctors, setSearchedDoctors] = useState({ ...data });
  useEffect(() => {
    const getAttendance = async () => {
      try {
        const response = await fetch(`${apiUrl}/students-attendance`, {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        });
        const responseData = await response.json();
        setData({
          students: responseData.students,
          attendance: responseData.attendance,
        });
        setSearchedDoctors(responseData.doctors);
      } catch (error) {
        console.log(error.message);
      }
    };
    getAttendance();
  }, []);
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSearch2Change = (e) => {
    setSearch2(e.target.value);
  };
  const handleSearchButton = (e) => {
    e.preventDefault();
    const reg = new RegExp(search, "i");
    if (searchType == "1") {
      setSearchedDoctors(
        [...doctors].filter(
          (d) => d.date_of_joining <= search2 && d.date_of_joining >= search
        )
      );
    } else if (searchType == "2") {
      setSearchedDoctors([...doctors].filter((d) => d.name.match(reg)));
    } else if (searchType == "3") {
      setSearchedDoctors([...doctors].filter((d) => d.zone.match(reg)));
    } else if (searchType == "4") {
      setSearchedDoctors([...doctors].filter((d) => d.speciality.match(reg)));
    }
  };
  const handleEditButton = (doctor) => {
    edit(doctor);
  };
  const handleAttendanceToggle = (studentIndex, id, attended) => {
    if (searchType == "0") {
      const attendanceIndex = data.students[
        studentIndex
      ].student_attendance.findIndex((i) => i.student_attendance_id == id);
      let nee = [...data.students];
      let nee1 = [...nee[studentIndex].student_attendance];
      nee1[attendanceIndex] = {
        ...nee1[attendanceIndex],
        attended: attended,
      };
      nee[studentIndex].student_attendance[attendanceIndex] =
        nee1[attendanceIndex];
      setData({
        ...data,
        students: nee,
      });
    } else {
      const Sindex = state.searchedOrders.findIndex((o) => o.id == order_id);
      let Snee = [...state.searchedOrders];
      Snee[Sindex] = { ...Snee[Sindex], approval };
      setState({
        ...state,
        searchedOrders: Snee,
      });
    }
  };
  const handleAttendanceToggleButton = (index, id, attended) => {
    const toggleAttendance = async () => {
      try {
        const response = await fetch(`${apiUrl}/attendance/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ attended: attended == 0 ? 1 : 0 }),
        });

        const responseData = await response.json();
      } catch (error) {
        console.log(error.message);
        handleAttendanceToggle(index, id, attended);
        toast.warn("?????? ??????");
      }
    };
    toggleAttendance();
    handleAttendanceToggle(index, id, attended == 0 ? 1 : 0);
    toast.success("???? ???????????? ??????????");
  };
  const printTable = () => {
    let divToPrint = document.getElementById("print-table");
    newWin = window.open("");
    newWin.document.write(divToPrint.outerHTML);
    newWin.print();
    newWin.close();
  };
  const renderAttendance = (student, attendance, index) => {
    const student_attendance = student.student_attendance.filter(
      (student_attendance) => student_attendance.attendance_id == attendance.id
    )[0];
    if (student_attendance) {
      if (
        student_attendance.attended == "1" &&
        attendance.id == student_attendance.attendance_id
      ) {
        return (
          <td className="" key={student_attendance.student_attendance_id}>
            <FontAwesomeIcon
              icon="check-circle"
              size="2x"
              color="green"
              onClick={() =>
                handleAttendanceToggleButton(
                  index,
                  student_attendance.student_attendance_id,
                  student_attendance.attended
                )
              }
            />
          </td>
        );
      } else if (
        student_attendance.attended == "0" &&
        attendance.id == student_attendance.attendance_id
      ) {
        return (
          <td className="" key={student_attendance.student_attendance_id}>
            <FontAwesomeIcon
              icon="times-circle"
              size="2x"
              color="red"
              onClick={() =>
                handleAttendanceToggleButton(
                  index,
                  student_attendance.student_attendance_id,
                  student_attendance.attended
                )
              }
            />
          </td>
        );
      }
    } else {
      return <td className="" key={attendance.id}></td>;
    }
  };

  const render_table = () => {
    if (searchType == "0") {
      const render_data = data.students.map((student, index) => {
        return (
          <tr key={student.id} className="font-weight-bold">
            <td className="text-white">{student.name}</td>
            {data.attendance.map((attendance) => {
              return renderAttendance(student, attendance, index);
            })}
            {/* <td>
              <button
                onClick={() => handleEditButton(student)}
                className="btn btn-secondary text-white"
              >
                ??????????
              </button>
            </td> */}
          </tr>
        );
      });
      return (
        <table
          className="table table-striped table-bordered table-hover text"
          dir="rtl"
          id="print-table"
        >
          <thead className="thead-dark">
            <tr>
              <th>??????????</th>
              {data.attendance.map((attendance) => {
                return <th key={attendance.id}>{attendance.date}</th>;
              })}
            </tr>
          </thead>
          <tbody>{render_data}</tbody>
        </table>
      );
    } else {
      const render_data = searchedDoctors.map((doctor) => {
        return (
          <tr key={doctor.id} className="font-weight-bold">
            <td>{doctor.name}</td>
            <td>
              {doctor.pharmacies.map((pharmacy) => {
                if (doctor.pharmacies.length == 1) {
                  return `${pharmacy.name}`;
                } else {
                  return `${pharmacy.name}, `;
                }
              })}
            </td>
            {renderAttendance(doctor.report_activity)}
            <td>
              <button
                onClick={() => handleEditButton(doctor)}
                className="btn btn-secondary text-white"
              >
                ??????????
              </button>
            </td>
          </tr>
        );
      });
      return (
        <table
          className="table table-striped table-bordered table-hover text"
          dir="rtl"
          id="print-table"
        >
          <thead className="thead-dark">
            <tr>
              <th>??????????</th>
              {searchedDoctors.map((doctor) => {
                return (
                  <th key={doctor.id}>
                    {doctor.name}
                    <br />
                    {doctor.date}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>{render_data}</tbody>
        </table>
      );
    }
  };
  const searchBar = () => {
    if (searchType == "0") {
      return (
        <div className="col-7">
          <p className="form-control text">?????? ?????? </p>
        </div>
      );
    } else if (searchType == "1") {
      return (
        <div className="col-7">
          <input
            type="text"
            className="form-control text"
            id="searchDoctor"
            onChange={handleSearchChange}
            placeholder="????????"
          ></input>
        </div>
      );
    } else if (searchType == "2") {
      return (
        <div className="col-7">
          <input
            type="text"
            className="form-control text"
            id="searchZone"
            onChange={handleSearchChange}
            placeholder="????????"
          ></input>
        </div>
      );
    }
  };
  return (
    <section className="main">
      <div className="row pt-5 m-0">
        <div
          className={
            sideBarShow
              ? "width-others-wide mr-auto main-view"
              : "width-others-narrow mr-auto main-view"
          }
          id="main-view"
        >
          <div className="row pt-md-3 pr-2 pl-2 mt-md-3 mb-5">
            <div className="col-12">
              <div className="row mt-3">
                <div className="col-8">
                  <form onSubmit={printTable}>
                    <div className="form-group row mt-1">
                      <div className="col-2 text">
                        <button
                          type="submit"
                          className="btn btn-secondary btn-sm mt-1"
                        >
                          ????????
                        </button>
                      </div>
                      <div className="col-3 col-sm-2">
                        <select
                          id="searchType"
                          onChange={handleSearchTypeChange}
                          className="form-control"
                          dir="rtl"
                        >
                          <option value="0" defaultValue>
                            ????????
                          </option>
                          <option value="1">??????????</option>
                          <option value="2">????????????</option>
                        </select>
                      </div>
                      {searchBar()}
                    </div>
                  </form>
                </div>
                <div className="col-1 offset-1 pt-1">
                  <select
                    id="searchType"
                    onChange={handleSearchTypeChange}
                    className="form-control"
                    dir="rtl"
                  >
                    <option value="0" defaultValue>
                      ????????????
                    </option>
                    <option value="1">??????????</option>
                    <option value="2">????????????</option>
                  </select>
                </div>
                <div className="col-2">
                  <h2 className="text text-white">???????? ????????????</h2>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="table-responsive">{render_table()}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudentsAttendance;
