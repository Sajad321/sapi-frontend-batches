import React, { useState, useEffect, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
const apiUrl = process.env.API_URL;

function StudentsInstallments({ edit, sideBarShow }) {
  const [data, setData] = useState({
    students: [],
    installments: [],
  });
  const [searchType, setSearchType] = useState("0");
  const [search, setSearch] = useState("");
  const [search2, setSearch2] = useState("");
  const [searchedStudents, setSearchedStudents] = useState({ ...data });
  useEffect(() => {
    const getInstallments = async () => {
      try {
        const response = await fetch(`${apiUrl}/student-install`, {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        });
        const responseData = await response.json();
        setData({
          students: responseData.students,
          installments: responseData.installments.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          }),
        });

        setSearchedStudents({
          students: responseData.students,
          installments: responseData.installments.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          }),
        });
      } catch (error) {
        console.log(error.message);
      }
    };
    getInstallments();
  }, []);
  const handleBatchChange = (e) => {
    const getInstallments = async () => {
      try {
        const response = await fetch(`${apiUrl}/student-install`, {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        });
        const responseData = await response.json();
        setData({
          students: responseData.students,
          installments: responseData.installments.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          }),
        });

        setSearchedStudents({
          students: responseData.students,
          installments: responseData.installments.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          }),
        });
      } catch (error) {
        console.log(error.message);
      }
    };
    getInstallments();
  };
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSearchButton = (e) => {
    e.preventDefault();
    const reg = new RegExp(search, "i");
    if (searchType == "1") {
      setSearchedStudents([...students].filter((d) => d.name.match(reg)));
    } else if (searchType == "2") {
      setSearchedStudents([...students].filter((d) => d.institute.match(reg)));
    }
  };
  const handleEditButton = (student) => {
    edit(student);
  };
  const handleInstallmentsToggle = (studentIndex, id, received) => {
    if (searchType == "0") {
      const installmentIndex = data.students[
        studentIndex
      ].installment_received.findIndex((i) => i.id == id);
      let nee = [...data.students];
      let nee1 = [...nee[studentIndex].installment_received];
      nee1[installmentIndex] = {
        ...nee1[installmentIndex],
        received: received,
      };
      nee[studentIndex].installment_received[installmentIndex] =
        nee1[installmentIndex];
      setData({
        ...data,
        students: nee,
      });
    } else {
      const installmentIndex = searchedStudents.students.findIndex(
        (o) => o.id == id
      );
      let nee = [...searchedStudents.students];
      let nee1 = [...nee[studentIndex].installment_received];
      nee1[installmentIndex] = {
        ...nee1[installmentIndex],
        received: received,
      };
      nee[studentIndex].installment_received[installmentIndex] =
        nee1[installmentIndex];
      setSearchedStudents({
        ...data,
        students: nee,
      });
    }
  };
  const handleInstallmentsToggleButton = (index, id, received) => {
    const toggleInstallment = async () => {
      try {
        const response = await fetch(`${apiUrl}/installments/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ received: received == 0 ? 1 : 0 }),
        });

        const responseData = await response.json();
      } catch (error) {
        console.log(error.message);
        handleInstallmentsToggle(index, id, received);
        toast.warn("?????? ??????");
      }
    };
    toggleInstallment();
    handleInstallmentsToggle(index, id, received == 0 ? 1 : 0);
    toast.success("???? ???????????? ??????????");
  };
  const printTable = () => {
    let divToPrint = document.getElementById("print-table");
    newWin = window.open("");
    newWin.document.write(divToPrint.outerHTML);
    newWin.print();
    newWin.close();
  };
  const render_installments = (student, installment, index) => {
    const installment_received = student.installment_received.filter(
      (installment_received) =>
        installment_received.installment_id == installment.id
    )[0];
    if (installment_received) {
      if (
        installment_received.received == "1" &&
        installment.id == installment_received.installment_id
      ) {
        return (
          <td className="" key={installment_received.id}>
            <FontAwesomeIcon
              icon="check-circle"
              size="2x"
              color="green"
              onClick={() =>
                handleInstallmentsToggleButton(
                  index,
                  installment_received.id,
                  installment_received.received
                )
              }
            />
          </td>
        );
      } else if (
        installment_received.received == "0" &&
        installment.id == installment_received.installment_id
      ) {
        return (
          <td className="" key={installment_received.id}>
            <FontAwesomeIcon
              icon="times-circle"
              size="2x"
              color="red"
              onClick={() =>
                handleInstallmentsToggleButton(
                  index,
                  installment_received.id,
                  installment_received.received
                )
              }
            />
          </td>
        );
      }
    } else {
      return <td className="" key={installment.id}></td>;
    }
  };

  const render_table = () => {
    if (searchType == "0") {
      const render_data = data.students.map((student, index) => {
        return (
          <tr key={student.id} className="font-weight-bold">
            <td className="text-white">{student.name}</td>
            {data.installments.map((installment) => {
              return render_installments(student, installment, index);
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
              {data.installments.map((installment) => {
                return (
                  <th key={installment.id}>
                    ???????? {installment.institute_name}
                    <br />
                    ?????????? {installment.name}
                    <br />
                    {installment.date}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>{render_data}</tbody>
        </table>
      );
    } else {
      const render_data = searchedStudents.students.map((student) => {
        return (
          <tr key={student.id} className="font-weight-bold">
            <td className="text-white">{student.name}</td>
            {searchedStudents.installments.map((installment) => {
              return render_installments(student, installment, index);
            })}
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
              {searchedStudents.installments.map((installment) => {
                return (
                  <th key={installment.id}>
                    ???????? {installment.institute_name}
                    <br />
                    ?????????? {installment.name}
                    <br />
                    {installment.date}
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
            id="searchStudent"
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
            id="searchInstitute"
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
                          onClick={handleSearchButton}
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
                    id="batch"
                    onChange={handleBatchChange}
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
                  <h2 className="text text-white">?????????? ????????????</h2>
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

export default StudentsInstallments;
