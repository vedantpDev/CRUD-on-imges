import { RegisterForm } from "./components";
import { signOut } from "firebase/auth";
import { auth } from "./firebase/db";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";

const buttonStyle = {
  border: "none",
  color: "white",
  padding: "15px 32px",
  textAlign: "center",
  textDecoration: "none",
  display: "inline-block",
  fontSize: "16px",
  margin: "4px 2px",
  cursor: "pointer",
  borderRadius: "8px",
};

function App() {
  const imgInputRef = useRef(null);
  const [img, setImg] = useState("");
  const [allImages, setAllImages] = useState([]);
  const [imgData, setimgData] = useState();
  const [updateImgId, setUpdateImgId] = useState();
  const [updatedImg, setUpdatedImg] = useState("");
  const [updateImgData, setUpdateImgData] = useState("");
  const [reRender, setReRender] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/getAllImages`)
      .then((res) => {
        setAllImages(res.data.data);
      })
      .catch((err) => console.log(err));
  }, [reRender]);

  const handleSignOut = async (e) => {
    e.preventDefault();
    await signOut(auth)
      .then((res) => {
        localStorage.removeItem("accessToken");
        navigate("/login-page");
      })
      .catch((err) => alert("error signing out"));
  };

  const handleFile = (e) => {
    e.preventDefault();
    setimgData(e.target.files[0]);
    setImg(URL.createObjectURL(e.target.files[0]));
  };

  const handleUploadImg = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", imgData);
    await axios
      .post(`${process.env.REACT_APP_SERVER_URL}/api/uploadImg`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setReRender(!reRender);
        setimgData();
        setImg("");
        imgInputRef.current.value = "";
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    await axios
      .delete(`${process.env.REACT_APP_SERVER_URL}/api/deleteImg/${id}`)
      .then((res) => setReRender(!reRender))
      .catch((err) => console.log(err));
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    setUpdateImgId(id);
  };

  const handleUpdateFile = (e, id) => {
    e.preventDefault();
    setUpdateImgData(e.target.files[0]);
    setUpdatedImg(URL.createObjectURL(e.target.files[0]));
  };

  const handleUploadNewImg = async (e, id) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", updateImgData);
    await axios
      .post(`${process.env.REACT_APP_SERVER_URL}/api/updateImg`, {
        imgId: id,
        ...updateImgData,
      })
      .then((res) => setReRender(!reRender))
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          width: "50%",
        }}
      >
        <form
          onSubmit={handleSignOut}
          encType="multipart/form-data"
          style={{
            borderRadius: "20px",
            border: "1px solid",
            padding: "10px",
            margin: "10px",
          }}
        >
          <input
            type="file"
            name="file"
            ref={imgInputRef}
            onChange={(e) => handleFile(e)}
          />
        </form>
        <div>
          {img && (
            <>
              <form onSubmit={handleUploadImg} style={{ margin: "20px" }}>
                <div style={{ textAlign: "center" }}>
                  <img style={{ height: "300px", width: "300px" }} src={img} />
                </div>
                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#2dbf71",
                    width: "100%",
                  }}
                  type="submit"
                >
                  Upload Img
                </button>
              </form>
            </>
          )}
          {allImages && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allImages.map((data, i) => (
                    <tr key={i}>
                      <td>
                        <img
                          src={`/${data.imgPath}`}
                          alt={`Image ${i}`}
                          style={{ height: "100px", width: "100px" }}
                        />
                      </td>
                      <td>
                        {updateImgId === data.imgId && (
                          <input
                            type="file"
                            name="file"
                            onChange={(e) => handleUpdateFile(e, data.imgId)}
                          />
                        )}
                      </td>
                      <td>
                        {updateImgId === data.imgId ? (
                          <>
                            <img
                              src={updatedImg}
                              alt={`Image ${i}`}
                              style={{ height: "100px", width: "100px" }}
                            />
                            <button
                              style={{
                                ...buttonStyle,
                                backgroundColor: "#007bff",
                                marginLeft: "10px",
                              }}
                              onClick={(e) => handleUploadNewImg(e, data.imgId)}
                            >
                              Upload New Image
                            </button>
                          </>
                        ) : (
                          <button
                            style={{
                              ...buttonStyle,
                              backgroundColor: "#007bff",
                              marginLeft: "10px",
                            }}
                            onClick={(e) => handleUpdate(e, data.imgId)}
                          >
                            Update
                          </button>
                        )}

                        <button
                          style={{
                            ...buttonStyle,
                            marginLeft: "10px",
                            backgroundColor: "red",
                          }}
                          onClick={(e) => handleDelete(e, data.imgId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <button
          style={{ ...buttonStyle, width: "100%", backgroundColor: "red" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;
